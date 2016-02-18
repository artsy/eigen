#import <Foundation/Foundation.h>

@class ARWorksForYouNotificationItem;


@interface ARWorksForYouNetworkModel : NSObject

@property (readonly, nonatomic, assign) BOOL allDownloaded;

/// Returns an array of ARWorksForYouNotificationItems sorted by most recent publishing date
- (void)getWorksForYou:(void (^)(NSArray<ARWorksForYouNotificationItem *> *))success failure:(void (^)(NSError *error))failure;

@end
