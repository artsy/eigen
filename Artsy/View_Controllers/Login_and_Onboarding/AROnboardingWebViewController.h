#import <UIKit/UIKit.h>


// TODO: This isn't used anymore, as we open Privacy Policy and Terms in Safari rather than the app.
// We can get rid of the class, unless we want to bring those two views back in the app.
// See: https://artsyproduct.atlassian.net/browse/ME-3
@interface AROnboardingWebViewController : UIViewController

- (instancetype)initWithMobileArtsyPath:(NSString *)path;

@end
