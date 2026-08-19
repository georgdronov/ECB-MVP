import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return <main className="flex min-h-screen items-center justify-center px-4 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-10 flex items-center justify-center gap-2 text-lg font-bold"><span className="grid size-8 place-items-center rounded-lg bg-accent text-sm text-white">H</span>Helply</Link><div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border sm:p-8"><h1 className="text-2xl font-bold tracking-tight">Create your workspace</h1><p className="mt-2 mb-7 text-sm text-muted">Turn your company knowledge into a helpful chatbot.</p><AuthForm mode="register" /><p className="mt-6 text-center text-sm text-muted">Already have an account? <Link className="font-semibold text-accent hover:underline" href="/login">Sign in</Link></p></div></div></main>;
}
