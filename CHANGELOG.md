### Master

-   [dev] Moves native view controllers to use iOS7+ status bar api - ash
-   [dev] Renamed files to reflect case in component/function names - alloy

###### Emission

-   Users/Devs can run any PR from inside beta/sim - orta
-   Users now can access stories from inside the app - orta
-   [dev] Applies prettier 1.5.0, and adds it to the webhooks + extension settings - orta
-   [dev] Adds stories for new messaging components - maxim
-   [dev] Upgrades Sentry to 3.0, note Eigen integrator, this may require changes to Eigen - orta
-   [dev] Upgrades React Native to v0.45 - sarah
-   [dev] Allows toggling the back button by pressing space - orta

###### Messaging

-   Adds multiple attachment support - matt
-   Adds PDF Preview for attachments - matt
-   Fixes pagination for Conversations - luc
-   Adds pull to refresh support to Inbox view - luc
-   Adds an `ImagePreview` to each Conversation, Relay-ified messages - matt
-   Adds snapshot tests for active bids - luc
-   Update status label colors - luc
-   Renders active bids before Messages - luc
-   Adds active bids section on top of messages - luc
-   Adds a mutation for appending messages to a thread - alloy, matt, sarah
-   Adds an `ArtworkPreview` to each Conversation - sarah
-   Adds Inbox zero state - maxim
-   Relay support in Conversation container - sarah
-   Adds a `FlatList` for Messages in Conversations - sarah
-   Adds Conversation, Composer, and Message components - sarah
-   Adds Inbox view with real data - luc
-   Adds Inquiry modal - maxim
-   Adds a media preview controller that can show remote document files - alloy

###### Consignments

-   Adds a root component for the Consignments flow  - orta
-   Added the Welcome/Overview screen for consignments - orta
-   Adds component for attaching buttons to the keyboard  - orta
-   Adds component for artist search  - orta
-   Adds component for consignments todo  - orta
-   Adds storybooks for consignments  - orta
-   Adds some form elements for consignments - orta

### 1.3.8 & 1.3.9

-   [dev] Moves native view controllers to use iOS7+ status bar api - ash

### 1.3.6

-   Fixes missing compiled bundle - alloy

### 1.3.5

-   Fixes pull-to-refresh scroll position bug on Home - sarah
-   Fixes an issue where the WFU component was fetching data for artworks itself rather than delegating that to the nested
    artworks components - alloy
-   Fixes pull-to-refresh scroll position bug on Home - sarah
-   Fixes an issue where the WFU component was fetching data for artworks itself rather than delegating that to the nested artworks components - alloy

### 1.3.4

-   Fixes loading state UI for artwork rail - luc

### 1.3.3

-   Ensured rails without artworks cannot be rendered - sarah
-   Fix for strange scrolling behavior in WFU - sarah
-   [dev] Updates TypeScript to 2.3 - orta
-   [dev] Adds back storybooks - orta
-   Adds initial work on a new personal profile page - orta
-   [dev] Automates TS linting at dev time - orta
-   Adds inline bid info to artist grid elements - ash
-   Fixes display of artworks in non-expanding grids in artwork rails - ash
-   Adds Sentry for React Native which integrates with Eigen’s use of Sentry - alloy

### 1.3.2

-   Fix for blank scrollview bug - sarah

### 1.3.1

-   Works For You container QA - sarah

### 1.3.0

-   Added ability to create a special notification for a single artist in WFU - sarah
-   Added pagination to WFU container - sarah
-   Added a notifications updater to ARTemporaryAPIModule - sarah
-   Added artist avatar to WFU notifications - sarah
-   Added a Works For You container - sarah
-   Upgrade to RN 0.42-rc.3 - alloy
-   Made Gene view work with new relay-based infinite scroll grid - cab
-   Updated our fonts lib - orta
-   Converted to TypeScript - luc, sarah, alloy, orta

### 1.2.2

-   Move active bids home module to the top of the feed - alloy

### 1.2.1

-   Build with correct react-native version - alloy
-   Replaced fetching in infinite artworks grid component with relay - cab

### 1.2.0

-   Gave ESLint, Flow and Danger the ability to fail the build - orta
-   Gene Refine button is enabled - orta
-   Fix extra blankspace in Artist Card when data is missing - luc
-   Gene titles wrap so they don't get covered by back button - luc

### 1.1.4

-   Added test coverage for gene components - sarah
-   Added test coverage to buttons - sarah
-   Added test coverage to artwork grids - sarah
-   Added test coverage to all containers and Artist components - sarah
-   Added test coverage to Home container - sarah
-   Fixes bug in GeneVC where fetching was starting on page 2 - sarah
-   Update home view artworks rails order - maxim
-   Fix artist link to auction results - alloy
-   Update artworks grid to show multiple artist names when available - mzikherman

### 1.1.3

-   Remove the refine button from the gene view, for now, as it doesn’t work right yet - alloy

### 1.1.2

-   Artist VC uses one show component for medium & large lists - sarah
-   Ensure the artwork rail expand button is not clipped too early - alloy
-   Use a larger font size in hero units on iPad - alloy

### 1.1.1

-   Only align home view to top of screen, otherwise default to bottom status bar - alloy

### 1.1.0

-   Fix layout in Artist Shows component on iPad - sarah
-   Order home page rails as per design - alloy
-   Include all followed genes on home page (actually limited to 100) - alloy
-   Fix crash that would occur for artworks that have no artists - alloy
-   Added an auction results button to some artist pages - orta

### 1.1.0-beta.5

-   Fix use of outdated artist follow API that lead to a crash - alloy
-   Make banners 300 points tall on iPad - alloy

### 1.1.0-beta.4

-   GeneVC scrolls as expected, and can request data from Eigen - orta
-   Fix crash that would occur when tapping the "failed to load" view retry button a second time - alloy
-   Make tapping the search bar open the search VC - sarah

### 1.1.0-beta.3

-   Added a search bar to Home - sarah
-   Show refresh control until all Relay requests have finished - alloy
-   Reduce memory usage of home view by using a ListView to remove views not on screen from the hierarchy - alloy
-   Fix text height and truncation for artist cards - maxim
-   Add hero units - alloy
-   Fix missing image asset issue - alloy
-   [dev] Updates Flow to 0.32 - orta
-   [dev] Updates React to 0.34 - orta
-   [dev] Turns on "keychain sharing" to fix a keychain bug in sim - orta
-   GeneVC now shows about information, and trending artists - orta
-   GeneVC now shows artworks for the gene - orta
-   Show "bid now" call to action on artworks that are in an auction - alloy

### 1.1.0-beta.2

-   Adds an initial Gene view - orta
-   Animate inverted button state change - alloy
-   Do not show follow button on artist view until current status is retrieved - alloy
-   Optimistically change state of follow button on artist view - alloy
-   Bundle assets into a dir that can be included in release builds - alloy
-   Remove typings from the npm `package.json` as the recommendation is a global install - orta
-   Make follow artist button in artist rail work and replace with a new suggestion based on that artist - alloy
-   Home now asks for maximum of 99 artwork rails - sarah
-   Added pull-to-refresh functionality to home view - sarah
-   Added a default minimum height for all rails - maxim
-   Added a pretty load failure view and allow for retrying - alloy
-   Added a section header for all Home rails - sarah
-   Added an Artworks rail to Home view - sarah
-   Added Danger, a CHANGELOG and some tests - orta

### 1.0.3

[Original release]
