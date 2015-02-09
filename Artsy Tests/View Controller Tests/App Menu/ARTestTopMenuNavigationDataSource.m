#import "ARTestTopMenuNavigationDataSource.h"

@implementation ARTestTopMenuNavigationDataSource

- (UIViewController *)viewControllerForTabContentView:(ARTabContentView *)tabContentView atIndex:(NSInteger)index
{
    if (index == 0 ) {
        return self.controller1 ?: [[UIViewController alloc] init];
    } else if (index == 1) {
        return self.controller2 ?: [[UIViewController alloc] init];
    } else {
        return nil;
    }
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView canPresentViewControllerAtIndex:(NSInteger)index
{
    return YES;
}

- (NSInteger)numberOfViewControllersForTabContentView:(ARTabContentView *)tabContentView
{
    return 1;
}

@end
