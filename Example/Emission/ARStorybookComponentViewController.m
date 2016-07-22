#import "ARStorybookComponentViewController.h"

@implementation ARStorybookComponentViewController

- (instancetype)init;
{
    return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(AREmission *)emission;
{
    if ((self = [super initWithEmission:emission moduleName:@"Storybook" initialProperties:nil])) {
    }
    return self;
}


@end
