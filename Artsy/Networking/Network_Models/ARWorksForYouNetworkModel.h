#import <Foundation/Foundation.h>

@class ARWorksForYouNotificationItem;


@interface ARWorksForYouNetworkModel : NSObject

@property (readonly, nonatomic, assign) BOOL allDownloaded;

/// Returns an array of ARWorksForYouNotificationItems sorted by most recent publishing date
- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure;

@end
