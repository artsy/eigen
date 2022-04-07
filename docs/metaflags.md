# Metaflags

## What is a Metaflag?

A Metaflag is our way to have local (as in "not pushed" and "not same for all devs") flags that are easy to change and easy to read from anywhere in the app.

They are called "meta" flags because they are not the usual app feature flags, these are flags that change things about the development of the app. They do that by sometimes altering how the app works, and that's an extra reason why we don't want these flags in the repo, but ignored.

Other uses that might come or will come in the future could be things like switching between app shells, using tslint or eslint etc. Basically any dev-related flag.

### Reset metaflags

You can reset the local metaflags by running `yarn setup:artsy`, which will copy the `metaflags.example.json` over to `metaflags.json`.
In `metaflags.example.json` we should always have the values of the flags that the CI and production environments should have.

## Available metaflags

### Storybook

One example, and the first usage of the metaflags, is the `startStorybook` metaflag.
When running the app using `yarn start`, the app starts normally. When running the app using `STORYBOOK=1 yarn start`, the app starts with the storybook ui directly.
By adding the `STORYBOOK=1` part in the command, the value in `metaflags.json` will turn to `true` (this happens with some scripts, look at `prestart` in `package.json`, but this is an implementation detail. Others flags might not need this.) Once the flag is turned to `true`, reading it in the app is easy, just a `require("metaflags")` call and here we go. For the storybook flag, this is happening on `index.ios.js` and `index.android.js` files.

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
  "logRoute": false,
  "logRunningRequest": false
}

```
