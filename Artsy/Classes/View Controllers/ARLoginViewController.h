#import "AROnboardingViewController.h"

typedef NS_ENUM(NSInteger, ARLoginViewControllerLoginType) {
    ARLoginViewControllerLoginTypeTwitter = 0,
    ARLoginViewControllerLoginTypeFacebook,
    ARLoginViewControllerLoginTypeEmail
};

@interface ARLoginViewController : UIViewController

- (instancetype)initWithEmail:(NSString *)email;

@property (nonatomic, weak) AROnboardingViewController *delegate;
@property (nonatomic, assign) BOOL hideDefaultValues;

@end
