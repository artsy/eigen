## Standard Scroll View

- [ ] After scrolling down, when I tap the status bar it should scroll back to the top
- [ ] When I scroll down the back button should disappear
  - [ ] When I scroll back up a little way the back button should reappear
- [ ] The status bar text should be legible at the top, and at most scroll positions

## Fair

- 💡 You can navigate to a fair at the top of the `for you` tab on the home page

- [ ] The page conforms to our [Standard Scroll View](#standard_scroll_view) spec
  - ⚠️ Status bar text is white at all times, which makes it practically invisible as soon as you scroll past the header
- [ ] I see a header with a suitable background image and a label describing the fair and when it takes place
- [ ] I see a map component showing where the fair is
  - [ ] When I tap the map should open the share sheet for maps, tapping through to a map app should show the correct location.
    - ❓ seems like it shows options for a hard-coded set of apps even if you don't have all the apps installed. is there a better way on iOS?
- [ ] I might see a 'view more information' link that takes me to a web view
  - ❓ this should probably open a browser rather than a web view in our app?
- [ ] I can see the fair's opening hours
- [ ] I can see a 'browse the fair' navigation menu with three options 'Artists', 'Works', and 'Exhibitors'
  - [ ] When I tap the 'Artists' link it takes me to a [Fair Artists List](#fair_artists_list) page.
  - [ ] When I tap the 'Works' link it takes me to a [Fair Artworks List](#fair_artworks_list) page.
  - [ ] When I tap the 'Exhibitors' link it takes me to a [Fair Exhibitors List](#fair_exhibitors_list) page.
- [ ] I can see a list of works grouped by exhibitor
  - [ ] At the bottom of each grouping, if the gallery has more than 4 works there should be a 'View all works >' link which takes you to the fair artworks list.
- [ ] scrolling to the bottom should trigger loading more of the galleries

  - ❓ there is no indication that it is loading more

- [ ] tapping on a work should take you to the proper artwork page
- [ ] tapping on a gallery should take you to the exhibitor page
- [ ] hitting follow on a gallery should work
- [ ] hitting unfollow on a gallery should work

## Fair Artists List

- 💡 You can navigate here from a fair page by tapping the 'Artists >' option in the 'Browse the fair' section.
- [ ] The page conforms to our [Standard Scroll View](#standard_scroll_view) spec
- [ ] the artist list should be grouped by first letter of surname with headings which loads more as you scroll
  - ❓ the sticky hearders for these groupings have transparent background which looks a bit odd
  - ❓ This is quite broken right now!! try scrolling all the way down fast
  - ❓ there is currently no indication that it is loading more
- [ ] tapping into an artist should take you to the proper artist page.
- [ ] following an artist should work.
- [ ] unfollowing an artist should work

## Fair Artworks list

- 💡 You can navigate here from a fair page by tapping the 'Works >' option in the 'Browse the fair' section.
- [ ] The page conforms to our [Standard Scroll View](#standard_scroll_view) spec
  - ❓Tapping the status bar currently doesn't scroll the user back to the top
- [ ] It should show an infinitely-scrollable list of the artworks in the fair/exhibitor.
- [ ] It should provide the ability to filter by medium.
- [ ] It should provide the ability to filter by price range.
- [ ] Tapping an artwork should take you to the proper artwork page for that work.

## Fair Exhibitors list

- 💡 You can navigate here from a fair page by tapping the 'Exhibitors >' option in the 'Browse the fair' section.
- [ ] The page conforms to our [Standard Scroll View](#standard_scroll_view) spec
- [ ] I see a list of exhibitor names grouped by first letter of exhibitor name
  - ❓ the sticky hearders for these groupings have transparent background which looks a bit odd
- [ ] When I tap one of the exhibitor names it takes me to the exhibitor page for that exhibitor.

## Fair Exhibitor

- 💡 You can navigate here e.g. by tapping on an exhibitor name on the a fair page.
- [ ] The page conforms to our [Standard Scroll View](#standard_scroll_view) spec
- [ ] It should show the name of the exhibitor, the name of the fair, the exhibitor's location at the fair, and how many works + artists they are representing.
- [ ] There should be a button to follow/unfollow and it should work.
- [ ] There should be a section showing a few artworks and (if there are more) a tappable link to to the Fair Artworks List containing only the artworks from this exhibitor.
- [ ] There should be a section showing a few artists and (if there are more) a tappable link to the Fair Artists list.
- [ ] Tapping the exhibitor name should take you to the proper partner page for the exhibitor.

## Artwork

- [ ] The page conforms to our [Standard Scroll View](#standard_scroll_view) spec
  - ❓The back button doesn't disappear when scrolling down.
- On an artwork page with only one image
  - [ ] I see a single image
  - [ ] I do not see any pagination dots below the image
  - [ ] I can not swipe the image left or right
  - [ ] When I make a swipe gesture on the image it does not open the full screen image view
  - [ ] When I tap the image, a smooth transition is played
        to bring the image into the center of the screen.
  - [ ] When I tap the image, a white background fades in obscuring the page beneath.
  - [ ] When I tap the image, a 'close' button appears smoothly in the top left corner
  - [ ] When I scroll down a little way to make the image partially obscured by the status bar and tap the image,
        the transition into full screen mode is smooth with no obstruction of the status bar.
  - In full screen mode
    - [ ] I should be able to pinch to zoom
    - [ ] I can swipe vertically to dismiss the full screen view
    - [ ] I can tap the close button to dismiss the full screen view
    - [ ] I can double tap to zoom in fully
    - When zoomed in a fair amount
      - [ ] I can double tap to reset the zoom
- On an artwork page with multiple images
  - [ ] I see the first image
  - [ ] I see pagination dots below the image
  - [ ] The first pagination dot is emphasized
  - [ ] I can tap the image to open full screen mode
  - [ ] I can swipe to the next image(s)
  - When swiping between images
    - [ ] The pagination dots are emphasized appropriately
    - [ ] The animation is smooth
    - [ ] I can tap on an image before the animation ends to open full screen mode
    - [ ] I can tap on an image a second after the animation ends to open full screen mode
  - [ ] When I scroll down a little way to make the image partially obscured by the status bar and tap the image,
        the transition into full screen mode is smooth with no obstruction of the status bar.
  - When going into full screen mode
    - [ ] A smooth transition is played to bring the image into the center of the screen
    - [ ] A white background fades in obscuring the page beneath
    - [ ] A 'close' button appears smoothly, directly above the 'back' button
    - [ ] An 'index indicator' fades in at the bottom of the screen to show which number image you're looking at
  - In full screen mode
    - [ ] I can double tap to zoom in
    - [ ] I can pinch to zoom
    - [ ] I can swipe between images
    - [ ] The image index updates when I swipe between images
    - [ ] The image index fades out when I zoom in
    - [ ] I can dismiss the full screen mode using the close button
    - [ ] I can dismiss the full screen mode by swiping vertically
    - [ ] If I switch to a different image than the one I tapped on and dismiss full screen mode, then
          the image and pagination dot on the main carousel update to match.
    - After having zoomed in
      - [ ] I can still swipe between images
      - [ ] If I swipe to a different image, wait for the animation to finish, and then swipe back again, the zoom level resets
      - [ ] The image index fades back in when I zoom out
      - [ ] I can double tap to zoom out
- [ ] I can save/favourite the image
- [ ] I can see how the artwork looks in my room (if my phone is ar-enabled)
- [ ] I can share the artwork using the iOS share sheet
- [ ] I should see the name of the artist above the fold
- [ ] I can follow the artist
- [ ] I can unfollow the artist
- [ ] I should see the name, year, medium, and dimensions of the artwork above the fold
- [ ] I should be told about the attribution class of the artwork.
- [ ] Tapping the attribution class information should tell me more generally about attribution classes.
- [ ] I can see the artwork's availability/price.
- [ ] I can see who the artwork is sold by.
- [ ] If the artwork supports buy-now I can buy it by going through the bnmo flow.
- [ ] If the artwork supports make-offer I can buy it by going through the bnmo flow.
- [ ] If the artwork is for sale but not enrolled in BNMO I can contact the gallery to make an inquiry.
- [ ] If the artwork is sold I can contact the gallery to inquire about similar works.
- [ ] I might see an 'About the work' section which gives a short text description of the work.
- [ ] I might see an 'Artwork details' section which lists important information about the work.
- [ ] I can see an 'About the artist' section
  - [ ] When I tap the artist name it takes me to the artist's page.
  - [ ] I can follow/unfollow the artist
- [ ] I can see a section about the partner if the artwork is not in an auction.
  - ❓The cities should be deduped at least, but if there's info about which location the artwork is at let's use that?
- [ ] I can see other works in the same context (e.g. show, fair booth, or )
