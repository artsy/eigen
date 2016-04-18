# Reactions ⟶ Emissions

[React Native] Components used by [Eigen].

[React Native]: http://facebook.github.io/react-native/
[Eigen]: https://github.com/artsy/eigen

### Reading

* Testing:
  - https://mochajs.org
  - http://chaijs.com/guide/styles/#expect
  - https://github.com/airbnb/enzyme

* Flow:
  - http://flowtype.org/docs/type-annotations.html
  - http://flowtype.org/docs/react.html
  - http://flowtype.org/docs/quick-reference.html (and the rest of the language reference)

### Development

1. In one terminal session, run `$ cd Example && npm start`. This will start the
   ‘packager’ for the Example app, which serves the processed JS source to the
   Example app.
2. In another terminal session, run `$ npm run-script sync-module`. This will
   make changes that you make to the component available to the Example app, in
   a way that will trigger the Example app’s ‘packager’ to reload those files.
3. Now from Xcode you can run the app in `Example/Emission.xcworkspace`.
