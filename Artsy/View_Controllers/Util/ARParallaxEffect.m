#import "ARParallaxEffect.h"


@implementation ARParallaxEffect

- (instancetype)initWithOffset:(NSInteger)offset
{
    return [self initWithOffsets:CGPointMake(offset, offset)];
}

- (instancetype)initWithOffsets:(CGPoint)offsets
{
    self = [super init];
    if (self) {
        UIInterpolatingMotionEffect *mx = [[UIInterpolatingMotionEffect alloc] initWithKeyPath:@"center.x" type:UIInterpolatingMotionEffectTypeTiltAlongHorizontalAxis];
        mx.minimumRelativeValue = @(offsets.x);
        mx.maximumRelativeValue = @(-offsets.x);

        UIInterpolatingMotionEffect *my = [[UIInterpolatingMotionEffect alloc] initWithKeyPath:@"center.y" type:UIInterpolatingMotionEffectTypeTiltAlongVerticalAxis];
        my.minimumRelativeValue = @(offsets.y);
        my.maximumRelativeValue = @(-offsets.y);

        self.motionEffects = @[ mx, my ];
    }
    return self;
}
@end
