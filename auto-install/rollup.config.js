import auto from '@rollup/plugin-auto-install';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import run from 'rollup-plugin-run';

export default {
    input: 'install.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [
        auto(),
        resolve(),
        commonjs(),
        run()
    ]
};