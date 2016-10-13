#import "ARGroupedTableViewCell.h"
#import <Artsy+UIColors/UIColor+ArtsyColors.h>

@implementation ARGroupedTableViewCell

- (void)drawRect:(CGRect)rect
{
    CGContextRef context = UIGraphicsGetCurrentContext();
    [[UIColor whiteColor] setFill];
    CGContextFillRect(context, rect);

    CGContextSetLineWidth(context, [[UIScreen mainScreen] scale] * 4);
    CGContextSetStrokeColorWithColor(context, [UIColor artsyGrayMedium].CGColor);

    // left
    CGContextMoveToPoint(context, 0, 0);
    CGContextAddLineToPoint(context, 0, CGRectGetHeight(rect));

    // bottom
    CGContextAddLineToPoint(context, CGRectGetWidth(rect), CGRectGetHeight(rect));

    // right
    CGContextAddLineToPoint(context, CGRectGetWidth(rect), 0);

    // top
    if (_isTopCell) {
        CGContextAddLineToPoint(context, 0, 0);
    }

    CGContextStrokePath(context);
}

- (void)prepareForReuse
{
    _isTopCell = NO;
    [super prepareForReuse];
}

@end
