import typescript from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"
import { babel } from "@rollup/plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import serve from "rollup-plugin-serve"
import scss from "rollup-plugin-scss"

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
		scss({ output: "dist/styles.css" }),
		resolve({
			jsnext: true,
			main: true,
			browser: true
		}),
		commonjs(),
		babel({ exclude: "node_modules/**", babelHelpers: "bundled" }),
		serve("./")
	]
}
