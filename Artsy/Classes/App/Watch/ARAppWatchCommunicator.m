#import "ARAppWatchCommunicator.h"
#import <UICKeyChainStore/UICKeyChainStore.h>
#import "WatchBiddingDetails.h"
#import "ARRouter.h"
#import "ARWatchBidNetworkModel.h"
#import "ARUserManager.h"
#import "WatchMessage.h"
#import "ArtsyWatchAPI.h"

#import "WatchShow.h"
#import "WatchShow+ArtsyModels.h"
#import "WatchArtwork.h"
#import "WatchArtwork+ArtsyModels.h"
@import CoreLocation;


@interface ARAppWatchCommunicator () <CLLocationManagerDelegate>

/// Only to be used in locationManager:didUpdateLocations:
@property (nonatomic, copy) void (^currentReply)(NSDictionary *);
@property (readonly, nonatomic, strong) CLLocationManager *locationManager;
@end


@implementation ARAppWatchCommunicator

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].watchInteractionDelegate = [[self alloc] init];
}

- (void)application:(UIApplication *)application handleWatchKitExtensionRequest:(NSDictionary *)userInfo reply:(void (^)(NSDictionary *))reply
{
    // Due to keychain security, the iPhone app cannot access the keychain to get the accesstoken. The watch
    // however does. So we pass the token from the watch to the app, where it sits in the ARUserManger for
    // the duration of the requests.

    WatchMessage *incoming = [[WatchMessage alloc] initWithDictionary:userInfo];

    // @(-1) is used as a Null in WatchMessages.
    BOOL hasALoggedInUser = [incoming.authenticationToken isKindOfClass:NSString.class];
    if (hasALoggedInUser) {
        [[ARUserManager sharedManager] setUserAuthenticationToken:incoming.authenticationToken];
    }

    [ARDefaults setup];
    [ARRouter setup];

    switch (incoming.action) {
        case ARWatchMessageRequestBid: {
            WatchBiddingDetails *details = [[WatchBiddingDetails alloc] initWithDictionary:incoming.referenceObject];

            @weakify(self);
            [ARWatchBidNetworkModel bidWithDetails:details:^(BidderPosition *position) {
                @strongify(self);
                [self validateTopBidderWithDetails:details completion:reply];

            } failure:^(NSError *error) {
                WatchMessage *response = [WatchMessage messageWithError:error.localizedDescription];
                reply(response.dictionaryRepresentation);
            }];

            break;
        }

        case ARWatchMessageRequestFavorites: {
            NSString *userID = [User currentUser].userID;
            NSURLRequest *request = [ARRouter newArtworksFromUsersFavoritesRequestWithID:userID page:1];
            [self getArtworksForRequest:request completion:reply];
            break;
        }

        case ARWatchMessageRequestRecommended: {
            NSURLRequest *request = hasALoggedInUser ? [ARRouter suggestedHomepageArtworksRequest] : [ARRouter orderedSetItems:@"5225c8b1139b21a63d0001be"];
            [self getArtworksForRequest:request completion:reply];
            break;
        }


        case ARWatchMessageRequestWorksForYou: {
            NSURLRequest *request = [ARRouter worksForYouRequest];
            [self getArtworksForRequest:request completion:reply];
            break;
        }

        case ARWatchMessageRequestShows: {
            if ([self hasAccessToBackgoundLocation]) {
                [self getLocalShowsWithCompletion:reply];
            } else {
                NSString *error = @"net.artsy.shows.no_auth";
                reply([WatchMessage messageWithError:error].dictionaryRepresentation);
            }

            break;
        }
    }
}

- (BOOL)hasAccessToBackgoundLocation
{
    return [CLLocationManager authorizationStatus] != kCLAuthorizationStatusNotDetermined;
}

- (void)getLocalShowsWithCompletion:(void (^)(NSDictionary *))reply
{
    self.currentReply = [reply copy];

    _locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    [self.locationManager startUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    [manager stopUpdatingLocation];
    CLLocationCoordinate2D currentCoordinates = manager.location.coordinate;
    NSURLRequest *request = [ARRouter newRunningShowsListingRequestForLongitude:currentCoordinates.longitude latitude:currentCoordinates.latitude];

    //    NSURLRequest *request = [ARRouter newRunningShowsListingRequestForLongitude:-73.996436 latitude:40.716464];

    [ArtsyWatchAPI getRequest:request parseToArrayOfClass:PartnerShow.class:^(NSArray *shows, NSURLResponse *response, NSError *error) {
        if (error) {
            WatchMessage *response = [WatchMessage messageWithError:error.localizedDescription];
            self.currentReply(response.dictionaryRepresentation);
            self.currentReply = nil;
            return;
        }
        WatchMessage *responseMessage = [WatchMessage messageWithShows:[shows map:^id(id object) {
            return [[[WatchShow alloc] initWithArtsyPartnerShow:object atLocation:manager.location] dictionaryRepresentation];
        }]];

        self.currentReply(responseMessage.dictionaryRepresentation);
        self.currentReply = nil;
    }];
}

- (void)getArtworksForRequest:(NSURLRequest *)request completion:(void (^)(NSDictionary *))reply
{
    [ArtsyWatchAPI getRequest:request parseToArrayOfClass:Artwork.class:^(NSArray *artworks, NSURLResponse *response, NSError *error) {
        if (error) {
            WatchMessage *response = [WatchMessage messageWithError:error.localizedDescription];
            reply(response.dictionaryRepresentation);
            return;
        }

        WatchMessage *responseMessage = [WatchMessage messageWithArtworks:[artworks map:^id(id object) {
            return [[[WatchArtwork alloc] initWithArtsyArtwork:object] dictionaryRepresentation];
        }]];

        reply(responseMessage.dictionaryRepresentation);
    }];
}

- (void)validateTopBidderWithDetails:(WatchBiddingDetails *)details completion:(void (^)(NSDictionary *))reply
{
    [ARWatchBidNetworkModel validateIsTopBidderForDetails:details:^{
        WatchMessage *response = [WatchMessage messageWithBidStatus:ARWatchBiddingStatusHighestBidder];
        reply(response.dictionaryRepresentation);

    } failure:^(NSError *error) {
        WatchMessage *response = [WatchMessage messageWithError:error.localizedDescription];
        reply(response.dictionaryRepresentation);
    }];
}

@end
