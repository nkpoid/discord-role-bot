import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  platform: "node",
  bundle: true,
}).then(() => {
  console.log("build succeed");
});
