# Routing

All app routes are specified in [routes.tsx].

## RouterLink & RouterButton Components

The [RouterLink] component wraps `Touchable` and enables navigation to a specific route when pressed. It also supports prefetching the route as it comes into view.

```typescript
<RouterLink to="/my-route" navigationProps={{ filters: ["my-filter"]}} onPress={onPress}>
  {children}
</RouterLink>
```

When using a button for navigation, [RouterButton] can be used.

```typescript
<RouterButton to="/my-route" navigationProps={{ filters: ["my-filter"]}} onPress={onPress}>
  {children}
</RouterButton>
```

Alternatively, [navigate] can be used with `onPress` to programmatically navigate to a given route.

[routes.tsx]: /src/app/Navigation/routes.tsx
[RouterLink]: /src/app/system/navigation/RouterLink.tsx
[RouterButton]: /src/app/system/navigation/RouterButton.tsx
[navigate]: /src/app/system/navigation/navigate.ts
