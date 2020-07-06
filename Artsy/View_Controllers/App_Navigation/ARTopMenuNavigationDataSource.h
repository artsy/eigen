#import "ARTabType.h"
#import "ARNavigationTabButtonWithBadge.h"

@class ARHomeComponentViewController, ARNavigationController;

@protocol ARTopMenuRootViewController <NSObject>
@optional
- (void)remoteNotificationsReceived:(NSUInteger)notificationCount;
@end

@interface ARTopMenuNavigationDataSource : NSObject

- (ARNavigationController *)navigationControllerForTabType:(ARTopTabControllerTabType)tabType;
- (NSString *)switchBoardRouteForTabType:(ARTopTabControllerTabType)tabType;
- (NSString *)tabNameForTabType:(ARTopTabControllerTabType)tabType;
- (NSString *)analyticsDescriptionForTabType:(ARTopTabControllerTabType)tabType;
- (NSArray<NSNumber *> *)registeredTabTypes;

@end
