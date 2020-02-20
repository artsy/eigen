#import "ARCityBMWListComponentViewController.h"

@implementation ARCityBMWListComponentViewController

- (instancetype)initWithCitySlug:(NSString *)citySlug
{
    return [super initWithEmission:nil moduleName:@"CityBMWList" initialProperties:@{ @"citySlug": citySlug }];
}

@end
