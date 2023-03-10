#import "UIView+ARDrawing.h"
#import "UIColor+ArtsyColors.h"

@implementation UIView (ARDrawing)

+ (UIColor *)defaultBorderColor
{
    return [UIColor artsyGrayLight];
}

// Dotted border methods

- (void)drawBottomDottedBorderWithColor:(UIColor *)color
{
    [self drawBottomBorderWithColor:color dotted:YES];
}


// Methods for general border-drawing

- (void)drawTopBorderWithColor:(UIColor *)color dotted:(BOOL)dotted
{
    [self drawBorderWithColor:color yLocation:0 key:@"TopMarginLayer" dotted:dotted];
}

- (void)drawBottomBorderWithColor:(UIColor *)color dotted:(BOOL)dotted
{
    [self drawBorderWithColor:color yLocation:CGRectGetHeight(self.frame) key:@"BottomMarginLayer" dotted:dotted];
}

- (void)drawBorderWithColor:(UIColor *)color yLocation:(CGFloat)yLocation key:(NSString *)key dotted:(BOOL)dotted
{
    CALayer* layer = [self.layer valueForKey:key];
    if (layer) [layer removeFromSuperlayer];

    CALayer *newLayer = [self layerForMarginAtY:yLocation withColor:color dotted:dotted];
    [self.layer addSublayer:newLayer];
    [self.layer setValue:newLayer forKey:key];
}

- (CALayer *)layerForMarginAtY:(CGFloat)y withColor:(UIColor *)color dotted:(BOOL)dotted
{
    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    [shapeLayer setStrokeColor:[color CGColor]];
    [shapeLayer setLineWidth:1];
    [shapeLayer setLineJoin:kCALineJoinRound];

    if (dotted) [shapeLayer setLineDashPattern: @[ @1, @1 ]];
    [shapeLayer setAnchorPoint:CGPointZero];

    CGMutablePathRef path = CGPathCreateMutable();
    CGPathMoveToPoint(path, NULL, 0, y);
    CGPathAddLineToPoint(path, NULL, self.frame.size.width, y);

    [shapeLayer setPath:path];
    CGPathRelease(path);

    return shapeLayer;
}

@end
