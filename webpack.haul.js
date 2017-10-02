const merge = require("webpack-merge")

module.exports = ({ platform }, configuration) =>
  merge(configuration, {
    entry: `./Example/Emission/index.${platform}.js`,
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "awesome-typescript-loader",
              options: {
                useBabel: true,
                useCache: true,
                useTranspileModule: true, // Supposedly faster, won’t work if/when we emit TS declaration files.
              },
            },
          ],
        },
      ],
    },
  })
