#import "ARFairBMWArtActivationComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@interface ARFairBMWArtActivationComponentViewController ()

@end

@implementation ARFairBMWArtActivationComponentViewController

- (instancetype)initWithFairID:(NSString *)fairID
{
    return [self initWithFairID:fairID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithFairID:(NSString *)fairID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"FairBMWArtActivation" initialProperties:@{ @"fairID": fairID }];
}

@end
