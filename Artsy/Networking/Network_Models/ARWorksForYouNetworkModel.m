#import "ARWorksForYouNetworkModel.h"
#import "ArtsyAPI+Notifications.h"
#import "User.h"
#import "ARWorksForYouNotificationItem.h"
#import "Artwork.h"
#import "Artist.h"

#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARWorksForYouNetworkModel ()
@property (readwrite, nonatomic, assign) BOOL allDownloaded;
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@property (atomic, weak) AFHTTPRequestOperation *currentRequest;

@end


@implementation ARWorksForYouNetworkModel

- (instancetype)init
{
    self = [super init];
    if (!self) return nil;

    _currentPage = 1;
    return self;
}

- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure
{
    NSAssert([NSThread isMainThread], @"This should only be called by the main thread");

    if (self.currentRequest) {
        return;
    }

    [self performWorksForYouRequest:^(NSArray *artworks) {
        NSMutableDictionary *artistDict = [[NSMutableDictionary alloc] initWithCapacity:artworks.count];

        // arrange artworks into dictionary grouped by artist ID
        [artworks each:^(Artwork *artwork) {
            if (artistDict[artwork.artist.artistID]) {
                [[artistDict valueForKey:artwork.artist.artistID] addObject:artwork];
            } else if (artwork.artist.artistID) {
                NSMutableArray *artworks = [NSMutableArray arrayWithObject:artwork];
                [artistDict setObject:artworks forKey:artwork.artist.artistID];
            }
        }];

        // turn each key-value pair into a notification item
        NSMutableArray *notificationItems = [[NSMutableArray alloc] initWithCapacity:artistDict.count];
        [artistDict each:^(id key, NSMutableArray<Artwork *> *artworks) {
            Artist *artist = artworks.firstObject.artist;
            ARWorksForYouNotificationItem *item = [[ARWorksForYouNotificationItem alloc] initWithArtist:artist artworks:artworks date:artworks.firstObject.publishedAt];
            [notificationItems addObject:item];
        }];

        // sort notification items by date
        NSSortDescriptor *descriptor = [[NSSortDescriptor alloc] initWithKey:@"date" ascending:NO];
        success([notificationItems sortedArrayUsingDescriptors:@[descriptor]]);

    } failure:failure];
}

- (void)performWorksForYouRequest:(void (^_Nonnull)(NSArray<Artwork *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable))failure
{
    __weak typeof(self) wself = self;

    // AFNetworking should release the request operation as soon as it is done (be it success or failure),
    // then `self.currentRequest` will be set to `nil` automatically by the objc runtime (because it is `weak`)
    self.currentRequest = [ArtsyAPI getRecommendedArtworksForUser:[User currentUser].userID page:self.currentPage success:^(NSArray<Artwork *> *artworks) {
        __strong typeof (wself) sself = wself;
        if (!sself) return;

        sself.currentPage++;
        if (artworks.count == 0) {
            sself.allDownloaded = YES;
        }

       success(artworks);

    } failure:failure];
}

- (void)markNotificationsRead
{
    [self markNotificationsReadWithSuccess:^(id __) {
    } failure:^(id __){
    }];
}

- (void)markNotificationsReadWithSuccess:(void (^)(id response))success
                                 failure:(void (^)(NSError *error))failure
{
    [ArtsyAPI markUserNotificationsReadWithSuccess:success failure:failure];
}

@end
