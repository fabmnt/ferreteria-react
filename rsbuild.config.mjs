import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  rules: [
    {
      test: /\.css$/,
      use: ['postcss-loader'],
      type: 'css',
    },
  ],
  html: {
    template: './src/index.html',
  },
})
