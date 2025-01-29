# Routing

All app routes are specified in [routes.tsx].

## RouterLink Component

The [RouterLink] component wraps `Touchable` and enables navigation to a specific route when pressed. It also supports prefetching the route as it comes into view.

```typescript
<RouterLink to="/my-route" navigationProps={{ filters: ["my-filter"]}} onPress={onPress}>
  {children}
</RouterLink>
```

Alternatively, [navigate] can be used to programmatically navigate to a given route.

[routes.tsx]: /src/app/Navigation/routes.tsx
[RouterLink]: /src/app/system/navigation/RouterLink.tsx
[navigate]: /src/app/system/navigation/navigate.ts
