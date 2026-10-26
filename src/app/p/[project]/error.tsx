"use client";

export default function ProjectError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="panel max-w-xl p-6" role="alert">
      <h1 className="text-2xl">This project could not be loaded</h1>
      <p className="mt-2 text-sm text-mist">
        The project&apos;s files could not be read or parsed{error.digest ? ` (reference ${error.digest})` : ""}. Check that the paths in
        the project config exist in the repo, then try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn-primary mt-4"
      >
        Try again
      </button>
    </div>
  );
}
