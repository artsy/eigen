---
name: creating-screens
description: Add new screens and routes to Eigen React Native app. Guides you through creating simple screens (no data fetching) or Relay screens (with GraphQL). Use this when adding screens, routes, or navigating components. Triggers on "add a screen", "create a new route", "add a Relay screen", "setup screen with data", or screen creation tasks.
---

# Creating Screens in Eigen

Use this checklist to track your work:

```md
- [ ] Confirm the component/folder name and the desired route
- [ ] Create the correct type of screen
- [ ] Write a test for the new screen (using `/eigen-testing` skill)
- [ ] Ensure the test passes (`yarn test [test file]`)
- [ ] Run linter (`yarn lint [pending files]`)
- [ ] Run formatter (`yarn prettier -w [pending files]`)
```

## Simple Screen (No GraphQL)

1. Create `/src/app/Scenes/FeatureName/ScreenName.tsx` using `assets/simple-screen-template.tsx`
2. Register route in `/src/app/Navigation/routes.tsx`

## Relay Screen (With GraphQL)

1. Create `/src/app/Scenes/FeatureName/ScreenName.tsx` using `assets/relay-screen-template.tsx`
2. Register route in `routes.tsx` with `queries` and `prepareVariables`

## Route Registration

```typescript
// Simple screen
{
  path: "/my-screen",
  name: "MyScreen",
  Component: MyScreen,
  options: { screenOptions: { headerShown: false } },
}

// Relay screen
{
  path: "/entity/:id",
  name: "EntityScreen",
  Component: EntityScreenQueryRenderer,
  queries: [EntityScreenQuery],
  prepareVariables: [({ id }) => ({ id })],
  options: { screenOptions: { headerShown: false } },
}
```

Note: **[Android only]**: If you want to enable deep linking for your new screen, add the route to `src/main/AndroidManifest.xml`.

```xml
...
<data android:pathPrefix="/my-screen" />
...
```

## Critical Rules

- **Location**: `/src/app/Scenes/FeatureName/ScreenName.tsx`
- **Naming conventions**: `Foo.tsx` not `FooScreen.tsx`
- **Route order**: Specific routes before generic (e.g., `/artist/:id` before `/:slug`)
- **Relay queries**: Include `@relay_test_operation` directive
- **Null check**: Always check `if (!data.entity) return null` in QueryRenderer
- **Tests**: Always ensure there is a passing test
- **Code quality**: Always ensure new files are linted and formatted
