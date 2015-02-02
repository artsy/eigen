Eigen Tips
==============

Use Quicksilver
---------------

Quickly load any type of our primitives ( shows / artworks / artists etc ) by pressing enter on the keyboard when the app loads, typing in your changes and then pressing enter again.

Use your `.eigen` file
-----------------------

Authentication is a lot easier when you don't type so much, create a file in your home directory called `.eigen` and it takes a collection of `key:value` lines to have the username and password set for you in the `ARLoginViewController`.  You can use the `ARDeveloperOptions` class to react to the key value store. For example:

```
username:ash@artsymail.com
password:*****************
```

Use the developer springboard function
--------------------------------------

Edit `Artsy/Classes/View Controllers/ARTopMenuViewController+DeveloperExtras.m` with any custom code that you would like to run on application startup. For example, you may want to load a specific Fair with the following code.

```objc
- (void)runDeveloperExtras
{
    [ARSwitchBoard loadFairWithID:@"the-armory-show-2014"];
}
```

Run `git update-index --assume-unchanged "Artsy/Classes/View Controllers/ARTopMenuViewController+DeveloperExtras.m"` to ignore changes on this file.

Use the offline mode for extra party/speed
------------------------------------------

Dustin left us with the amazing `NSVCRURLConnection`, which allows you to save an entire HTTP session for either working offline, or for getting back _faster_ http requests. Load the debug menu and hit the "Start" option to make it record, then go save when you're done and it will have it copied.
