#import "ARCityFairListComponentViewController.h"

@implementation ARCityFairListComponentViewController

- (instancetype)initWithCitySlug:(NSString *)citySlug
{
    return [super initWithEmission:nil moduleName:@"CitySectionList" initialProperties:@{@"citySlug":citySlug}];
}

@end