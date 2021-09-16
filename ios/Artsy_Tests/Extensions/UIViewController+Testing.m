#import "UIViewController+Testing.h"

@implementation UIViewController (Testing)

- (void)ar_presentWithFrame:(CGRect)frame
{
    [self beginAppearanceTransition:YES animated:NO];
    self.view.frame = frame;
    [self endAppearanceTransition];
}

- (UIView *)findSubviewWithClass:(Class)subviewClass
{
    if (!self.view) {
        [NSException raise:NSInternalInconsistencyException format:@"View Controller has no view"];
    }

    NSArray *subviews = [self findAllSubviewsOfView:self.view];
    NSArray *matchingViews = [subviews select:^BOOL(UIView *view) {
        return [view isMemberOfClass:subviewClass];
    }];

    if (matchingViews.count == 1) {
        return matchingViews[0];
    } else if (matchingViews == 0) {
        [NSException raise:NSInternalInconsistencyException format:@"Found no view matching class %@", NSStringFromClass(subviewClass)];
    } else if (matchingViews.count > 1) {
        [NSException raise:NSInternalInconsistencyException format:@"Found multiple views matching class %@", NSStringFromClass(subviewClass)];
    }
    return nil;
}

- (NSArray *)findAllSubviewsOfView:(UIView *)view
{
    __block NSArray *allSubviews = @[ view ];

    [view.subviews enumerateObjectsUsingBlock:^(UIView *view, NSUInteger idx, BOOL *stop) {
        allSubviews = [allSubviews arrayByAddingObjectsFromArray:[self findAllSubviewsOfView:view]];
    }];

    return allSubviews;
}

@end
