#import <Foundation/Foundation.h>

@class ARWorksForYouNotificationItem;

@protocol ARWorksForYouNetworkModelable <NSObject>

- (BOOL)allDownloaded;

/// Returns an array of ARWorksForYouNotificationItems sorted by most recent publishing date
- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure;

/// Marks all current user's notifications read
- (void)markNotificationsRead;

@property (nonatomic, readonly) NSInteger currentPage;

@end


@interface ARWorksForYouNetworkModel : NSObject <ARWorksForYouNetworkModelable>

@end
