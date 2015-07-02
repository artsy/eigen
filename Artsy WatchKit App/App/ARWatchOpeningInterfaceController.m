#import "ARWatchOpeningInterfaceController.h"
#import "NotificationController.h"
#import "WatchBiddingDetails.h"
#import "WatchMessage.h"
#import "UICKeyChainStore.h"
#import "ARDefaults.h"
#import "AROptions.h"


@implementation ARWatchHomeRowController
@end


@interface ARWatchOpeningInterfaceController ()
@property (nonatomic, copy) NSArray *menuItemTitles;
@end


@implementation ARWatchOpeningInterfaceController

- (void)awakeWithContext:(id)context
{
    BOOL hasLoggedInUser = [self hasLoggedInUser];
    BOOL hasShowsNearbyEnabled = [self hasShowsNearbyEnabled];

    NSMutableArray *mutableTitles = [NSMutableArray array];

    if (hasShowsNearbyEnabled) {
        [mutableTitles addObject:@"Shows nearby"];
    }

    if (hasLoggedInUser) {
        [mutableTitles addObject:@"Works For You"];
        [mutableTitles addObject:@"Auctions"];
    }

    [self.table setNumberOfRows:mutableTitles.count withRowType:@"default"];

    self.menuItemTitles = mutableTitles;
    for (NSString *title in mutableTitles) {
        ARWatchHomeRowController *row = [self.table rowControllerAtIndex:[mutableTitles indexOfObject:title]];
        row.titleLabel.text = title.uppercaseString;
    }

    self.logInMessageGroup.hidden = hasLoggedInUser;
}

- (void)table:(WKInterfaceTable *)table didSelectRowAtIndex:(NSInteger)rowIndex
{
    NSString *title = self.menuItemTitles[rowIndex];

    if ([title isEqualToString:@"Works For You"]) {
        [self worksForYouTapped];
    }
    if ([title isEqualToString:@"Auctions"]) {
        [self favoritesTapped];
    }
    if ([title isEqualToString:@"Shows nearby"]) {
        [self showsTapped];
    }
}

- (void)handleActionWithIdentifier:(NSString *)identifier forRemoteNotification:(NSDictionary *)remoteNotification
{
    if ([identifier isEqual:@"outbid"]) {
        WatchBiddingDetails *details = [[WatchBiddingDetails alloc] initWithDictionary:remoteNotification[@"aps"]];
        [self pushControllerWithName:@"Place Bid" context:details];
    }
}

- (void)handleActionWithIdentifier:(NSString *)identifier forLocalNotification:(UILocalNotification *)localNotification
{
    // Temporary, hopefully.
    if ([identifier isEqual:@"outbid"]) {
        [self handleActionWithIdentifier:identifier forRemoteNotification:localNotification.userInfo];
    }
}


- (IBAction)favoritesTapped
{
    WatchMessage *message = [WatchMessage messageToRequestFavorites];
    [self pushControllerWithName:@"Loader" context:message];
}

- (IBAction)recommendedTapped
{
    WatchMessage *message = [WatchMessage messageToRequestRecommended];
    [self pushControllerWithName:@"Loader" context:message];
}


- (IBAction)showsTapped
{
    WatchMessage *message = [WatchMessage messageToRequestShows];
    [self pushControllerWithName:@"Loader" context:message];
}

- (IBAction)worksForYouTapped
{
    WatchMessage *message = [WatchMessage messageToRequestWorksForYou];
    [self pushControllerWithName:@"Loader" context:message];
}


- (BOOL)hasLoggedInUser
{
    NSString *service = [[NSBundle mainBundle] bundleIdentifier];
    service = [service stringByReplacingOccurrencesOfString:@".watchkitextension" withString:@""];
    NSString *token = [UICKeyChainStore stringForKey:AROAuthTokenDefault service:service accessGroup:@"group.net.artsy.eigen"];
    return token != nil;
}

- (BOOL)hasShowsNearbyEnabled
{
    return YES;
    //    return [AROptions boolForOption:AROptionsShowsNearMe];
}

@end
