#import "ARWorksForYouNetworkModel.h"
#import "ArtsyAPI+Artworks.h"
#import "User.h"
#import "ARWorksForYouNotificationItem.h"
#import "Artwork.h"
#import "Artist.h"

#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARWorksForYouNetworkModel ()
@property (readwrite, nonatomic, assign) BOOL allDownloaded;
@property (readwrite, nonatomic, assign) BOOL downloadLock;
@property (readwrite, nonatomic, assign) NSInteger currentPage;

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
    [self getArtworks:^(NSArray *artworks) {
        NSMutableDictionary *artistDict = [[NSMutableDictionary alloc] initWithCapacity:artworks.count];

        // arrange artworks into dictionary grouped by artist ID
        [artworks each:^(Artwork *artwork) {
            if (artistDict[artwork.artist.artistID]) {
                [[artistDict valueForKey:artwork.artist.artistID] addObject:artwork];
            } else {
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

    } failure:nil];
}

- (void)getArtworks:(void (^_Nonnull)(NSArray<Artwork *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable))failure
{
    if (self.downloadLock) {
        return;
    }

    _downloadLock = YES;
    __weak typeof(self) wself = self;

    [self performNetworkRequestAtPage:self.currentPage success:^(NSArray<Artwork *> *artworks) {
        
        __strong typeof (wself) sself = wself;
        if (!sself) return;

        sself.currentPage++;
        sself.downloadLock = NO;

        if (artworks.count == 0) {
            sself.allDownloaded = YES;
        }

       success(artworks);

    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        if (!sself) return;

        sself.allDownloaded = NO;
        sself.downloadLock = NO;

        success(@[]);
    }];
}

- (void)performNetworkRequestAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    [ArtsyAPI getRecommendedArtworksForUser:[User currentUser].userID page:page success:success failure:failure];
}

@end
