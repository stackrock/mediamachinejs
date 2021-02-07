import { Job } from "./job";

export interface Executable {
  execute: () => Promise<Job>;
}