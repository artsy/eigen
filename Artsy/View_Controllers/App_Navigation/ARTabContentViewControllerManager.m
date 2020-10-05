#import "ARTabContentViewControllerManager.h"

#import "ARTabContentView.h"


@implementation ARTabContentViewControllerManager
RCT_EXPORT_MODULE()

- (UIView *)view
{
    return [[ARTabContentView alloc] initWithFrame:CGRectZero];
}

@end
