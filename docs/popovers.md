# Popovers

Progressive onboarding popovers used to freeze the app, and to appear on screens the user
had already navigated away from. This explains why, and how the current infrastructure
prevents it.

## The underlying hazard

`@artsy/palette-mobile`'s `Popover` renders `react-native-popover-view` **without a `mode`
prop**, so every popover is the library default `Mode.RN_MODAL`: a transparent,
full-screen native `<Modal>`.

That has two consequences worth internalising:

1. **Two at once blocks the app.** Two transparent full-screen Modals, or one left mounted
   after it should have gone, swallow every touch. The JS and main threads stay perfectly
   responsive, so nothing crashes and nothing hangs.
2. **Sentry's app-hang/ANR detection cannot see it.** There is no hang to detect. This is
   why we never had a number for how many users were affected, and why the lock is
   instrumented deliberately (see _Observability_).

A popover can also get stuck: in `BasePopover.js`, if `isVisible` goes false before the
bubble has measured and opened, the library only sets `animateOutAfterShow`. If it never
opens, the Modal stays mounted forever. The only recovery is to unmount it.

## Use `OnboardingPopover`

`src/app/Components/ProgressiveOnboarding/OnboardingPopover.tsx` is the only place in
`src/` allowed to import `Popover` from palette — enforced by an ESLint
`no-restricted-imports` rule.

```tsx
<OnboardingPopover
  id={PROGRESSIVE_ONBOARDING_MY_KEY}
  when={isReady && isFocused && isInView}
  delay={500}
  placement="bottom"
  title="Title"
  content="Body copy"
  contextScreenOwnerType={OwnerType.home}
  contextModule={ContextModule.header}
>
  {children}
</OnboardingPopover>
```

Surfaces supply the condition and the copy. The component owns everything else:

- **The lock.** One popover shows at a time. Claimed with `acquireActivePopover` and
  released with `releaseActivePopover`, both of which check ownership **inside the
  reducer**. That matters: the previous hook guarded on a value captured during render, so
  two popovers becoming displayable in the same commit both read "free" and both claimed
  it. Mutual exclusion was not enforced, it merely usually happened.
- **Release on unmount.** A popover whose host disappears (tab switch, navigation,
  scroll) used to hold the lock for the rest of the session, silently killing every
  popover after it.
- **Show delay only.** `useShowDelay` takes a _predicate_ and re-evaluates it when the
  timer fires. `useDebouncedValue` delayed in both directions and captured its value when
  the timer started, which is how popovers surfaced on the wrong screen. Hiding is never
  delayed.
- **Route identity.** The route is captured when the popover becomes displayable and
  re-checked at show time. If it changed, the request is **dropped, not deferred** — the
  moment has passed.
- **Overlay awareness.** It will not present while anything is registered in the
  presentation context, and force-recovers if something is presented while it is open.
- **Watchdogs.** If it is told to show and never reports itself open, the lock is
  force-released and the popover is remounted, which is the only way to unmount a Modal
  the library has left showing.

### Registering overlays

Anything that presents above the navigator — RN `<Modal>`s, bottom sheets, camera/Lens
overlays — should call `registerPresentedOverlay(id)` / `unregisterPresentedOverlay(id)`
from `popoverPresentationContext.ts`. `useIsFocused` is **not** sufficient: none of these
are navigator screens, so a screen stays "focused" while a modal covers it.

## Observability

`popoverTelemetry` sets an `active_popover` Sentry tag on acquire/release and adds
`popover` breadcrumbs, following the existing pattern in
`src/app/system/errorReporting/sentryTags.ts`.

Note the limit: a tag decorates events that are _already being sent_, so it gives
attribution, not an affected-user count. The watchdog is the natural place to emit an
explicit event if we ever want a count.

## palette-mobile / upstream

Verified against `node_modules`, so these are specific:

- **`onOpenStart` and `onCloseStart` already exist** (`react-native-popover-view`'s
  `Types.d.ts`) and palette already types and forwards them. No palette change needed to
  detect "told to show but never opened".
- **The `isShowingInModal` guard already exists and is enforced** (`RNModalPopover.js`).
  It is not missing — it is _racy_: the flag is set in `Modal`'s `onShow`, which fires
  asynchronously after the modal presents, so between `setState({ visible: true })` and
  `onShow` a second popover reads `false` and also shows. Fixing that means setting the
  flag at `setState` time, which is an **upstream PR**, not a palette change.
- **The one palette change we need:** palette types its props as
  `PopoverProps extends Omit<RNPopoverProps, "placement">`, where `RNPopoverProps` is
  `Types.PopoverProps`. But `mode` lives on `PublicPopoverProps`, not on
  `Types.PopoverProps`. At runtime `{...rest}` is spread after the explicit props so a
  `mode` would reach the library — it simply isn't typed through. Same for `from` and
  `testID`. Extending `Omit<PublicPopoverProps, "placement">` would unblock
  `mode={Mode.JS_MODAL}`, which removes this entire bug class rather than guarding it
  (at the cost of in-place rendering that ancestors can clip).
- **Worth raising:** when the library's guard refuses to open a popover it only
  `console.warn`s. The popover silently never opens, so `onOpenComplete` and
  `onCloseComplete` never fire — which is part of why the lock used to leak.
