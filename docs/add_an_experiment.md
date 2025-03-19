# Adding a New Experiment

We are using Unleash to run A/B Testing experiments at Artsy. In order to create an experiment, we will need to first add it to the [Unleash dashboard](https://unleash.artsy.net/projects/default) then make code adjustments to use it.

### Contents

- [Adding a New Experiment](#adding-a-new-experiment)
  - [Contents](#contents)
  - [Adding an experiment to Unleash dashboard](#adding-an-experiment-to-unleash-dashboard)
  - [Adding an experiment to Eigen](#adding-an-experiment-to-eigen)
  - [Using an experiment](#using-an-experiment)
    - [Querying for a single flag](#querying-for-a-single-flag)
    - [Querying for a single experiment](#querying-for-a-single-experiment)
    - [Tracking an experiment](#tracking-an-experiment)
  - [Winding down a completed Experiment](#winding-down-a-completed-experiment)
  - [Adding an Override](#adding-an-override)
  - [Still need help?](#still-need-help)

## Adding an experiment to Unleash dashboard

1. To login to our [Unleash instance](https://unleash.artsy.net/projects/default), use your Artsy Google account to proceed past the Cloudflare Access prompt and then use the shared admin credentials in 1Password to login to the dashboard.
2. Tap on **New feature toggle** and fill in required details.
3. Tap on **Variants** and define your different variations that users can get.
4. Tap on **Strategies** and define how many/who can be part of that experiment.
5. Try turning it on for `development` and test on eigen.

## Adding an experiment to Eigen

1. In the file `experiments.ts` add your new experiment.

```ts
  "our-new-experiment": {
    description: "Experiment description",
    payloadSuggestions: ["payload-1", "payload-2"] // If applicable
  },
```

or if we want a variant we can use something like

```ts
  "our-new-experiment": {
    description: "Experiment description",
    payloadSuggestions: ["payload-1", "payload-2"] // If applicable
  },
```

| value                | description                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| `description`        | (`string`) a string describing your experiment                             |
| `variantSuggestions` | (`string[]`) a list of variant options, for use via the Dev Menu interface |
| `payloadSuggestions` | (`string[]`) a list of payload options, for use via the Dev Menu interface |

Don't forget to add some tracking on this, using `reportExperimentVariant`. Look for other examples in the code.

## Using an experiment

In order to use an experiment, we have two custom hooks that we created that support querying for a flag (`useExperimentFlag`) or an experiment (`useExperimentVariant`). The first one returns a boolean, the second returns a small object for variants and their payloads etc.

### Querying for a single flag

You can access the flag value in a functional react component using `useExperimentFlag`.

```diff
+ const ourNewFlagEnabled = useExperimentFlag("our-new-flag")
  return (
    <>
+    {ourNewFlagEnabled && <ConditionallyShownComponent />}
    <>
  )
```

### Querying for a single experiment

You can access the variant value in a functional react component using `useExperimentVariant`.

```diff
+ const { variant } = useExperimentVariant("our-new-experiment")
+
+ return (
+   <>
+     {variant.enabled ? (
+      {variant.name === "control" && <ControlComponent />}
+      {variant.name === "variant-b" && <ExperimentComponent payload={variant.payload} />}
+      {variant.name === "variant-c" && <ExperimentComponent payload={variant.payload} />}
+     ) : (
+      <ControlComponent />
+     )}
+   <>
+ )
```

> Note: Avoid using `experiment.variant` and instead use the `experiment.payload` for rendering your UI! it's more future proof and it's more convenient this way to create multiple experiments using the same flag where you update the control variant

### Tracking an experiment

In order to track an experiment, you can use the `trackExperiment` helper that comes from `useExperimentVariant` hook,

```diff
+ const { trackExperiment } = useExperimentVariant("our-new-experiment")
+
+ trackExperiment({
+   context_owner_screen: OwnerType.artist,
+   context_owner_id: "4d8b92b34eb68a1b2c0003f4",
+   context_owner_slug: "andy-warhol",
+   context_owner_type: OwnerType.artist,
+ })
```

## Winding down a completed Experiment

Once an experiment is done, we'll have a winning variant. In order to roll out the winning variant for everyone, we can promote the variant to 100% of users in the Unleash dashboard.

For example, in the previous experiment, we were testing if the `variant-b` variant performed better than `control` we'd promote `variant-b` to 100% of variant requests.

Afterwards we can update Eigen to remove the experiment code, leaving only the winning variant in place.

We should leave the experiment active in Unleash until clients are no longer requesting a variant for the experiment. This can take some time as users naturally upgrade.

## Adding an Override

Our infra supports adding admin overrides from the dev menu. In order to add an override:

1. Open the dev menu
2. Tap on **Experiments**
3. Tap on ✏️ next to the payload or the variant name.
4. Add your own `variant`/`payload` override or select from the list of suggestions.
5. Tap **Save**

<center>
  <img src="./screenshots/adding_an_admin_override.gif" width="250"/>
</center>

## Still need help?

Ask for help in the [#practice-mobile 🔐](https://artsy.slack.com/archives/C02BAQ5K7) slack channel, we will be happy to assist!
