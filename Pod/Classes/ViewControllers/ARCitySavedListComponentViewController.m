#import "ARCitySavedListComponentViewController.h"

@implementation ARCitySavedListComponentViewController

- (instancetype)initWithCitySlug:(NSString *)citySlug
{
    return [super initWithEmission:nil moduleName:@"CitySavedList" initialProperties:@{ @"citySlug": citySlug }];
}

@end