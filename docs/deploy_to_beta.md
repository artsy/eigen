## Betas

To test your new features on a real device you can create a beta version.

We prefer creating beta version from the main branch.

```
./scripts/deploy-both
```

and soon you will have betas on testflight and firebase

Ask `eigen beta?` on the #practice-mobile channel to get the links if you are not in the betas yet.

--

Deployment to TestFlight and Play Store is handled by Circle CI. Nightly betas are release automatically, but if you need to deploy something right away, run `./scripts/deploy-both` (or `./scripts/deploy-ios` or `./scripts/deploy-android` for individual releases) locally to trigger a beta build on CI. It takes about 45 minutes. There is a blog post on the process [here](http://artsy.github.io/blog/2015/12/15/Automating-Testflight-Deploys/).

Note that only one beta can be deployed at a time; teams should use [feature flags](./developing_a_feature.md) to avoid the need for having two parallel beta versions.

There are two types of betas on TestFlight: Internal and External. Our deploy script sends the beta to both groups. However, Internal testers get access to the beta immediately, while external testers may have a delay of several hours/days while Apple does beta review. This additional review typically only happens when we change the version number.
