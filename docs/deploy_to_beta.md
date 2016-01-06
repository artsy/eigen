## Betas

Deployment to testflight is handled by CircleCI when you send a commit to the `beta` branch of eigen, run `make deploy` locally to trigger it. There is a blog post on the process [here](http://artsy.github.io/blog/2015/12/15/Automating-Testflight-Deploys/).

There are two types of betas on testflight: Internal and External.

Internal betas are the ones triggered by shipping code to the `beta` branch ( or by running `make ipa; make distribute` locally.) These need no human intervention in order to ship them to a phone, usually just the processing time which comes to about 10-15 minutes. They go to anyone who is a user inside our iTunes Connect team. That tends to just be the product team.

External betas requires a quick review from Apple. So far these have taken about a day. Nothing too prohibiting, but as of yet, there is no automation with respect to shipping a beta to external developers. You need to go into iTunes Connect, click through to Eigen, then choose an internal beta to be exposed to the outter world.
