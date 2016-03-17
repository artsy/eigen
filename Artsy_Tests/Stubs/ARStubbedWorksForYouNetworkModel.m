#import "ARStubbedWorksForYouNetworkModel.h"

#import "Artist.h"
#import "Artwork.h"
#import "Artwork+Extensions.h"


@implementation ARStubbedWorksForYouNetworkModel

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _currentPage = 1;
    _notificationItems = @[];
    _downloadedArtworkIDs = [[NSMutableArray alloc] init];

    return self;
}

- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure
{
    self.allDownloaded = YES;
    self.currentPage++;
    self.downloadedArtworkIDs = [[self.notificationItems map:^id(ARWorksForYouNotificationItem *item) {
        return [item.artworks map:^id(Artwork *artwork) {
            return artwork.artworkID;
        }];
    }] flatten];

    success(self.notificationItems);
}

- (BOOL)didReceiveNotifications
{
    return self.allDownloaded && self.downloadedArtworkIDs.count;
}

- (void)markNotificationsRead
{
    // don't actually make the request; do nothing
}

- (void)stubNotificationItemWithNumberOfArtworks:(NSUInteger)artworkCount;
{
    NSUInteger itemIndex = self.notificationItems.count;
    Artist *artist = [[Artist alloc] initWithDictionary:@{
        @"artistID" : NSStringWithFormat(@"stubbed_%ld", itemIndex),
        @"name" : NSStringWithFormat(@"Artist %ld", itemIndex)
    } error:nil];

    NSMutableArray *artworks = [[NSMutableArray alloc] initWithCapacity:artworkCount];
    for (int i = 0; i < artworkCount; i++) {
        Artwork *artwork = [[Artwork alloc] initWithDictionary:@{
            @"artworkID" : @"stubbed",
            @"title" : NSStringWithFormat(@"Artwork %d", i)
        } error:nil];
        artwork.artist = artist;
        [artworks addObject:artwork];
    }

    ARWorksForYouNotificationItem *item = [[ARWorksForYouNotificationItem alloc] initWithArtist:artist
                                                                                       artworks:artworks
                                                                                           date:[NSDate dateWithTimeIntervalSince1970:2]];

    self.notificationItems = [self.notificationItems arrayByAddingObject:item];
}

@end
