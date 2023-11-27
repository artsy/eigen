# Maestro end-to-end

Maestro is an end-to-end tool([aka UI testing tool](https://maestro.mobile.dev/)).
It is used like other tools such as Cypress, Appium, and Detox in order to run tests over scenarios.

## Steps to run

1. install maestro by following the instructions [here](https://maestro.mobile.dev/getting-started/installing-maestro)
   - `curl -Ls "https://get.maestro.mobile.dev" | bash`
   - `brew tap facebook/fb`
   - `brew install facebook/fb/idb-companion`

### iOS

1. `CI=1 yarn pod-install && yarn maestro:ios:release:build`
1. `yarn open-sim` open iOS simulator (after sim is booted run next step)
1. `yarn maestro:ios:release:install`

1. set the ENV vars `export MAESTRO_APP_ID=app_id` `export MAESTRO_TEST_EMAIL=email@email.com` `export MAESTRO_TEST_PASSWORD=password`
1. run the test that you want to run `maestro test e2e/config.yml`

### Android

1. `yarn maestro:android:release:build`
1. `yarn open-emulator`
1. `yarn maestro:android:release:install`

1. set the ENV vars `export MAESTRO_APP_ID=app_id` `export MAESTRO_TEST_EMAIL=email@email.com` `export MAESTRO_TEST_PASSWORD=password`
1. run the test that you want to run `maestro test e2e/flows/onboarding/signup.yml/config.yml`
