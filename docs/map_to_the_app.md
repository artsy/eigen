# :world_map:

As we have built our React Native components, our understanding of how to build those components as evolved. As that understanding grows, newer components use newer techniques and older ones are often left un-updated. It can be difficult to orient oneself around what the current preferred practices are.

This document is a map. Not of Eigen/Emission at a specific time, but a map of how we got here and where we want to go next. This is a living document, expected to be updated regularly, of links to:

- Example code.
- Pull requests with interesting discussions.
- Conversations on Slack.
- Blog posts.

Links should point to specific commits, and not a branch (in case the branch or file is deleted, these links should always work). But it's possible that a file is outdated, that our understanding has moved on since it was linked to; in that case, please update this document.

## Current Preferred Practices

### React Native

- [Why Artsy uses React Native](http://artsy.github.io/blog/2016/08/15/React-Native-at-Artsy/)
- [All React Native posts on Artsy's Engineering Blog](http://artsy.github.io/blog/categories/reactnative/)
- TODO: What's our best React Native component? Which in-prod component exemplifies our state-of-the-art best practices?

### Relay

- [Why Artsy uses Relay](http://artsy.github.io/blog/2017/02/05/Front-end-JavaScript-at-Artsy-2017/#Relay)
- [Artsy JavaScriptures seminar on Relay](https://github.com/artsy/javascriptures/tree/master/4_intro-to-relay)
- [Example of using Relay in the Inbox component](https://github.com/artsy/emission/blob/019a106517b31cebfb1c5293891215cc7ebf7a4d/src/lib/Containers/Inbox.tsx)

### styled-system / styled-components

- Our use of [styled-components](https://www.styled-components.com) was supplemented by [styled-system](https://github.com/jxnblk/styled-system) in [#1016](https://github.com/artsy/emission/pull/1016).
- [Example pull request migrating a component from styled-components to styled-system](https://github.com/artsy/emission/pull/1031)

### Storybooks

We use storybooks for rapid prototyping and quick feedback when we change code.

- [New Bid Flow stories](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Bidding/__stories__/BidFlow.story.tsx)

### Unit Testing

Unit testing on Emission is a bit all over the place. Here are some great examples of what tests and test coverage should look like.

- [Tests for Gene component](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Containers/__tests__/Gene-tests.tsx)
- [Tests for Consignments submission flow](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Confirmation-tests.tsx)
- [Tests for Consignments photo-selection component interactions](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/SelectFromPhotoLibrary-tests.tsx).
- Consignments Overview is a really complex component, so tests are broken into four test files:
  - [General component tests](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Overview-tests.tsx)
  - [Analytics tests](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Overview-analytics-tests.tsx)
  - [Local storage tests](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Overview-local-storage-tests.tsx)
  - [Image uploading tests](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Overview-uploading-tests.tsx)

### Eigen Interop

Emission is used by Eigen, our main app. The structure is [described in this blog post](http://artsy.github.io/blog/2016/08/24/On-Emission/). Interop between the JavaScript (Emission) and the Objective-C/Swift (Eigen) can be tricky.

_Most_ interactions are made through a "switchboard" to open links. A switchboard exists in Eigen, which users see, and a switchboard exists in the Emission test app for our internal testing. This is key: the switchboard in Emission isn't actually used in production, only the Eigen one is.

Other interactions are handled by the `APIModules`, for example when Eigen needs to invoke some kind of callback.

- [Switchboard routes defined in Eigen](https://github.com/artsy/eigen/blob/e0567ffc3c9619c66890998ae3cadfc026a290ae/Artsy/App/ARSwitchBoard.m#L131-L255)
- [Emission switchboard to call out to Eigen](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/Pod/Classes/Core/ARSwitchBoardModule.m)
- [Callbacks between JS and native code are set up here](https://github.com/artsy/emission/blob/24c0fdaf91aa79654a33fd6e476405047819be5b/Pod/Classes/TemporaryAPI/ARTemporaryAPIModule.m).

### Analytics

There is [extensive inline documentation](https://github.com/artsy/emission/blob/7a4eb922cee70c621c9938bfda1db460e65414fc/src/lib/utils/track.ts#L175-L359) in our tracking code, including examples.

### Miscellaneous

- [Making network requests outside of Relay](https://github.com/artsy/emission/blob/019a106517b31cebfb1c5293891215cc7ebf7a4d/src/lib/Components/Consignments/Screens/Overview.tsx#L135-L150)

## Formerly Preferred Practices

These are techniques or approaches that we _used_ to use, but which have been replaced with newer concepts above. This will grow with time.

- We used to have a separate repo for Emission and Eigen, but [they were merged here](https://github.com/artsy/eigen/pull/3022).
