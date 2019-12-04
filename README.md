<a href="http://iphone.artsy.net"><img src ="docs/screenshots/overview.jpg"></a>

### Meta

- **State:** production
- **Point People:** [@alloy](https://github.com/alloy), [@ashfurrow](https://github.com/ashfurrow)
- **CI :** [![Build Status](https://circleci.com/gh/artsy/eigen/tree/master.svg?style=shield&circle-token=f7a3e9b08ab306cd01a15da49933c0774d508ecb)](https://circleci.com/gh/artsy/eigen)

This is a core [Artsy Mobile](https://github.com/artsy/mobile) OSS project, along with [Energy](https://github.com/artsy/energy), [Eidolon](https://github.com/artsy/eidolon), [Emission](https://github.com/artsy/emission) and [Emergence](https://github.com/artsy/emergence).

Don't know what Artsy is? Check out [this overview](https://github.com/artsy/meta/blob/master/meta/what_is_artsy.md) and [more](https://github.com/artsy/meta/blob/master/README.md), or read our objc.io on [team culture](https://www.objc.io/issues/22-scale/artsy).

Want to know more about Eigen? Read the [mobile](http://artsy.github.io/blog/categories/mobile/) blog posts, or [eigen's](http://artsy.github.io/blog/categories/eigen/) specifically.

### Docs

Get setup [here](docs/getting_started.md). Further documentation can be found in the [documentation folder](docs#readme).

### Work at Artsy?

Instead of `make oss` below, run `make artsy`. Then you'll want to find "Eigen" in our Engineering 1Password for your ENV vars, CocoaPods Keys should ask during the `pod install`.

The file `Artsy/App/Echo.json` is not checked in (a sample file is included for OSS contributors). When you run `pod install`, the latest `Echo.json` file will be downloaded for you. See note in `Podfile`.

### Quick Start

**Note**: We currently require using Xcode 10 for development, with the latest version (10.3) recommended. You can find all versions of Xcode from [Apple's Developer Portal 🔐](http://developer.apple.com/download/more/).

You'll need:

- [Node](https://nodejs.org/en/) installed (whichever version is listed as the `engine` [here](https://github.com/artsy/emission/blob/master/package.json)).
- [Yarn](https://yarnpkg.com/en/) installed, too.

Want to get the app running? Run this in your shell:

```sh
git clone https://github.com/artsy/eigen.git
cd eigen
gem install bundler
bundle install --without development distribution

make oss # or make artsy

bundle exec pod install --repo-update
open Artsy.xcworkspace
```

This will set you up on our staging server, you will have a running version of the Artsy app by hitting `Product > Run` (or ⌘R).

**Note**: `bundle exec pod install` may fail the first time you run it (due to a [bug](https://github.com/orta/cocoapods-keys/issues/127) in a dependency of ours). Re-running the command should work.

### Updating Emission

To update the version of Emission used, [check out the docs](docs/updating_emissio.md#update-eigen-with-the-most-recent-version-of-emission).

### Deployment

For how we deploy, check out the dedicated documentation:

- [Deploying a beta](docs/deploy_to_beta.md)
- [Deploying to the App Store](docs/deploy_to_app_store.md)

### Thanks

Thanks to all [our contributors](/docs/thanks.md).

## License

MIT License. See [LICENSE](LICENSE).

## About Artsy

<a href="https://www.artsy.net/">
  <img align="left" src="https://avatars2.githubusercontent.com/u/546231?s=200&v=4"/>
</a>

This project is the work of engineers at [Artsy][footer_website], the world's
leading and largest online art marketplace and platform for discovering art.
One of our core [Engineering Principles][footer_principles] is being [Open
Source by Default][footer_open] which means we strive to share as many details
of our work as possible.

You can learn more about this work from [our blog][footer_blog] and by following
[@ArtsyOpenSource][footer_twitter] or explore our public data by checking out
[our API][footer_api]. If you're interested in a career at Artsy, read through
our [job postings][footer_jobs]!

[footer_website]: https://www.artsy.net/
[footer_principles]: culture/engineering-principles.md
[footer_open]: culture/engineering-principles.md#open-source-by-default
[footer_blog]: https://artsy.github.io/
[footer_twitter]: https://twitter.com/ArtsyOpenSource
[footer_api]: https://developers.artsy.net/
[footer_jobs]: https://www.artsy.net/jobs
