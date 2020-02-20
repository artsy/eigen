#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>
@property (strong, nonatomic) UIWindow *window;
@property (nonatomic, strong) NSString *emissionLoadedFromString;

// TODO: abstract into a switchboard?
- (UIViewController *)viewControllerForRoute:(NSString *)route;

// Reloads Emission, and re-creates native modules etc
- (void)reloadEmission;
@end

