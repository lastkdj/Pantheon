import Link from "next/link";
import { projects } from "@/lib/config";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="font-cinzel text-sm font-bold tracking-[0.22em] text-bronze">PANTHEON</p>
      <h1 className="mt-4 text-3xl">That page does not exist</h1>
      <p className="mt-3 text-stone">The task, project or section was not found. It may have been renamed or removed from the project files.</p>
      <Link href={`/p/${projects[0].id}`} className="mt-6 inline-block w-fit rounded-md bg-bronze px-4 py-2 text-sm font-semibold text-ink hover:bg-bronze-hi">
        Go to {projects[0].name}
      </Link>
    </main>
  );
}
