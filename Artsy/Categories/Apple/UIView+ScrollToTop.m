#import "UIView+ScrollToTop.h"
@implementation UIView (ARScrollToTop)

- (BOOL)ar_scrollToTopAnimated:(BOOL)animated
{
    if ([self isKindOfClass:UIScrollView.class] && [(id)self scrollsToTop] && [(UIScrollView *)self contentOffset].y > 0) {
        UIScrollView *me = (id)self;
        [me setContentOffset:CGPointMake(me.contentOffset.x, -me.contentInset.top) animated:animated];
        return YES;
    }

    for (UIView* childView in self.subviews) {
        if ([childView ar_scrollToTopAnimated:animated]) {
            return YES;
        }
    }

    return NO;
}

@end
