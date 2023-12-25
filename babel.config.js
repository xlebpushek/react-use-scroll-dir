const presetEnv = require('@babel/preset-env')
const presetReact = require('@babel/preset-react')
const presetTypescript = require('@babel/preset-typescript')

module.exports = {
  presets: [
    [
      presetEnv,
      {
        targets: {
          node: 'current',
        },
      },
    ],
    presetReact,
    presetTypescript,
  ],
}
