#import "ARTabType.h"
@protocol ARRootViewController <NSObject>

- (ARTopTabControllerTabType)rootNavTabType;
@optional
- (BOOL)isRootNavViewController;
@end
