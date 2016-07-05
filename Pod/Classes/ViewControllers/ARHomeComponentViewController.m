#import "ARHomeComponentViewController.h"

@implementation ARHomeComponentViewController

- (instancetype)init
{
    return [self initWithEmission:nil moduleName:nil initialProperties:nil];
}

- (instancetype)initWithEmission:(AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(NSDictionary *)initialProperties
{
    self = [super initWithEmission:emission moduleName:@"Home" initialProperties:nil];
    return self;
}

@end
