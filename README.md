# Reactions ⇒ Emissions

Emission is a collection of [React Native] Components which are consumed by [Eigen]. A writeup on how & why we made a lot of the repo decisions is on our [blog here].

Inside Emission you will find:

* An example app for building and running Emission's components with an Eigen-like API.
* An NPM module that relies on React Native and manages the components.
* A Podspec that wraps it all together for easy external usage in Eigen.

### Meta

* __State:__ production
* __Point People:__ [@sarahscott](https://github.com/sarahscott), [@alloy](https://github.com/alloy)
* __CI:__ [![Build Status](https://travis-ci.org/artsy/emission.svg?branch=master)](https://travis-ci.org/artsy/emission)

This is a core [Artsy Mobile](https://github.com/artsy/mobile) OSS project, along with [Energy](https://github.com/artsy/energy), [Eidolon](https://github.com/artsy/eidolon), [Eigen](https://github.com/artsy/eigen) and [Emergence](https://github.com/artsy/emergence).

Don't know what Artsy is? Check out [this overview](https://github.com/artsy/meta/blob/master/meta/what_is_artsy.md) and [more](https://github.com/artsy/meta/blob/master/README.md), or read our objc.io on [team culture](https://www.objc.io/issues/22-scale/artsy).

Want to know more about Emission? Read the [mobile](http://artsy.github.io/blog/categories/mobile/) blog posts, or [Emission's](http://artsy.github.io/blog/categories/emission/) / [React Native's](http://artsy.github.io/blog/categories/reactnative/) specifically.

### Installation

*Automated install*: `git clone https://github.com/artsy/emission.git; cd emission; make oss`.

*Manual install*

1. Make sure to check out submodules with `git submodule update --init`
1. Install [Node.js][node], and [Yarn][yarn]: `$ brew install node yarn`
1. Install file watcher used by React Native:
   * `$ brew install pcre`
   * `$ brew link pcre`
   * `$ brew install watchman --HEAD`
1. Install NPM modules: `$ yarn install`
1. Install Pods: `$ cd Example && bundle && bundle exec pod install`

### Running the project:

1. Run `$ yarn start` from the top directory, which will:
   * Clean the example app’s Xcode build dir.
   * Start the example app’s React Native packager.
   * Start the React Storybooks environment.

2. Now from Xcode you can run the app in `Example/Emission.xcworkspace`.
  * If you already have the app installed, you can run `open -a Simulator` to open the last sim, and then `xcrun simctl launch booted net.artsy.Emission` to open the app.

### Daily Development

If you like git hooks, you could setup the following:

* Lint and auto-fix new changes on commit:
  `$ echo -e "#!/bin/sh\nyarn run lint-staged\n" > .git/hooks/pre-commit; chmod +x .git/hooks/pre-commit`
* Run type-checker before push:
  `$ echo -e "#!/bin/sh\nyarn run type-check\n" > .git/hooks/pre-push; chmod +x .git/hooks/pre-push`

To use [Storybooks](https://github.com/storybooks/storybook), select "Open Storybook" from the "Developer" section of the root view in the app. You can also use the [VSCode Storybooks plugin](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-react-native-storybooks).

---

### Using VS Code as an IDE

There is a comprehensive document covering [our setup here](docs/vscode.md).

### Debugging

There is a comprehensive document covering [the various options](docs/debugging.md).

### Updating Dependencies

1. We vendor some data from other repositories that you will sometimes need to update. You can either update all of them
   with `$ yarn run sync-externals` or individually:
   * The GraphQL schema of metaphysics that Relay uses to generate queries from: `$ yarn run sync-schema`
   * The colors defined in Artsy’s style-guide: `$ yarn run sync-colors`


### Understanding Relay

We have some debugging tip [when using Relay](docs/relay.md).

----

Try quitting and restarting your node instance if you change something Relay-related and you run into this error:

```
Unhandled JS Exception: RelayQL: Unexpected invocation at runtime. Either the Babel transform was not set up, or it
failed to identify this call site. Make sure it is being used verbatim as `Relay.QL`
```

### Deployment

1. Ensure that the React version required by Emission has been published to [our spec-repo][spec-repo].
   Assuming no breaking changes in RN's folder structures, you can run `make update_specs_repos`.
2. Update the [CHANGELOG](CHANGELOG.md) file to reflect the version that will be released and commit it.
3. Don't change the `package.json` version.
4. For non-beta releases, use either `npm version patch`, `npm version minor`, or `npm version major`. For
   beta releases use `npm version prerelease`.

### Resources

* React Native:
  - http://makeitopen.com
  - https://github.com/fbsamples/f8app/
  - http://facebook.github.io/react-native/docs/getting-started.html
  - http://beginning-mobile-app-development-with-react-native.com/book-preview.html

* Relay:
  - https://facebook.github.io/relay/docs/getting-started.html
  - https://github.com/facebook/relay/tree/master/examples
  - https://github.com/fbsamples/f8app/

* TypeScript:
  - https://www.typescriptlang.org
  - https://github.com/basarat/typescript-book

* Testing:
  - https://facebook.github.io/jest/
  - https://facebook.github.io/jest/docs/api.html#content
  - https://facebook.github.io/jest/blog/2016/07/27/jest-14.html

* Flexbox:
  - https://css-tricks.com/snippets/css/a-guide-to-flexbox/
  - http://blog.krawaller.se/posts/a-react-app-demonstrating-css3-flexbox/
  - https://egghead.io/courses/flexbox-fundamentals

* React Native Storybooks:
  - https://github.com/storybooks/storybook/
  - https://github.com/storybooks/storybook/tree/master/app/react-native

* React Native Debugger:
  - https://github.com/jhen0409/react-native-debugger


[React Native]: http://facebook.github.io/react-native/
[Eigen]: https://github.com/artsy/eigen
[yarn]: https://yarnpkg.com
[flow]: http://flowtype.org
[node]: http://nodejs.org
[glossary-yarn]: http://artsy.github.io/blog/2016/11/14/JS-Glossary/#yarn
[blog here]: http://artsy.github.io/blog/2016/08/24/On-Emission/
[spec-repo]: https://github.com/artsy/Specs/tree/master/React
