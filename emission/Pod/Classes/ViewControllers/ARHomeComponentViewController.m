#import "ARHomeComponentViewController.h"

@implementation ARHomeComponentViewController

- (instancetype)init
{
    return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(nullable AREmission*)emission;
{
    return [super initWithEmission:emission
                        moduleName:@"Home"
                 initialProperties:@{}];
}

@end
