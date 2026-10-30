# Popovers

## TL;DR

- Use `OnboardingPopover` for every progressive onboarding popover. ESLint blocks importing
  palette's `Popover` anywhere else.
- Don't pass `mode` to the popover. We use the library default, `RN_MODAL`, for now.
- If you build something that covers the screen (a modal, a sheet), register it as an
  overlay so popovers don't show on top of it.

## Why popovers need special handling

palette's `Popover` uses `react-native-popover-view` in its default `RN_MODAL` mode, so
every popover is a transparent, full-screen native `<Modal>`.

- **Two at once freezes the app.** Two of these Modals, or one left mounted by mistake,
  block every touch. Nothing crashes and nothing hangs, so Sentry's app-hang detection
  never sees it.
- **The library can leave one stuck.** If a popover is hidden before it finishes opening
  (for example, its anchor scrolls away), its Modal can stay mounted. Unmounting it is the
  only fix.

## Using `OnboardingPopover`

```tsx
<OnboardingPopover
  id={PROGRESSIVE_ONBOARDING_MY_KEY}
  when={isFocused && isInView}
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

You provide the condition (`when`) and the copy. `OnboardingPopover` already skips keys that
were dismissed, and handles the rest:

- **One at a time.** Only one popover can show. The others wait and show once it closes,
  which is how chained popovers appear one after another.
- **Delay.** The condition is checked again when the delay ends, not just when it starts.
- **Anchor at rest.** It waits until the anchor is on screen and has stopped moving, both
  before taking its turn and again after the delay. The library measures the anchor only
  once, as it opens, so opening mid-scroll puts the popover in the wrong place. There is no
  timeout: an anchor that never stops moving (an autoplaying carousel, say) never gets its
  popover. Keep `isInView` in `when` where you have it, but don't rely on it alone:
  `Sentinel` doesn't report the anchor leaving the screen.
- **Right screen only.** If the user leaves the screen before the popover shows, it won't
  show, even if they come back. The next visit gets a new chance.
- **Never over an overlay.** It waits while a registered overlay is open. If one opens
  while the popover is showing, the popover closes and comes back after.
- **Recovery.** If a popover doesn't finish opening within 3 seconds, it is remounted and
  gives up its turn so other popovers can show.

## Registering overlays

`useIsFocused` stays `true` while a modal or sheet covers the screen, so popovers can't
tell they're covered. Register the overlay instead:

```tsx
const id = useId()
usePresentedOverlay(`MyPicker-${id}`, isOpen)
```

The id must be unique per instance.

Already registered: `app/Components/Modal.tsx`, `AutomountedBottomSheetModal`,
`ArtworkFilterNavigator` and `CityGuideCityPicker`. Other raw `react-native` `Modal`s are
not registered yet. Register one when it can appear on the same screen as a popover.

## Debugging

- The `active_popover` Sentry tag shows which popover holds the lock.
- `popover` breadcrumbs log acquire/release, `watchdog` (a stuck popover) and
  `covered by overlay`.
- A popover waiting for its anchor to settle leaves no breadcrumb. If one never shows on a
  scrolling surface, check that its anchor ends up still and on screen.
- **Dev Menu → Clear Progressive Onboarding progress** resets dismissed popovers. The
  `DTHideAllOnboardingPopovers` toggle hides all popovers, so keep it off when testing.

## Why not `JS_MODAL`?

palette 24.19.0 accepts a `mode` prop, so `mode={Mode.JS_MODAL}` is possible. It renders
the popover in place, not as a native Modal, which would remove the stuck-Modal problem.
We're not using it for now because:

- It has no protection against two popovers at once, so `OnboardingPopover` would be the
  only safeguard.
- In-place popovers can be clipped by parent views (tab bar surfaces are the likely
  problem).

If we switch, do it in its own PR with a device check of every popover.
