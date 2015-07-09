#import "ARTopTapThroughTableView.h"


@implementation ARTopTapThroughTableView

- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event
{
    if (point.y < 0) {
        return NO;
    }
    return [super pointInside:point withEvent:event];
}

@end
