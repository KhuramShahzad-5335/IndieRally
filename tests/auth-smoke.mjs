import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import { setTimeout } from "node:timers/promises";
const origin = "http://127.0.0.1:3197";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3197"], {stdio:"ignore"});
const email = "smoke-" + randomUUID() + "@example.invalid";
const password = randomUUID();
const db = new MongoClient(process.env.MONGODB_URI, {serverSelectionTimeoutMS:8000});
let cookie = "";
const get = (path) => fetch(origin + path, {headers:{cookie},redirect:"manual"});
async function post(path, fields, index=0) {
  const html = await (await get(path)).text();
  const markers = [...html.matchAll(/name="(\$ACTION_(?:REF|ID)_[^"]+)"/g)];
  const marker = markers[index][1];
  const payload = new FormData();
  payload.set(marker,"");
  const prefix = "$ACTION_" + marker.slice(12) + ":";
  for (const [,key,value] of html.matchAll(/name="(\$ACTION_[^"]+)" value="([^"]*)"/g)) {
    if (key === marker || key.startsWith(prefix)) payload.set(key,value.replaceAll("&quot;",'"').replaceAll("&amp;","&"));
  }
  for (const [key,value] of Object.entries(fields)) payload.set(key,value);
  const response = await fetch(origin + path,{method:"POST",body:payload,headers:{origin,cookie},redirect:"manual"});
  cookie = response.headers.get("set-cookie")?.split(";")[0] ?? cookie;
  assert.equal(response.status,303,path);
}
try {
  for(let i=0;;i++){try {assert.equal((await get("/login")).status,200);break;}catch(e){if(i===30)throw e;await setTimeout(500);}}
  for(const route of ["/submit","/dashboard"]) assert.equal((await get(route)).headers.get("location"),"/login");
  await post("/signup",{email,password,name:"Smoke Founder"});
  assert.match(await (await get("/dashboard")).text(), /haven’t submitted/);
  assert.equal((await get("/dashboard/unknown")).status,404);
  const name = "Smoke " + randomUUID();
  await post("/submit",{name,maker:"Smoke Test",website:"https://example.com",tagline:"Checking authenticated submissions",category:"Design",pricing:"Free",description:"A temporary submission for the authenticated workflow smoke test."});
  assert.ok((await (await get("/dashboard")).text()).includes(name));
  await post("/dashboard",{});
  assert.equal((await get("/dashboard")).headers.get("location"),"/login");
  await post("/login",{email,password});
  assert.ok((await (await get("/dashboard")).text()).includes(name));
  console.log("MongoDB signup, sign-in, sign-out, protected routes and founder submission passed.");
} finally {
  server.kill();
  try {
    const data = db.db(process.env.MONGODB_DB || "launchdeck");
    const account = await data.collection("accounts").findOne({email});
    if(account){
      await data.collection("launchdeck").deleteMany({ownerId:account._id});
      await data.collection("sessions").deleteMany({ownerId:account._id});
      await data.collection("accounts").deleteOne({_id:account._id});
    }
  } finally { await db.close(); }
}
