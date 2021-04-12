import typescript from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"
import { babel } from "@rollup/plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import serve from "rollup-plugin-serve"

export default {
	input: "src/index.ts",
	output: [
		{
			file: "dist/bundle.esm.js",
			format: "esm",
			plugins: [terser()]
		}
	],
	plugins: [
		typescript({ include: "**/*.{ts,js}" }),
		resolve({
			jsnext: true,
			main: true,
			browser: true
		}),
		commonjs(),
		babel({ exclude: "node_modules/**", babelHelpers: "bundled" }),
		serve("./")
	]
	// watch: {
	// 	// chokidar: {
	// 	//   // if the chokidar option is given, rollup-watch will
	// 	//   // use it instead of fs.watch. You will need to install
	// 	//   // chokidar separately.
	// 	//   //
	// 	//   // this options object is passed to chokidar. if you
	// 	//   // don't have any options, just pass `chokidar: true`
	// 	// },
	// 	exclude: ["node_modules/**"]
	// }
}
