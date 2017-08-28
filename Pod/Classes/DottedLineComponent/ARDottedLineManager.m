#import "ARDottedLineManager.h"



@interface ARDottedLine : UIView
@property (nonatomic, strong, readwrite) UIColor *color;
@property (nonatomic, strong, readwrite) UIColor *processedBackgroundColor;
@end


@implementation ARDottedLine

- (void)drawRect:(CGRect)rect
{
    [super drawRect:rect];
    
    [self.processedBackgroundColor setFill];
    [self.color setStroke];
    
    CGContextFillRect(UIGraphicsGetCurrentContext(), rect);
    
    const CGFloat dotDiameter = rect.size.height / 2;
    const CGFloat gapSize = dotDiameter * 5;
    CGFloat pattern[4];
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
}
RCT_CUSTOM_VIEW_PROPERTY(processedBackgroundColor, NSNumber, ARDottedLine)
{
    view.processedBackgroundColor = [RCTConvert UIColor:json];
}
RCT_EXPORT_MODULE();

- (UIView *)view
{
    
    ARDottedLine *line = [ARDottedLine new];
    return line;
}

@end
