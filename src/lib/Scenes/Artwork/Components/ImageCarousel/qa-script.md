# QA script for ImageCarousel

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
