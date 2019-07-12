## Betas

Deployment to TestFlight is handled by Circle CI when you send a commit to the `beta` branch of Eigen, run `make deploy` locally to trigger it. It takes about 45 minutes. There is a blog post on the process [here](http://artsy.github.io/blog/2015/12/15/Automating-Testflight-Deploys/).

Note that only one beta can be deployed at a time; teams should coordinate on how to use that availability.

There are two types of betas on TestFlight: Internal and External. Our deploy script sends the beta to both groups. However, Internal testers get access to the beta immediately, while external testers may have a delay of several hours while Apple does beta review. This additional review typically only happens when we change the version number.
