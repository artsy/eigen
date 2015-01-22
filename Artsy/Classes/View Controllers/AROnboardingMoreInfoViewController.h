@class AROnboardingViewController;

typedef NS_ENUM(NSInteger, AROnboardingMoreInfoViewControllerLoginType) {
    AROnboardingMoreInfoViewControllerLoginTypeFacebook = 0,
    AROnboardingMoreInfoViewControllerLoginTypeTwitter
};

@interface AROnboardingMoreInfoViewController : UIViewController

- (instancetype)initForFacebookWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name;
- (instancetype)initForTwitterWithToken:(NSString *)token andSecret:(NSString *)secret;

@property (nonatomic, weak) AROnboardingViewController *delegate;

@end
