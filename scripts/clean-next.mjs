import { rm } from "node:fs/promises";

const paths = [".next", ".turbo"];

await Promise.all(
  paths.map(async (target) => {
    try {
      await rm(target, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }),
);

