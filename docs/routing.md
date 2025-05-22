# Routing

All app routes are specified in [routes.tsx].

## RouterLink & Navigation

For navigation, it is recommended to use the [RouterLink] component. It wraps `Touchable` and enables navigation to a specific route when pressed. It also supports prefetching the route as it comes into view.

```tsx
<RouterLink to="/my-route" navigationProps={{ filters: ["my-filter"] }} onPress={onPress}>
  {children}
</RouterLink>
```

When wrapping another component that needs the onPress event, `hasChildTouchable` can be passed to `RouterLink`. Note that `onPress` from the child won't be called.

```tsx
<RouterLink hasChildTouchable to="/my-route" onPress={onPress}>
  <Button>Ok</Button>
</RouterLink>
```

Prefetching can be disabled by passing `disablePrefetch` to `RouterLink`.

```tsx
<RouterLink to="/my-route" disablePrefetch>
  Click Me
</RouterLink>
```

Alternatively, [navigate] can be used with `onPress` to programmatically navigate to a given route (not recommended because it does not support prefetching).

```tsx
navigate("/my-route")
```

[routes.tsx]: /src/app/Navigation/routes.tsx
[RouterLink]: /src/app/system/navigation/RouterLink.tsx
[RouterButton]: /src/app/system/navigation/RouterButton.tsx
[navigate]: /src/app/system/navigation/navigate.ts
