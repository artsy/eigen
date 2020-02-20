#import "ARCitySectionListComponentViewController.h"

@implementation ARCitySectionListComponentViewController

- (instancetype)initWithCitySlug:(NSString *)citySlug section:(NSString *)section
{
    return [super initWithEmission:nil moduleName:@"CitySectionList" initialProperties:@{@"citySlug":citySlug, @"section":section}];
}

@end
