# Adding a New Experiment

We are using Unleash to run A/B Testing experiments at Artsy. In order to create an experiment, we will need to first add it to the [Unleash dashboard](https://unleash.artsy.net/projects/default) then make code adjustments to use it.

## Adding an experiment to Unleash dashboard

1. Log into Unleash using your personal Artsy account, then find the admin account in 1Password.
   `https://unleash.artsy.net/projects/default`
2. Tap on **New feature toggle** and fill in required details.
3. Tap on **Variants** and define your different variations that users can get.
4. Tap on **Strategies** and define how many/who can be part of that experiment.
5. Try turning it on for `development` and test on eigen.

## Adding an experiment to Eigen

1. In the file `experiments.ts` add your new experiment.

```ts
  "our-new-experiment": {
    fallbackEnabled: false,
  },
```

or if we want a variant we can use something like

```ts
  "our-new-experiment": {
    fallbackEnabled: true,
    fallbackVariant: "the-variant-name",
  },
```

_The `fallback*` values are values we would like to fall back to in case something goes wrong with the client sdk_

Don't forget to add some tracking on this, using `maybeReportExperimentFlag`. Look for other examples in the code.

## Using an experiment

In order to use an experiment, we have two custom hooks that we created that support querying for a flag (`useExperimentFlag`) or an experiment (`useExperimentVariant`). The first one returns a boolean, the second returns a small object for variants and their payloads etc.

### Querying for a single flag

You can access the flag value in a functional react component using `useExperiementFlag`.

```diff
+ const ourNewFlagEnabled = useExperiementFlag("our-new-flag")
  return (
    <>
+    {ourNewFlagEnabled && <ConditionallyShownComponent />}
    <>
  )
```

### Querying for a single experiment

You can access the variant value in a functional react component using `useExperimentVariant`.

```diff
+ const ourNewExperiment = useExperiementFlag("our-new-experiment")
  return (
    <>
+    {ourNewExperiment.enabled && ourNewExperiment.variant === "varA" && <AComponent />}
+    {ourNewExperiment.enabled && ourNewExperiment.variant === "varB" && <BComponent custom={ourNewExperiment.payload} />}
    <>
  )
```

## Removing/Killing an Experiment

Once an experiment is done, usually we have a winner variant. In order to roll out that variant for everyone targeted by it, we will need to set it as a default strategy before "killing" it.

For example, in the previous experiment, we were testing if `varA` is performing better than `varB`. Assuming that it actually did, we then set `varA` as a default variant.
Then we need to update eigen to remove the experiment code and use only the winner variant code.
After that, we can archive that experiment in the Unleash dashboard.

## Still need help?

Ask for help in the #practice-mobile slack channel, we will be happy to assist!
