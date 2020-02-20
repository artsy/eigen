#import "ARFairMoreInfoComponentViewController.h"
#import "AREmission.h"

@implementation ARFairMoreInfoComponentViewController

- (instancetype)initWithFairID:(NSString *)fairID
{
    return [self initWithFairID:fairID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithFairID:(NSString *)fairID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"FairMoreInfo" initialProperties:@{ @"fairID": fairID }];
}

@end
