import { AuthPage } from "@/components/auth/auth-page";
export const metadata = { title: "Sign in", robots: { index: false } };
export default async function Login({searchParams}:{searchParams:Promise<{vote?:string;reset?:string;inquiry?:string}>}) { const {vote,reset,inquiry}=await searchParams; return <AuthPage mode="login" inquiry={inquiry} vote={vote} reset={reset==="1"}/>; }
