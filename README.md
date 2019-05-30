# Reactions ⇒ Emissions

Emission is a collection of [React Native] Components which are consumed by [Eigen]. A writeup on how & why we made a lot of the repo decisions is on our [blog here].

Inside Emission you will find:

- An example app for building and running Emission's components with an Eigen-like API.
- An NPM module that relies on React Native and manages the components.
- A Podspec that wraps it all together for easy external usage in Eigen.

### Meta

- **State:** production
- **Point People:** [@alloy](https://github.com/alloy), [@ashfurrow](https://github.com/ashfurrow)
- **CI:**
  - React Native components: [![Build Status](https://travis-ci.org/artsy/emission.svg?branch=master)](https://travis-ci.org/artsy/emission)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fartsy%2Femission.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fartsy%2Femission?ref=badge_shield)
  - Native unit tests: [![CircleCI](https://circleci.com/gh/artsy/emission.svg?style=svg)](https://circleci.com/gh/artsy/emission)
- **[Troubleshooting](https://github.com/artsy/emission/blob/master/docs/troubleshooting.md)**

This is a core [Artsy Mobile](https://github.com/artsy/mobile) OSS project, along with [Energy](https://github.com/artsy/energy), [Eidolon](https://github.com/artsy/eidolon), [Eigen](https://github.com/artsy/eigen) and [Emergence](https://github.com/artsy/emergence).

Don't know what Artsy is? Check out [this overview](https://github.com/artsy/meta/blob/master/meta/what_is_artsy.md) and [more](https://github.com/artsy/meta/blob/master/README.md), or read our objc.io on [team culture](https://www.objc.io/issues/22-scale/artsy).

Want to know more about Emission? Read the [mobile](http://artsy.github.io/blog/categories/mobile/) blog posts, or [Emission's](http://artsy.github.io/blog/categories/emission/) / [React Native's](http://artsy.github.io/blog/categories/reactnative/) specifically. Also check out [the map to Emission](docs/map_to_emission.md) to oriented yourself to the codebase.

### Prerequisites

- Xcode

### Installation

_Automated install_:

- **OSS**: `git clone https://github.com/artsy/emission.git && cd emission && make setup && make oss`
- **Artsy**: `git clone https://github.com/artsy/emission.git && cd emission && make setup && make artsy`. Then look in 1password for the Eigen keys.

_Manual install_

1. Install [Node.js][node], and [Yarn][yarn]: `$ brew install node yarn`
1. Install file watcher used by React Native:
   - `$ brew install watchman`
1. Install NPM modules: `$ yarn install`
1. Install Pods: `$ cd Example && bundle && bundle exec pod install`

Ran into issues? Try [troubleshoot](docs/troubleshooting.md).

### Running the project:

1. Run `$ yarn start` from the top directory, which will:

   - Clean the example app’s Xcode build dir.
   - Start the example app’s React Native packager.
   - Start the React Storybooks environment.

1. Now from Xcode you can run the app in `Example/Emission.xcworkspace`.

- If you already have the app installed, you can run `open -a Simulator` to open the last sim, and then `xcrun simctl launch booted net.artsy.Emission` to open the app.
- If you run into any issues with the above commands oftentimes a full clean can help. Run `rm -rf node_modules; rm -rf Example/Pods; yarn install; cd Example; bundle exec pod install` and then repeat the steps above.

### Daily Development

To use [Storybooks](https://github.com/storybooks/storybook), select "Open Storybook" from the "Developer" section of the root view in the app. You can also use the [VSCode Storybooks plugin](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-react-native-storybooks).

To create your React components and Relay containers, use the [omakase generator][omakase-cli]. E.g.

```
$ yarn om g src/lib/Scenes/Artwork/ArtworkMetadata -f Artwork
```

```
$ yarn om g src/lib/Scenes/Artwork/ArtworkMetadata -r Artwork
```

```
$ yarn om g src/lib/Scenes/Artwork/ArtworkMetadata -p Artwork.artists
```

For full details see [the CLI README][omakase-cli].

---

### Using VS Code as an IDE

There is a comprehensive document covering [our setup here](docs/vscode.md).

### Debugging

There is a comprehensive document covering [the various options](docs/debugging.md).

### Updating Dependencies

We vendor some data from other repositories that you will sometimes need to update. Notably the GraphQL schema of metaphysics that Relay uses to generate queries from: `$ yarn sync-schema`

### Deploying Emission

**Note:** Deploys are mostly automated using `yarn release patch|minor|major`; the following instructions should be valid but take a look at [this issue](https://github.com/artsy/emission/issues/1077#issuecomment-401128949) if things break.

**Note 2:** If you're updating React Native, you're gonna have to do a lot of this stuff manually. See the makefile/alloy/orta for more info.

1. Don't change the `package.json` version.
1. For non-beta releases, use either `yarn release patch`, `yarn release minor`, or `yarn release major`. For
   beta releases use `yarn release prerelease`.
1. If integrating in Eigen consult the docs [on updating Emission](https://github.com/artsy/eigen/blob/master/docs/updating_emission.md)

### Automated Emission App Deploys

The Emission app (in `Example/`) is deployed automatically to TestFlight once a week through [emission-nebula](https://github.com/artsy/emission-nebula). See that repo for more details.

### Resources

- React Native:

  - http://makeitopen.com
  - https://github.com/fbsamples/f8app/
  - http://facebook.github.io/react-native/docs/getting-started.html
  - http://beginning-mobile-app-development-with-react-native.com/book-preview.html

- Relay:

  - https://facebook.github.io/relay/docs/getting-started.html
  - https://github.com/facebook/relay/tree/master/examples
  - https://github.com/fbsamples/f8app/

- TypeScript:

  - https://www.typescriptlang.org
  - https://github.com/basarat/typescript-book

- Testing:

  - https://facebook.github.io/jest/
  - https://facebook.github.io/jest/docs/api.html#content
  - https://facebook.github.io/jest/blog/2016/07/27/jest-14.html

- Flexbox:

  - https://css-tricks.com/snippets/css/a-guide-to-flexbox/
  - http://blog.krawaller.se/posts/a-react-app-demonstrating-css3-flexbox/
  - https://egghead.io/courses/flexbox-fundamentals

- React Native Storybooks:

  - https://github.com/storybooks/storybook/
  - https://github.com/storybooks/storybook/tree/master/app/react-native

- React Native Debugger:
  - https://github.com/jhen0409/react-native-debugger

[react native]: http://facebook.github.io/react-native/
[eigen]: https://github.com/artsy/eigen
[yarn]: https://yarnpkg.com
[flow]: http://flowtype.org
[node]: http://nodejs.org
[glossary-yarn]: http://artsy.github.io/blog/2016/11/14/JS-Glossary/#yarn
[blog here]: http://artsy.github.io/blog/2016/08/24/On-Emission/
[spec-repo]: https://github.com/artsy/Specs/tree/master/React
[metaphysics]: https://github.com/artsy/metaphysics
[omakase-cli]: https://github.com/omakase-js/omakase/blob/master/packages/cli/README.md


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fartsy%2Femission.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fartsy%2Femission?ref=badge_large)