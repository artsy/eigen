#import <Foundation/Foundation.h>

@class ARWorksForYouNotificationItem;

@protocol ARWorksForYouNetworkModelable <NSObject>

- (BOOL)allDownloaded;

/// Returns an array of ARWorksForYouNotificationItems sorted by most recent publishing date
- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure;

/// Marks all current user's notifications read
- (void)markNotificationsRead;

/// If all notifications have been downloaded, returns total number of artworks received from gravity
@property (nonatomic, readonly) NSInteger artworksCount;

@property (nonatomic, readonly) NSInteger currentPage;

@end


@interface ARWorksForYouNetworkModel : NSObject <ARWorksForYouNetworkModelable>

@end
