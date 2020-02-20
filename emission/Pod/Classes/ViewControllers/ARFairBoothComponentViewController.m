#import "ARFairBoothComponentViewController.h"
#import "AREmission.h"

@interface ARFairBoothComponentViewController ()

@end

@implementation ARFairBoothComponentViewController


- (instancetype)initWithFairBoothID:(NSString *)fairBoothID
{
    return [self initWithFairBoothID:fairBoothID emission:[AREmission sharedInstance]];
}


- (instancetype)initWithFairBoothID:(NSString *)fairBoothID
                           emission:(nullable AREmission *)emission
{
        return [super initWithEmission:emission moduleName:@"FairBooth" initialProperties:@{ @"fairBoothID": fairBoothID }];
}


@end
