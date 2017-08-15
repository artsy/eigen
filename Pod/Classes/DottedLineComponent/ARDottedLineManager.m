#import "ARDottedLineManager.h"



@interface ARDottedLine : UIView
@end


@implementation ARDottedLine

- (void)drawRect:(CGRect)rect
{
    [super drawRect:rect];
    
    [[UIColor whiteColor] setFill];
    [[UIColor grayColor] setStroke];
    
    CGContextFillRect(UIGraphicsGetCurrentContext(), rect);
    //
    
    const CGFloat dotDiameter = rect.size.height / 2;
    const CGFloat gapSize = dotDiameter * 5;
    CGFloat pattern[4];
    pattern[0] = 0.0;
    pattern[1] = gapSize;
//    const CGFloat pattern = 0.5;
    
    UIBezierPath *path = [UIBezierPath bezierPath];
    path.lineWidth = dotDiameter;
    path.lineCapStyle = kCGLineCapRound;
    [path moveToPoint:CGPointMake(0, dotDiameter / 2)];
    [path addLineToPoint:CGPointMake(rect.size.width, 2)];
    [path setLineDash:pattern count:2 phase:2];

    [path stroke];
}

//- (void) layoutSubviews {
//    [super layoutSubviews];
//    for(UIView* view in self.subviews) {
//        [view setFrame:self.bounds];
//    }
//}


@end


@implementation ARDottedLineManager
RCT_EXPORT_MODULE();

- (UIView *)view
{
    
    ARDottedLine *line = [ARDottedLine new];
//    line.backgroundColor = [UIColor redColor];
    return line;
}

@end
