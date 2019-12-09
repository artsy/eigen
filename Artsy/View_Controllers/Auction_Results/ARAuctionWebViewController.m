#import "ARLogger.h"
#import "ARAuctionWebViewController.h"
#import "ARAppConstants.h"
#import <Emission/ARArtworkComponentViewController.h>
#import "User.h"
#import "Artwork.h"
#import "ARSwitchBoard+Eigen.h"

#import "UIDevice-Hardware.h"


@implementation ARAuctionWebViewController

- (void)dealloc;
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithURL:(NSURL *)URL;
{
    NSString *auctionID = nil;
    NSString *artworkID = nil;
    NSArray *components = [URL.path componentsSeparatedByString:@"/"];
    switch (components.count) {
        case 5:
            artworkID = components[4];
        case 3:
            auctionID = components[2];
            break;
        default:
            NSAssert(NO, @"Unexpected amount of auction URL components.");
    }
    return [self initWithURL:URL auctionID:auctionID artworkID:artworkID];
}

- (instancetype)initWithURL:(NSURL *)URL
                  auctionID:(NSString *)auctionID
                  artworkID:(NSString *)artworkID;
{
    if ((self = [super initWithURL:URL])) {
        _auctionID = auctionID;
        _artworkID = artworkID;

        NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
        [nc addObserver:self
               selector:@selector(artworkBidUpdated:)
                   name:ARAuctionArtworkBidUpdatedNotification
                 object:nil];
        if (artworkID) {
            [nc addObserver:self
                   selector:@selector(registrationUpdated:)
                       name:ARAuctionArtworkRegistrationUpdatedNotification
                     object:nil];
        }
    }
    return self;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
    if (navigationAction.navigationType == WKNavigationTypeOther) {
        NSURL *URL = navigationAction.request.URL;
        // martsy uses the fragment, force uses a path component
        if ([URL.fragment isEqualToString:@"confirm-bid"] || [URL.lastPathComponent isEqualToString:@"confirm-bid"]) {
            [self bidHasBeenConfirmed];
            return WKNavigationActionPolicyCancel;
        }
        if ([URL.lastPathComponent isEqualToString:@"confirm-registration"]) {
            [self registrationHasBeenConfirmed];
            return WKNavigationActionPolicyCancel;
        }
    }
    return [super shouldLoadNavigationAction:navigationAction];
}

// On Force you can directly bid on a work from the auction overview. If that’s the case, then insert the artwork view
// into the stack for the user to return to.
- (void)ensureArtworkViewControllerIsLowerInStack;
{
    NSArray *stack = self.navigationController.viewControllers;

    ARArtworkComponentViewController *artworkViewController = stack[stack.count - 2];
    if ([artworkViewController isKindOfClass:ARArtworkComponentViewController.class] && [artworkViewController.artworkID isEqualToString:self.artworkID]) {
        return;
    }

    artworkViewController = [ARSwitchBoard.sharedInstance loadArtworkWithID:self.artworkID inFair:nil];
    NSMutableArray *mutatedStack = [stack mutableCopy];
    [mutatedStack insertObject:artworkViewController atIndex:stack.count - 1];
    self.navigationController.viewControllers = mutatedStack;
}

- (void)bidHasBeenConfirmed;
{
    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];

    // Ensure we don’t send a notification to ourselves.
    // The observer can be removed, because this VC will be removed from the stack anyways.
    [nc removeObserver:self];

    [nc postNotificationName:ARAuctionArtworkBidUpdatedNotification
                      object:self
                    userInfo:@{ARAuctionIDKey : self.auctionID, ARAuctionArtworkIDKey : self.artworkID}];

    [self ensureArtworkViewControllerIsLowerInStack];
    [self.navigationController popViewControllerAnimated:ARPerformWorkAsynchronously];
}

- (void)artworkBidUpdated:(NSNotification *)notification;
{
    NSDictionary *info = notification.userInfo;
    if ([info[ARAuctionIDKey] isEqualToString:self.auctionID] && (self.artworkID == nil || [info[ARAuctionArtworkIDKey] isEqualToString:self.artworkID])) {
        ARActionLog(@"Will reload due to auction artwork bid updated: %@ - auction:%@ - artwork:%@",
                    self, self.auctionID, self.artworkID);
        [self reload];
    }
}

- (void)registrationHasBeenConfirmed;
{
    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];

    // Ensure we don’t send a notification to ourselves.
    // The observer can be removed, because this VC will be removed from the stack anyways.
    [nc removeObserver:self];

    [nc postNotificationName:ARAuctionArtworkRegistrationUpdatedNotification
                      object:self
                    userInfo:@{ARAuctionIDKey : self.auctionID}];

    if (self.presentingViewController) {
        [self.presentingViewController dismissViewControllerAnimated:ARPerformWorkAsynchronously completion:nil];
    } else {
        [self.navigationController popViewControllerAnimated:ARPerformWorkAsynchronously];
    }
}

- (void)registrationUpdated:(NSNotification *)notification;
{
    NSDictionary *info = notification.userInfo;
    if ([info[ARAuctionIDKey] isEqualToString:self.auctionID]) {
        ARActionLog(@"Will reload due to auction registration updated: %@ - auction:%@", self, self.auctionID);
        [self reload];
    }
}

@end
