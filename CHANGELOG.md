### 1.1.0-beta.4

- GeneVC scrolls as expected, and can request data from Eigen - orta
- Fix crash that would occur when tapping the ‘failed to load’ view retry button a second time - alloy
- Make tapping the search bar open the search VC - sarah

### 1.1.0-beta.3

- Added a search bar to Home - sarah
- Show refresh control until all Relay requests have finished - alloy
- Reduce memory usage of home view by using a ListView to remove views not on screen from the hierarchy - alloy
- Fix text height and truncation for artist cards - maxim
- Add hero units - alloy
- Fix missing image asset issue - alloy
- [dev] Updates Flow to 0.32 - orta
- [dev] Updates React to 0.34 - orta
- [dev] Turns on "keychain sharing" to fix a keychain bug in sim - orta
- GeneVC now shows about information, and trending artists - orta
- GeneVC now shows artworks for the gene - orta
- Show ‘bid now’ call to action on artworks that are in an auction - alloy

### 1.1.0-beta.2

- Adds an initial Gene view - orta
- Animate inverted button state change - alloy
- Do not show follow button on artist view until current status is retrieved - alloy
- Optimistically change state of follow button on artist view - alloy
- Bundle assets into a dir that can be included in release builds - alloy
- Remove typings from the npm `package.json` as the recommendation is a global install - orta
- Make follow artist button in artist rail work and replace with a new suggestion based on that artist - alloy
- Home now asks for maximum of 99 artwork rails - sarah
- Added pull-to-refresh functionality to home view - sarah
- Added a default minimum height for all rails - maxim
- Added a pretty load failure view and allow for retrying - alloy
- Added a section header for all Home rails - sarah
- Added an Artworks rail to Home view - sarah
- Added Danger, a CHANGELOG and some tests - orta

### 1.0.3

[Original release]
