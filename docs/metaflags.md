# Metaflags

## What is a Metaflag?

A Metaflag is our way to have local (as in "not pushed" and "not same for all devs") flags that are easy to change and easy to read from anywhere in the app.

They are called "meta" flags because they are not the usual app feature flags, these are flags that change things about the development of the app. They do that by sometimes altering how the app works, and that's an extra reason why we don't want these flags in the repo, but ignored.

Other uses that might come or will come in the future could be things like switching between app shells, etc. Basically any dev-related flag.

### Reset metaflags

You can reset the local metaflags by running `yarn setup:artsy`, which will copy the `metaflags.example.json` over to `metaflags.json`.
In `metaflags.example.json` we should always have the values of the flags that the CI and production environments should have.

## Available metaflags

### Hide loggers

You can turn off various loggers by setting the according values to false on `metaflags.json`

```
{
  "logAction": false,
  "logDatadog": false,
  "logEventTracked": false,
  "logNotification": false,
  "logOperation": false,
  "logPrefetching": false,
  "logRelay": false,
  "logRelayVerbose": false,
  "logRoute": false,
  "logRunningRequest": false
}

```
