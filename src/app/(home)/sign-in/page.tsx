import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";
import { Button } from "@/components/ui/button";

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function SignInPage(props: SignInPageProps) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl ?? "/";
  const error = searchParams.error;
  const hasGoogleAuth = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const hasGithubAuth = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);

  if (session) {
    redirect(callbackUrl);
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Sign In</h1>
      <div className="mb-4 rounded-md border bg-slate-50 p-3 text-xs text-slate-700">
        Demo credentials: <span className="font-medium">john@amazona.dev</span> /{" "}
        <span className="font-medium">123456</span>
      </div>
      {error === "CredentialsSignin" && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Invalid email or password. Please try again.
        </div>
      )}
      <form
        action={async (formData) => {
          "use server";
          const email = String(formData.get("email") ?? "");
          const password = String(formData.get("password") ?? "");
          const redirectTo = String(formData.get("redirectTo") ?? "/");

          try {
            await signIn("credentials", {
              email,
              password,
              redirectTo,
            });
          } catch (error) {
            if (error instanceof AuthError && error.type === "CredentialsSignin") {
              redirect(`/sign-in?error=CredentialsSignin&callbackUrl=${encodeURIComponent(redirectTo)}`);
            }
            throw error;
          }
        }}
        className="space-y-3"
      >
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <form
        action={async () => {
          "use server";
          try {
            await signIn("credentials", {
              email: "john@amazona.dev",
              password: "123456",
              redirectTo: callbackUrl,
            });
          } catch (error) {
            if (error instanceof AuthError && error.type === "CredentialsSignin") {
              redirect(`/sign-in?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`);
            }
            throw error;
          }
        }}
        className="mt-3"
      >
        <Button type="submit" variant="outline" className="w-full">
          Use Demo Account
        </Button>
      </form>

      {(hasGoogleAuth || hasGithubAuth) && (
        <div className="mt-4 space-y-2">
          {hasGoogleAuth && (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: callbackUrl });
              }}
            >
              <Button type="submit" variant="outline" className="w-full">
                Continue with Google
              </Button>
            </form>
          )}
          {hasGithubAuth && (
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: callbackUrl });
              }}
            >
              <Button type="submit" variant="outline" className="w-full">
                Continue with GitHub
              </Button>
            </form>
          )}
        </div>
      )}

      {!hasGoogleAuth && !hasGithubAuth && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          OAuth is not configured yet. Add provider credentials in environment variables to enable
          Google/GitHub sign-in.
        </div>
      )}
    </section>
  );
}
