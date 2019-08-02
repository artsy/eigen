### Using the Eigen Beta

_First up:_ The Eigen beta starts off on Artsy's production environment. It's recommended that you migrate to staging via the admin menu mentioned below though. This means that hero units, shows and artworks can occasionally have meta-data differences. They definitely can be out of date too, staging's data gets updated once a week from the main artsy database. However, being on staging means you can't break anything ;)

_Second up:_ We have a "Rage Shake" gesture, for both Admins on the main app, and for all beta users. This brings up a menu that has a lot of options.

_Thirdly:_ You can offer feedback in the app by taking a screenshot, this will bring up a feedback form. Note that the feedback can be seen publicly, and so be cautious around writing partner details in the form.

### The admin menu

You can access the admin menu in two ways:

- If logged in as an admin, shake your device.
- Otherwise, go to Safari and type `artsy:///admin` into the address bar (note the triple-slash).

The admin menu is comprised of four parts:

- Useful actions, for example switching between staging and production
- Lab settings, which are toggles for specific features within Eigen
- Offline recording mode (only relevant if you want to record a demo for working offline.)
- Developer API settings (useful for web/platform developers)

User related highlights:

#### Quicksilver

Quicksilver is a way to access any resource on Artsy. It's like the search but keeps track of history, and allows you to write in any artsy URL to test. This is useful because it is not easy to put in a specific URL into the app e.g. https://www.artsy.net/article/artsy-editorial-uncovering-the-surprisingly-secret-world-of-art-auctions

Note: You can always open any url by opening Safari, and putting the URL in, then replacing the `https://` with `artsy://` e.g.

```
https://www.artsy.net/article/artsy-editorial-uncovering-the-surprisingly-secret-world-of-art-auctions
->
artsy://www.artsy.net/article/artsy-editorial-uncovering-the-surprisingly-secret-world-of-art-auctions
```
