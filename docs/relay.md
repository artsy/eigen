### Using Relay

Some helpful Relay documentation is listed below, but the general workflow is:

1. Build a fragment for each child component that specifies only the attributes used by the component itself (no
   extraneous information).
2. Ensure the parent component calls `getFragment` for each child component that uses Relay.
3. Make sure to supply every child component’s `props` upon instantiation in the parent.

----

Another gotcha is around fragments that use variables. For this it is important to understand that whenever a Relay
backed hierarchy is used, 2 trees will be rendered.

1. A tree of all Relay query fragments is rendered into a single query.
2. Once the query has been performed, the view component tree is rendered.

What this means in practice, is that you will need to pass variables down _both_ those trees.
1. Once from the [Relay route](https://facebook.github.io/relay/docs/api-reference-relay-route.html) down through all
   `getFragment(name, variables)` calls.
2. Second down through the props of all components.

See:
* https://github.com/artsy/emission/commit/e84940b8360b8c5b838045a619be5b8558d5fad7
* https://github.com/facebook/relay/issues/309#issuecomment-140485321
