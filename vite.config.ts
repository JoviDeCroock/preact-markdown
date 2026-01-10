import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [preact()],
	root: 'example',
	resolve: {
		alias: {
			'preact-markdown': path.resolve(__dirname, 'src/index.ts')
		}
	}
});
