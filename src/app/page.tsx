import { redirect } from "next/navigation";
import { projects } from "@/lib/config";

export default function Home() {
  redirect(`/p/${projects[0].id}`);
}
