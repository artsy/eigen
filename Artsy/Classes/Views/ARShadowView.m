#import "ARShadowView.h"

@interface ARShadowView()
@end

@implementation ARShadowView

- (void)createShadow
{
    CAGradientLayer *shadow = [CAGradientLayer layer];
    CGRect shadowFrame = self.bounds;
    shadow.frame = shadowFrame;

    shadow.colors = @[
        (id)[UIColor colorWithWhite:0 alpha:0].CGColor,
        (id)[UIColor colorWithWhite:0 alpha:0.9].CGColor,
        (id)[UIColor colorWithWhite:0 alpha:0.9].CGColor
    ];

    shadow.locations = @[ @0, @0.85, @1 ];
    shadow.startPoint = CGPointMake(0, 1);
    shadow.endPoint = CGPointMake(0, 0);

    [self.layer insertSublayer:shadow atIndex:0];
}

@end
