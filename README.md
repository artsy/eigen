# Reactions ⟶ Emissions

[React Native] Components used by [Eigen].

[React Native]: http://facebook.github.io/react-native/
[Eigen]: https://github.com/artsy/eigen

### Installation

1. Install Node.js and type checking tool: `$ brew install node flow`
2. Install file watcher used by React Native:
   * `$ brew install pcre`
   * `$ brew link pcre`
   * `$ brew install watchman --HEAD`

### Development

1. If this is the first time you clone this repo, you will have to install a dependency that we cannot include in this
   repository, which are the fonts that the example app needs. Run `$ cd Example && pod install`.

2. Run `$ npm start`, which will:
   - Clean the example app’s Xcode build dir.
   - Clean the emission package from the example app’s `node_modules` dir.
   - Clear the example app’s React Native packager cache.
   - Start syncing the emission package to the example app’s `node_modules` dir.
   - Start the example app’s React Native packager.

3. Now from Xcode you can run the app in `Example/Emission.xcworkspace`.

### Using Relay
  Some helpful Relay documentation is listed below, but the general workflow is:
    1. Build a fragment for each child component that specifies only the attributes used by the component itself (no extraneous information).
    2. Ensure the parent component calls getFragment for each child component that uses Relay.
    3. Make sure to supply every child component's `props` upon instantiation in the parent.

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

* Testing:
  - https://mochajs.org
  - http://chaijs.com/guide/styles/#expect
  - https://github.com/airbnb/enzyme

* Flow:
  - http://flowtype.org/docs/type-annotations.html
  - http://flowtype.org/docs/react.html
  - http://flowtype.org/docs/quick-reference.html (and the rest of the language reference)

* Flexbox:
  - https://css-tricks.com/snippets/css/a-guide-to-flexbox/
