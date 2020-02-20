#import "ARSearchComponentViewController.h"

@interface ARSearchComponentViewController ()
@end

@implementation ARSearchComponentViewController

- (instancetype)init;
{
    return [super initWithEmission:nil
                        moduleName:@"Search"
                 initialProperties:@{}];
}

- (BOOL)shouldInjectSafeAreaInsets
{
    return YES;
}

@end
