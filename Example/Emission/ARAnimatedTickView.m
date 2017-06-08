#import "ARAnimatedTickView.h"
#import <Artsy+UIColors/UIColor+ArtsyColors.h>

#define TICK_DIMENSION 32

@interface ARTickViewFrontLayer : CAShapeLayer
@end


@interface ARTickViewBackLayer : CALayer
@property (nonatomic, assign) CGFloat completion;
@end


@interface ARAnimatedTickView () {
    ARTickViewBackLayer *_backLayer;
}
@end


@implementation ARAnimatedTickView

- (id)initWithFrame:(CGRect)frame
{
    [NSException raise:NSInvalidArgumentException format:@"NSObject %@[%@]: selector not recognized - use initWithSelection: ", NSStringFromClass([self class]), NSStringFromSelector(_cmd)];
    return nil;
}

- (id)initWithSelection:(BOOL)selected
{
    self = [super initWithFrame:CGRectMake(0, 0, TICK_DIMENSION, TICK_DIMENSION)];
    if (self) {
        self.backgroundColor = [[UIColor artsyGrayRegular] colorWithAlphaComponent:0.2];

        _backLayer = [ARTickViewBackLayer layer];
        _backLayer.completion = 1;
        _backLayer.bounds = self.bounds;
        _backLayer.position = CGPointMake(TICK_DIMENSION / 2, TICK_DIMENSION / 2);

        [self.layer addSublayer:_backLayer];
        [self.layer addSublayer:[ARTickViewFrontLayer layer]];

        [self setSelected:selected animated:NO];
    }
    return self;
}

- (BOOL)selected
{
    return (_backLayer.completion) ? YES : NO;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    if (!animated) {
        _backLayer.completion = selected ? 1 : 0;
        [_backLayer setNeedsDisplay];

    } else {
        CABasicAnimation *positionAnimation = [CABasicAnimation animationWithKeyPath:@"completion"];
        positionAnimation.duration = 0.15;
        positionAnimation.fromValue = @(!selected);
        positionAnimation.toValue = @(selected);
        positionAnimation.fillMode = kCAFillModeForwards;
        positionAnimation.removedOnCompletion = YES;
        [_backLayer addAnimation:positionAnimation forKey:@"TickAnimation"];

        _backLayer.completion = selected ? 1 : 0;
    }
}

@end


@implementation ARTickViewFrontLayer

// This is essentially the facia behind which the tick selection is drawn

+ (instancetype)layer
{
    ARTickViewFrontLayer *layer = [[ARTickViewFrontLayer alloc] init];
    CGMutablePathRef tickPath = CGPathCreateMutable();

    // Tick with gets diffed on outline // x     y
    CGPathMoveToPoint(tickPath, NULL, 24.28, 6.62);
    CGPathAddLineToPoint(tickPath, NULL, 12.14, 22.07);
    CGPathAddLineToPoint(tickPath, NULL, 6.62, 16.55);
    CGPathAddLineToPoint(tickPath, NULL, 4.41, 18.76);
    CGPathAddLineToPoint(tickPath, NULL, 12.14, 26.48);
    CGPathAddLineToPoint(tickPath, NULL, 26.48, 8.83);
    CGPathAddLineToPoint(tickPath, NULL, 24.28, 6.62);
    CGPathCloseSubpath(tickPath);

    // Outline
    CGPathMoveToPoint(tickPath, NULL, 32, 32);
    CGPathAddLineToPoint(tickPath, NULL, 0, 32);
    CGPathAddLineToPoint(tickPath, NULL, 0, 0);
    CGPathAddLineToPoint(tickPath, NULL, 32, 0);
    CGPathAddLineToPoint(tickPath, NULL, 32, 32);
    CGPathCloseSubpath(tickPath);

    layer.path = tickPath;
    CGPathRelease(tickPath);

    layer.fillColor = [UIColor whiteColor].CGColor;
    return layer;
}

@end


@implementation ARTickViewBackLayer

// Tell the class if completion changes that needs a redraw
// meaning you can animate the key completion using a CABasicAnimation

+ (BOOL)needsDisplayForKey:(NSString *)key
{
    if ([key isEqualToString:@"completion"]) {
        return YES;
    }

    return [super needsDisplayForKey:key];
}

- (void)drawInContext:(CGContextRef)context
{
    [self drawLowerHalfInContext:context];
    [self drawUpperHalfInContext:context];
}

// Top left is 0,0

- (void)drawLowerHalfInContext:(CGContextRef)ctx
{
    CGPoint TL = CGPointMake(6.0, 15.2);
    CGPoint BL = CGPointMake(4.1, 19.4);

    // this is double the distance it needs, so that it finished in half-time

    CGPoint TR = CGPointMake(21, 32);
    CGPoint BR = CGPointMake(21.1, 34.6);
    [self drawStretchyRectWithPointsTL:TL TR:TR BL:BL BR:BR inContext:ctx];
}

- (void)drawUpperHalfInContext:(CGContextRef)ctx
{
    CGPoint TL = CGPointMake(9.4, 24.5);
    CGPoint BL = CGPointMake(12.1, 27.1);

    CGPoint TR = CGPointMake(24, 6.8);
    CGPoint BR = CGPointMake(27.1, 8.9);
    [self drawStretchyRectWithPointsTL:TL TR:TR BL:BL BR:BR inContext:ctx];
}

- (void)drawStretchyRectWithPointsTL:(CGPoint)TL TR:(CGPoint)TR BL:(CGPoint)BL BR:(CGPoint)BR inContext:(CGContextRef)ctx
{
    CGContextMoveToPoint(ctx, TL.x, TL.y);

    // the top right
    CGContextAddLineToPoint(ctx, ((TR.x - TL.x) * self.completion) + TL.x, ((TR.y - TL.y) * self.completion) + TL.y);
    // bottom right
    CGContextAddLineToPoint(ctx, ((BR.x - BL.x) * self.completion) + BL.x, ((BR.y - BL.y) * self.completion) + BL.y);

    // bottom left
    CGContextAddLineToPoint(ctx, BL.x, BL.y);
    CGContextClosePath(ctx);

    // Color it
    CGContextSetFillColorWithColor(ctx, [UIColor artsyPurpleRegular].CGColor);
    CGContextSetLineWidth(ctx, 0);

    CGContextDrawPath(ctx, kCGPathFill);
}

@end
