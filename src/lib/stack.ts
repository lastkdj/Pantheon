import type { TaskStatus } from "./schema";

// Bottom to top. One gradient per status, used in the legend and the rings too.
export const STACK: { status: TaskStatus; label: string; from: string; to: string; dot: string }[] = [
  { status: "done", label: "Done", from: "#2DD4A0", to: "#0A9495", dot: "bg-mint" },
  { status: "review", label: "In review", from: "#E58BFF", to: "#8B2CF5", dot: "bg-magenta" },
  { status: "in-progress", label: "In progress", from: "#02C3FF", to: "#2D5BFF", dot: "bg-cyan" },
  { status: "todo", label: "To do", from: "#7F9DFF", to: "#2D5BFF", dot: "bg-azure" },
  { status: "blocked", label: "Blocked", from: "#FF8A9E", to: "#E0334F", dot: "bg-coral" },
];

