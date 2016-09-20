#import "ARWorksForYouNetworkModel.h"
#import "ARWorksForYouNotificationItem.h"


@interface ARStubbedWorksForYouNetworkModel : NSObject <ARWorksForYouNetworkModelable>

@property (nonatomic, assign) BOOL allDownloaded;
@property (nonatomic, assign) BOOL networkingDidFail;
@property (nonatomic, copy, readwrite) NSArray<ARWorksForYouNotificationItem *> *notificationItems;
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@property (readwrite, nonatomic, strong) NSArray *downloadedArtworkIDs;

- (void)stubNotificationItemWithNumberOfArtworks:(NSUInteger)artworkCount;

@end
