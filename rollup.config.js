import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
import babel from 'rollup-plugin-babel';

export default {
	entry: 'index.js',
	targets: [{
		dest: 'seriously.js',
		format: 'amd',
		name: 'Seriously'
	}],
	intro: 'if (typeof window !== "undefined") {',
	outro: '}',
	plugins: [
		progress({
			clearLine: false
		}),
		babel({
			exclude: 'node_modules/**'
		}),
		// uglify({}, minify),
		filesize()
	]
};
