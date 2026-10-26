import { cache } from "react";
import { loadProject } from "./load";

/** One load per request, shared by the layout and the page. */
export const getLoaded = cache(loadProject);
