import { auth, signIn, signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <main className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-gray-600">Sign in to manage your videos and summaries.</p>
        <form action={async () => { "use server"; await signIn("google"); }}>
          <button className="rounded bg-black px-4 py-2 text-white">Sign in with Google</button>
        </form>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action={async () => { "use server"; await signOut(); }}>
          <button className="rounded border px-3 py-1">Sign out</button>
        </form>
      </div>
      <div className="rounded border bg-white p-4">
        <p className="text-gray-700">Signed in as {session.user.email}</p>
      </div>
    </main>
  );
}


