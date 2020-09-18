#import "ARTabType.h"

@class ARNavigationController;

@protocol ARTopMenuRootViewController <NSObject>
@optional
- (void)remoteNotificationsReceived:(NSUInteger)notificationCount;
@end

@interface ARTopMenuNavigationDataSource : NSObject

- (ARNavigationController *)navigationControllerForTabType:(NSString *)tabType;
- (NSArray<NSNumber *> *)registeredTabTypes;

@end
