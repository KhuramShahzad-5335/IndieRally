import { AuthPage } from "@/components/auth/auth-page";
export const metadata = { title: "Sign in", robots: { index: false } };
export default async function Login({searchParams}:{searchParams:Promise<{vote?:string;reset?:string}>}) { const {vote,reset}=await searchParams; return <AuthPage mode="login" vote={vote} reset={reset==="1"}/>; }
