import Link from "next/link";

export default function SignUpPage() {
  return (
    <section className="mx-auto w-full max-w-md rounded-xl border bg-white p-6">
      <h1 className="mb-2 text-2xl font-bold">Create Account</h1>
      <p className="text-sm text-slate-600">
        Registration flow will be added in the next step. Use seeded credentials on the sign-in page
        for now.
      </p>
      <Link href="/sign-in" className="mt-4 inline-block text-sm font-medium text-slate-900 underline">
        Go to sign in
      </Link>
    </section>
  );
}
