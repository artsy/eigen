# Overview of Eigen

**Note**: this document applies to the native code in Eigen _only_. New components are built in Emission.

#### App wide View Controller Hierarchy

There are two navigation controllers used in the app. There is one that is presented during onboarding, and one used throughout the app.

The key navigation controller in-app is a _child_ view controller of the `ARTopMenuViewController`. This is how we could abstract out the specific navigation contexts and I expect will be useful in porting to iPad.

#### Navigational buttons

The control of menu buttons like the back / menu button are controlled in the `ARTopMenuViewController`, for whom they are views that sit above the normal navigational flow. A lot of the work on showing and hiding is dealt with by the `ARScrollNavigationChief`.

#### Switchboard

The switchboard is an abstraction that passes data between view controllers, it can deal with paths like the artsy website or be given an object and a class and it will push the corrosponding view controller on to the nav stack. Most functions take a `fair:` parameter so that we can ensure that when you're inside a fairs navigation structure, you stay inside.

#### ARRouter

The ARRouter is the class in-between the app and the API. Providing a way to generate URLRequests with an objective-c feel which the ArtsyAPI object will then use to create methods for dealing with the network requests.

#### Emission

Some views inside Eigen are built with React Native. We keep these in a Pod of their own and develop them separately in the [Emission repo](https://github.com/artsy/emission). As of this writing, the Emission views are:

- Home view controller
- User Favourites
- Artist view controller
- Gene view controller
- Works For You/Notifications view controller
- All of Consignments

Ideally at this point for any major work for a View Controller you should consider porting it to TypeScript and moving it to Emission.

#### Showing Artwork Thumbnail

##### If you need an infinite scroll

Have a `AREmbeddedModelsViewController` child view controller, and use the `headerView` and `headerHeight` properties of it to show views above. See `ARFavoritesViewController` for an example.

##### If you want to show some artworks

Have a `AREmbeddedModelsViewController` child view controller. It works with `ARArtworkCollectionViewModule` subclasses like `ARArtworkFlowModule` to provide a single way to present different types of artworks. If there isn't a way to produce the style you want add a new modules.

## Aspirational

#### View Controllers in general

Try keep view controllers small, there are a lot of design patterns to help simplify the process of reducing VC-specific code. Use ORStackViews, use UICollectionView subclasses and try to use child view controllers to reuse.

#### Networking

The app as it currently is is a mix of three design patterns for networking. This is mainly due to the original time constraints, the three patterns are:

- `KSPromise`s - found in `Artwork`. Uses defers & promises to provide a way to give a lot of recievers news that an artwork has been updated from the server. Allows multiple data sources to trigger the promise completion.

- Raw access of `[ArtsyAPI getBlah]`. Happens around the app in places like `ARFavoritesArtistViewController`. Ideally these should be moved into network-models like `ARGeneArtworkCollection`.

- Model based network abstractions are just an abstraction on the raw API access inside of the model instead of in a view controller or elsewhere. These should ideally be protocols so that testing is really easy.

Ideally most of of our network interaction should be moved into network-models.

#### ScrollNavigationChief

In order to provide a consistent navigation button experience a lot of view controllers with scroll views set the `UIScrollView` `delegate` to the ScrollNavigationChief singleton.
If a view needs to override some of the methods it's possible to pass on the messages on too.

#### StackViews

Most view controllers show a collection of views that are stacked on top of each other. `ORStackView` is an abstraction that means you can let the stackview deal with positioning and setting height. If want to deal with an order that is not the same as the insertion order there is a subclass that orders by view tag. Remember our mantra: `Everything is a stack`.

#### Network Errors

We aim to only provide network error messages if there was an active user engagement like tapping "follow" and that request failing.

#### Theming / Views

There is no over-arching methodology for theming in the app. Originally `ARTheme` was used but we don't have designers wanting to tweak all the settings themselves and its coupling is a bit too loose for tooling. It should not be used.

There are a lot of common use-case views though, like `ARPageSubTitleView` or `ARTextView` for use in StackViews and there are categories for doing some more advanced typographical tricks.

#### Constants

Constants should be prefixed with `AR`, `#defines` should be migrated to that if they are still in the codebase.

If a few exist they should get their own file like `ARFeedConstants`.

#### AROptions

Features that aren't ready for alpha/beta users should be hidden behind an `AROption` which defaults to off. This means there is an interface for beta users to toggle it.
