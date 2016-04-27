#import "UIViewController+TopMenuViewController.h"
#import "ARTopMenuViewController.h"


@implementation UIViewController (TopMenuViewController)

- (ARTopMenuViewController *_Nullable)ar_TopMenuViewController
{
    if ([self.parentViewController isKindOfClass:ARTopMenuViewController.class]) {
        return (id)self.parentViewController;
    }

    if ([self.navigationController.parentViewController isKindOfClass:ARTopMenuViewController.class]) {
        return (id)self.navigationController.parentViewController;
    }

    return [self.parentViewController ar_TopMenuViewController];
}

@end
