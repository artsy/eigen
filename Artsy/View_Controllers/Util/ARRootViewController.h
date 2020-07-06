#import "ARTabType.h"
@protocol ARRootViewController <NSObject>

@optional
- (BOOL)isRootNavViewController;
- (ARTopTabControllerTabType)rootNavTabType;
@end
