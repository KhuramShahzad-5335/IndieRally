import { AuthPage } from "@/components/auth/auth-page";
export const metadata = { title: "Create an account", robots: { index: false } };
export default async function Signup({searchParams}:{searchParams:Promise<{vote?:string}>}) { return <AuthPage mode="signup" vote={(await searchParams).vote}/>; }
