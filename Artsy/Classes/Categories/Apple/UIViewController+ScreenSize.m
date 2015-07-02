#import "UIViewController+ScreenSize.h"


@implementation UIViewController (ScreenSize)

- (BOOL)smallScreen
{
    return CGRectGetHeight(self.view.bounds) <= 480;
}

@end
