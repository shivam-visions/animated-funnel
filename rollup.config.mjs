import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    postcss({
      extract: true, // Optional: Extract CSS to a separate file
      minimize: true, // Minify the CSS
    }),
    resolve(),
    commonjs(),
    typescript({ 
      tsconfig: './tsconfig.json', 
      sourceMap: true, 
      inlineSources: true 
    }),
    terser({ 
      compress: { 
        drop_console: true, 
        drop_debugger: true 
      } 
    }),
  ],
  external: ['react', 'react-dom', 'tsparticles', 'tsparticles-engine'],
};