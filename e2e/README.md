# Performance tests

End-to-end UI tests live in [`e2e-agent-device/`](../e2e-agent-device/README.md). What's left here is
the Flashlight performance suite, which still drives the app with Maestro because Flashlight runs its
own `--testCommand`.

## Steps to run

Android only; Flashlight doesn't support iOS.

1. Install [Maestro](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli) and
   [Flashlight](https://docs.flashlight.dev/).
1. `yarn maestro:android:release:build`
1. `yarn open-emulator`
1. `yarn maestro:android:release:install`
1. Set the env vars: `export MAESTRO_APP_ID=net.artsy.app`,
   `export MAESTRO_TEST_EMAIL=email@email.com`, `export MAESTRO_TEST_PASSWORD=password`
1. `./e2e/perf/run-perf-tests.sh`

See [measuring performance with Flashlight](../docs/measuring_performance_with_flashlight.md) for
what the results mean.
