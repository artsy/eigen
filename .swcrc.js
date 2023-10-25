module.exports = {
  jsc: {
    experimental: {
      plugins: [
        [
          "@swc/plugin-styled-components",
          {
            displayName: true,
            ssr: true,
          },
        ],
        [
          "@swc/plugin-relay",
          {
            language: "typescript",
            schema: "data/schema.graphql",
            rootDir: __dirname,
            src: "src",
            artifactDirectory: "src/__generated__",
          },
        ],
      ],
    },
    parser: {
      decorators: true,
      dynamicImport: true,
      syntax: "typescript",
      tsx: true,
    },
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
}
