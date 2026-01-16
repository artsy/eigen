## Measuring performance with Flashlight

[Flashlight](https://docs.flashlight.dev/) is a performance monitoring tool that helps identify and diagnose performance issues in android mobile applications. It provides insights into app startup time, screen rendering times, and other critical performance metrics.

We have created a maestro test that runs flashlight on our android app to measure performance during app startup and home scrolling.

How to run the test:

1. Make sure you have [Maestro](https://docs.maestro.dev/getting-started/installing-maestro) installed on your machine.
2. Make sure you have flashlight installed on your machine. You can follow the [installation guide](https://docs.flashlight.dev/#installation).
3. Add the required environmental variables for this test in your `~/.zshrc`:
   - `MAESTRO_APP_ID`: `net.artsy.app`
   - `MAESTRO_TEST_EMAIL`: an existing test email account
   - `MAESTRO_TEST_PASSWORD`: an existing test email account password
4. `source ~/.zshrc`
5. Run `yarn android` for local build or connect your android device with the app installed.
6. Run `./e2e/perf/run-perf-tests.sh`, this will generate the report file and give you instructions on how to view it.

You can also run the tests in different builds and run the `./e2e/perf/run-perf-tests.sh` to compare performance between them.

Just make sure to have the right build installed on your device before running the script and you can compare the results like so:

```
flashlight report <report-1.json> <report-2.json>
```

This will open a view comparing the two reports side by side.
