#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>
@property (strong, nonatomic) UIWindow *window;
@property (nonatomic, strong) NSString *emissionLoadedFromString;

// TODO: abstract into a switchboard?
- (UIViewController *)viewControllerForRoute:(NSString *)route;

@end

