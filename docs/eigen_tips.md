# Eigen Tips

## Use Quicksilver

Quickly load any type of our primitives ( shows / artworks / artists etc ) by pressing enter on the keyboard when the app loads, typing in your changes and then pressing enter again.

Be sure to sign-in with an admin account if you wish to see admin only content, such as ‘unpublished’ artworks.

## Use the developer springboard function

Edit `Artsy/Classes/View Controllers/ARTopMenuViewController+DeveloperExtras.m` with any custom code that you would like to run on application startup. For example, you may want to load a specific Fair with the following code.

```objc
- (void)runDeveloperExtras
{
    UIViewController *controller = [ARSwitchBoard loadFairWithID:@"the-armory-show-2014"];
    [self.navigationViewController pushViewController:controller animated:YES];
}
```

Run `git update-index --assume-unchanged "Artsy/Classes/View Controllers/ARTopMenuViewController+DeveloperExtras.m"` to ignore changes on this file.

## Use the offline mode for extra party/speed

(**Note**: these haven't been tested for Metaphysics API calls, which are most of our API calls these days. The docs are included here for posterity when working with native code only.)

Dustin left us with the amazing `NSVCRURLConnection`, which allows you to save an entire HTTP session for either working offline, or for getting back _faster_ http requests. Load the debug menu and hit the "Start" option to make it record, then go save when you're done and it will have it copied.
