import Link from "next/link";
import { projects } from "@/lib/config";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="text-sm font-bold tracking-[0.22em] text-violet">PANTHEON</p>
      <h1 className="mt-4 text-3xl">That page does not exist</h1>
      <p className="mt-3 text-mist">The task, project or section was not found. It may have been renamed or removed from the project files.</p>
      <Link href={`/p/${projects[0].id}`} className="btn-primary mt-6 w-fit">
        Go to {projects[0].name}
      </Link>
    </main>
  );
}
