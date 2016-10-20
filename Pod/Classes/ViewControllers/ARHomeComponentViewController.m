#import "ARHomeComponentViewController.h"

@implementation ARHomeComponentViewController

- (instancetype)init;
{
    return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(AREmission *)emission;
{
    return [super initWithEmission:emission moduleName:@"Home" initialProperties:nil];
}

@end
