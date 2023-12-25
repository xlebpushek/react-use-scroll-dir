const { babel } = require('@rollup/plugin-babel')
const typescript = require('@rollup/plugin-typescript').default
const dts = require('rollup-plugin-dts').default

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
      },
      {
        file: 'dist/index.umd.cjs',
        format: 'cjs',
      },
    ],
    plugins: [babel({ babelHelpers: 'bundled' }), typescript()],
    external: ['react', 'react-dom'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]
