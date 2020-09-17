#import "ARFair2ComponentViewController.h"

@implementation ARFair2ComponentViewController

- (instancetype)init
{
  return [self initWithEmission:nil];
}


- (instancetype)initWithFairID:(nullable NSString *)fairID
{
    return [self initWithFairID:fairID emission:nil];
}

- (instancetype)initWithFairID:(nullable NSString *)fairID
                            emission:(nullable AREmission*)emission
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"Fair2"
                      initialProperties:@{ @"fairID": fairID }])) {
        _fairID = fairID;

    }
    return self;
}


- (instancetype)initWithEmission:(AREmission *)emission
{
    return [super initWithEmission:emission
                        moduleName:@"Fair2"
                 initialProperties:@{}];
}

@end
