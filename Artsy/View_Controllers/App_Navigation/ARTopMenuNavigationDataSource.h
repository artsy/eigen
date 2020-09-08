#import "ARTabType.h"

@class ARNavigationController;

@protocol ARTopMenuRootViewController <NSObject>
@optional
- (void)remoteNotificationsReceived:(NSUInteger)notificationCount;
@end

@interface ARTopMenuNavigationDataSource : NSObject

- (ARNavigationController *)navigationControllerForTabType:(NSString *)tabType;
- (NSString *)switchBoardRouteForTabType:(NSString *)tabType;
- (NSArray<NSNumber *> *)registeredTabTypes;

@end
