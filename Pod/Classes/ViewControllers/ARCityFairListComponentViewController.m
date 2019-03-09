#import "ARCityFairListComponentViewController.h"

@implementation ARCityFairListComponentViewController

- (instancetype)initWithCitySlug:(NSString *)citySlug
{
    return [super initWithEmission:nil moduleName:@"CityFairList" initialProperties:@{@"citySlug": citySlug}];
}

@end
