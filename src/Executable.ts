import { Job } from "./job";
import { Blob } from "./blob";

export interface Executable {
  execute: () => Promise<Job>;
  to: (destination: string | Blob) => Executable;
}