As we have built our React Native components, our understanding of how to build those components as evolved. As that understanding grows, newer components use newer techniques and older ones are often left un-updated. It can be difficult to orient oneself around what the current preferred practices are.

This document is a map. Not of Emission at a specific time, but a map of how we got here and where we want to go next. This is a living document, expected to be updated regularly, of links to:

- Example code.
- Pull requests with interesting discussions.
- Conversations on Slack.
- Blog posts.

Links should point to specific commits, and not a branch (in case the branch or file is deleted, these links should always work). But it's possible that a file is outdated, that our understanding has moved on since it was linked to; in that case, please update this document.

## Current Preferred Practices

### React Native

- [Why Artsy uses React Native](http://artsy.github.io/blog/2016/08/15/React-Native-at-Artsy/)
- [All React Native posts on Artsy's Engineering Blog](http://artsy.github.io/blog/categories/reactnative/)

### Relay

- [Why Artsy uses Relay](http://artsy.github.io/blog/2017/02/05/Front-end-JavaScript-at-Artsy-2017/#Relay)
- [Artsy JavaScriptures seminar on Relay](https://github.com/artsy/javascriptures/tree/master/4_intro-to-relay)
- [Example of using Relay in the Inbox component](https://github.com/artsy/emission/blob/019a106517b31cebfb1c5293891215cc7ebf7a4d/src/lib/Containers/Inbox.tsx)

### styled-system

- [styled-system was added in #1016](https://github.com/artsy/emission/pull/1016)
- [Example pull request migrating a component from styled-components to styled-system](https://github.com/artsy/emission/pull/1031)

### Miscellaneous 

- [Making network requests outside of Relay](https://github.com/artsy/emission/blob/019a106517b31cebfb1c5293891215cc7ebf7a4d/src/lib/Components/Consignments/Screens/Overview.tsx#L135-L150)

## Formerly Preferred Practices

These are techniques or approaches that we _used_ to use, but which have been replaced with newer concepts above.

### styled-components

Our use of [styled-components](https://www.styled-components.com) was replaced by [styled-system](https://github.com/jxnblk/styled-system) in [#1016](https://github.com/artsy/emission/pull/1016).
