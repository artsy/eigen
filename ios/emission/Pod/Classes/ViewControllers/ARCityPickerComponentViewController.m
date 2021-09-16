#import "ARCityPickerComponentViewController.h"

@implementation ARCityPickerComponentViewController

- (instancetype)initWithSelectedCityName:(NSString *)selectedCityName
{
    return [super initWithEmission:nil moduleName:@"CityPicker" initialProperties:@{ @"selectedCity": selectedCityName ?: @"" }];
}

@end
