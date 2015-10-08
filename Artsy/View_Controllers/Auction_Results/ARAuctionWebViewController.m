#import "ARAuctionWebViewController.h"
#import "ARAppConstants.h"

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

- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
    if (navigationAction.navigationType == WKNavigationTypeOther
            && [navigationAction.request.URL.fragment isEqualToString:@"confirm-bid"]) {
        [self bidHasBeenConfirmed];
        return WKNavigationActionPolicyCancel;
    } else if (navigationAction.navigationType == WKNavigationTypeOther
        && [navigationAction.request.URL.lastPathComponent isEqualToString:@"confirm-registration"]) {
        [self registrationHasBeenConfirmed];
        return WKNavigationActionPolicyCancel;
    } else {
        return [super shouldLoadNavigationAction:navigationAction];
    }
}

- (void)bidHasBeenConfirmed;
{
    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];

    // Ensure we don’t send a notification to ourselves.
    // The observer can be removed, because this VC will be removed from the stack anyways.
    [nc removeObserver:self];

    [nc postNotificationName:ARAuctionArtworkBidUpdatedNotification
                      object:self
                    userInfo:@{ ARAuctionIDKey:self.auctionID, ARAuctionArtworkIDKey: self.artworkID }];

    [self.navigationController popViewControllerAnimated:ARPerformWorkAsynchronously];
}

- (void)artworkBidUpdated:(NSNotification *)notification;
{
    NSDictionary *info = notification.userInfo;
    if ([info[ARAuctionIDKey] isEqualToString:self.auctionID]
            && (self.artworkID == nil || [info[ARAuctionArtworkIDKey] isEqualToString:self.artworkID])) {
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
                    userInfo:@{ ARAuctionIDKey:self.auctionID }];

    [self.navigationController popViewControllerAnimated:ARPerformWorkAsynchronously];
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
