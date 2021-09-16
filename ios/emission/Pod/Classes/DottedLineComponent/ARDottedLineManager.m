#import "ARDottedLineManager.h"



@interface ARDottedLine : UIView
@property (nonatomic, strong, readwrite) UIColor *color;
@end


@implementation ARDottedLine

- (void)drawRect:(CGRect)rect
{
    [super drawRect:rect];
    
    [UIColor.whiteColor setFill];
    [self.color setStroke];
    
    CGContextFillRect(UIGraphicsGetCurrentContext(), rect);
    
    const CGFloat dotDiameter = rect.size.height / 2;
    const CGFloat gapSize = dotDiameter * 4;
    CGFloat pattern[2];
    pattern[0] = 0.0;
    pattern[1] = gapSize;

    UIBezierPath *path = [UIBezierPath bezierPath];
    path.lineWidth = dotDiameter;
    path.lineCapStyle = kCGLineCapRound;
    [path moveToPoint:CGPointMake(0, dotDiameter)];
    [path addLineToPoint:CGPointMake(rect.size.width, dotDiameter)];
    [path setLineDash:pattern count:2 phase:2];

    [path stroke];
}

@end


@implementation ARDottedLineManager
RCT_CUSTOM_VIEW_PROPERTY(color, NSNumber, ARDottedLine)
{
    view.color = [RCTConvert UIColor:json];
    [view setNeedsDisplay];
}

RCT_EXPORT_MODULE();

- (UIView *)view
{
    ARDottedLine *line = [ARDottedLine new];
    return line;
}

@end
