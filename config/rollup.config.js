import invariantPlugin from "rollup-plugin-invariant";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser as minify } from "rollup-plugin-terser";
import packageJson from "../package.json";

const distDir = "./dist";

const external = ["@apollo/client", "ts-invariant", "graphql/language/printer"];

function prepareESM(input, outputDir) {
  return {
    input,
    external,
    output: {
      dir: outputDir,
      format: "esm",
      sourcemap: true,
    },
    // The purpose of this job is to ensure each `./dist` ESM file is run
    // through the `invariantPlugin`, with any resulting changes added
    // directly back into each ESM file. By setting `preserveModules`
    // to `true`, we're making sure Rollup doesn't attempt to create a single
    // combined ESM bundle with the final result of running this job.
    preserveModules: true,
    plugins: [
      nodeResolve(),
      invariantPlugin({
        // Instead of completely stripping InvariantError messages in
        // production, this option assigns a numeric code to the
        // production version of each error (unique to the call/throw
        // location), which makes it much easier to trace production
        // errors back to the unminified code where they were thrown,
        // where the full error string can be found. See #4519.
        errorCodes: true,
      }),
    ],
  };
}

function prepareCJS(input, output) {
  return {
    input,
    external,
    output: {
      file: output,
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    plugins: [nodeResolve()],
  };
}

function prepareCJSMinified(input) {
  return {
    input,
    output: {
      file: input.replace(".js", ".min.js"),
      format: "cjs",
    },
    plugins: [
      minify({
        mangle: {
          toplevel: true,
        },
        compress: {
          toplevel: true,
          global_defs: {
            "@process.env.NODE_ENV": JSON.stringify("production"),
          },
        },
      }),
    ],
  };
}

function rollup() {
  return [
    prepareESM(packageJson.module, distDir),
    prepareCJS(packageJson.module, packageJson.main),
    prepareCJSMinified(packageJson.main),
  ];
}

export default rollup();
