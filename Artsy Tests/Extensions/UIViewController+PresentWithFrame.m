#import "UIViewController+PresentWithFrame.h"

@interface UIViewController (PresentWithFrameFakery)

@property (nonatomic, assign, readwrite) BOOL shouldAnimate;

@end

@implementation UIViewController (PresentWithFrame)

- (void)ar_presentWithFrame:(CGRect)frame
{
    SEL animates = NSSelectorFromString(@"setShouldAnimate:");
    if ([self respondsToSelector:animates]) {
        self.shouldAnimate = NO;
    }
    
    [self beginAppearanceTransition:YES animated:NO];
    self.view.frame = frame;
    [self endAppearanceTransition];
}

@end
