## Notifications (APN)
##### Orta Therox - Wed 4 Sep 2013

Out dev setup is a bit different because we throw the enterprise certs into the mix. We have three states, and two developer accounts.


| Dev        | Beta        | Production   |
| ---------- | ----------- | ------------ |
| Uses ARTSY INC| | Uses ARTSY INC | Uses Artsy Inc |
| Considered a Dev APN Account | Considered a Production APN Account |  Considered a Production APN Account |
| net.artsy.artsy.dev | net.artsy.artsy.beta | net.artsy.artsy |
| iOS Team Provisioning Profile: net.artsy.artsy.dev | Artsy Beta Enterprise Provisioning Profile | Art.sy Inc. |

You can get access to all of the keys, requests and certificates required to set up the APN servers ( ATM only Mixpanel ) from the Engineering 1password. The key is freshly minted for this task and clumsily named `Artsy (orta created) Key`. If you're renewing these certs, don't forget that you ensure the right cert is used for generating signing requests by right clicking in keychain.

![](../screenshots/keychain-new-push.png)

and finally, if you want to know what it should look like if you've got everything set up locally:

![](../screenshots/keychain-push.png)
