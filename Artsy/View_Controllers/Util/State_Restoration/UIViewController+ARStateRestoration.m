#import "UIViewController+ARStateRestoration.h"


@implementation UIViewController (ARStateRestoration)

- (void)setupRestorationIdentifierAndClass
{
    self.restorationClass = [self class];

    NSString *classString = NSStringFromClass([self class]);
    NSString *restorationIdentifier = [NSString stringWithFormat:@"%@RID", classString];
    self.restorationIdentifier = restorationIdentifier;
}

@end
