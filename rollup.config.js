import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
	entry: 'index.js',
	targets: [{
		dest: 'seriously.js',
		format: 'amd',
		name: 'Seriously',
		amd: {
			id: 'seriously'
		}
	}],
	plugins: [
		progress({
			clearLine: false
		}),
		uglify({}, minify),
		filesize()
	]
};
