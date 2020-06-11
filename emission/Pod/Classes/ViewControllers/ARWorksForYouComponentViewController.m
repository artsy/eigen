#import "ARWorksForYouComponentViewController.h"

@implementation ARWorksForYouComponentViewController

- (instancetype)init
{
  return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(AREmission *)emission
{
    return [super initWithEmission:emission
                        moduleName:@"WorksForYou"
                 initialProperties:@{}];
}

@end
