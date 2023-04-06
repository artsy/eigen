## Developing Features using Local Versions of Palette

When developing new components in Palette, it's often useful to test those components in consuming apps (such as Eigen). However, due to the poor support for symlinks in React Native, this can be difficult. Enter [yalc](https://github.com/wclr/yalc). Yalc is a mini package manager that one can publish to and install from, which makes it easy to test code in realtime from outside of your app.

> Note: [@artsy/palette-mobile](https://github.com/artsy/palette-mobile) uses Storybooks for developing features; work there first! Then, when ready (and if necessary), test your code locally using the flow described below. You can also publish npm canary releases from the palette-mobile repo by attaching a `canary` label to your PR.

### Setup

- Install `yalc` globally:

```sh
yarn global add yalc
```

- Navigate to `palette-mobile` in the terminal and start the watcher:

```sh
cd palette-mobile
yarn local-palette-dev
```

- Navigate back to Eigen and link:

```sh
cd eigen
yarn local-palette-dev
yarn start
```

This will update `package.json` to point at the yalc-published version of palette.

- When done developing your local palette feature, be sure to unlink:

```sh
yarn local-palette-dev:stop
```
