# Progressive Onboarding

Progressive Onboarding Model is a simple store that controlls dismissed messages related to the user onboarding. The model consists in:

- dismissed: array of dismissed strings triggered by the user and/or code
- dismiss: function that dismisses one or more alerts at the same time
- isDimissed: function that checks if a specific onboarding string is dismissed
- sessionState:
  - isReady: controls the feature if is ready to be used or not
  - activePopover: sets an identifier of the current popover being displayed

## Create a Progressive Onboarding

On the [model](../src/app//store/ProgressiveOnboardingModel.ts#L47) we have saved artwork onboarding keys. To expand the keys we can you just go there and create more keys following the existing pattern.

```jsx
export const PROGRESSIVE_ONBOARDING_MY_FEATURE_STEP_1 = "my-feature-step-1"
export const PROGRESSIVE_ONBOARDING_MY_FEATURE_STEP_2 = "my-feature-step-2"
```

Note: do not use ts-ignore or other error suppressor to avoid creating the constants, it's using typings improve the confidence and avoid imports/exports of identifiers.

## Create a Progressive Onboarding Chain

Sometimes it's hard to have multiple onboarding chains running in parallel, we can use chains to control each chain of events we want to have running, also helpful dismissing an entire progressive onboarding feature.

```jsx
export const PROGRESSIVE_ONBOARDING_MY_FEATURE_CHAIN = [
  PROGRESSIVE_ONBOARDING_MY_FEATURE_STEP_1,
  PROGRESSIVE_ONBOARDING_MY_FEATURE_STEP_2,
]
```

## Using the store

### Checking if a feature is already dismissed

```jsx
const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
const dismissed = isDismissed("my-feature-step-1").status

useEffect(() => {
  if (!dismissed) {
    // some side-effect
  }
}, [dismissed])
```

### Dismissing a feature

```jsx
const { dismiss } = GlobalStore.actions.progressiveOnboarding
const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
const dismissed = isDismissed("my-feature-step-1").status

useEffect(() => {
  if (!dismissed) {
    dismiss("my-feature-step-1")
  }
}, [dismissed, dismiss])
```

### Dismissing a chain of a feature

```jsx
const { dismiss } = GlobalStore.actions.progressiveOnboarding
const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
const oldFeatureDismissed = isDismissed(PROGRESSIVE_ONBOARDING_MY_FEATURE_CHAIN[1]).status
const newFeatureDismissed = isDismissed("my-super-feature-step-1").status

// Simple example, if new feature started and the old still in progress, we dismiss the
// old feature chain for the example sake, in real scenarios it might be more complex
useEffect(() => {
  if (newFeatureDismissed && !oldFeatureDismissed) {
    dismiss(PROGRESSIVE_ONBOARDING_MY_FEATURE_CHAIN)
  }
}, [oldFeatureDismissed, newFeatureDismissed, dismiss])
```
