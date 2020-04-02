#import "ARAuctionsComponentViewController.h"

@implementation ARAuctionsComponentViewController

- (instancetype)init;
{
  return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(AREmission *)emission;
{
    return [super initWithEmission:emission
                        moduleName:@"Auctions"
                 initialProperties:@{}];
}

@end
