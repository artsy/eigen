#import <Foundation/Foundation.h>

@class ARWorksForYouNotificationItem;

@protocol ARWorksForYouNetworkModelable <NSObject>

- (BOOL)allDownloaded;

/// Returns an array of ARWorksForYouNotificationItems sorted by most recent publishing date
- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure;

@end


@interface ARWorksForYouNetworkModel : NSObject <ARWorksForYouNetworkModelable>

@end
