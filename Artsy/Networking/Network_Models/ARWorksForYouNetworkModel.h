#import <Foundation/Foundation.h>

@class ARWorksForYouNotificationItem;

@protocol ARWorksForYouNetworkModelable <NSObject>

/// Returns YES if all pages have been successfully downloaded
- (BOOL)allDownloaded;

/// Returns YES if network failure occurs
- (BOOL)networkingDidFail;

/// Returns an array of ARWorksForYouNotificationItems sorted by most recent publishing date
- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure;

/// Marks all current user's notifications read
- (void)markNotificationsRead;

/// Returns NO if no notifications were received; useful for empty state
- (BOOL)didReceiveNotifications;

@property (nonatomic, readonly) NSInteger currentPage;

@end


@interface ARWorksForYouNetworkModel : NSObject <ARWorksForYouNetworkModelable>

@end
