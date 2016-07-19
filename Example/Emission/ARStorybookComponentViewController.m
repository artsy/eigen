#import "ARStorybookComponentViewController.h"

@implementation ARStorybookComponentViewController

- (instancetype)init;
{
    return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(AREmission *)emission;
{
    if ((self = [super initWithEmission:emission moduleName:@"Home" initialProperties:nil])) {
    }
    return self;
}


@end
