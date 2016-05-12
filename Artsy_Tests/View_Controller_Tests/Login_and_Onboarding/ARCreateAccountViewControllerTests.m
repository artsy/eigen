#import "ARCreateAccountViewController.h"
#import "ARTopMenuViewController.h"
#import "ARTopMenuViewController+Testing.h"
#import "ARCustomEigenLabels.h"
#import "UIViewController+SimpleChildren.h"
#import "ARTextFieldWithPlaceholder.h"
#import "ARCustomEigenLabels.h"


@interface ARCreateAccountViewController (Tests) <UITextFieldDelegate>
- (void)removeWarning:(BOOL)animates;
- (void)showWarning:(NSString *)msg animated:(BOOL)animates;
@property (nonatomic, strong) ARTopMenuViewController *topMenuViewController;
@end

BOOL checkViewControllerHasWarningWithMessage(UIViewController *vc, NSString *msg);

SpecBegin(ARCreateAccountViewController);

__block ARCreateAccountViewController *vc;
__block ARTopMenuViewController *topMenuViewController;

describe(@"warning view", ^{
    
    before(^{
        vc = [[ARCreateAccountViewController alloc] init];
        [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];

        topMenuViewController = [[ARTopMenuViewController alloc] initWithStubbedNetworking];
        [topMenuViewController ar_addModernChildViewController:vc];

        id ocPartialTop = [OCMockObject partialMockForObject:topMenuViewController];
        vc.topMenuViewController = ocPartialTop;
        [[[ocPartialTop stub] andReturn:vc] visibleViewController];
    });
    
    it(@"displays a message", ^{
        [vc showWarning:@"The owls are not what they seem" animated:NO];
        
        expect(vc).to.haveValidSnapshot();
    });

  //    it(@"displays a warning if password too short", ^{
  //        vc.email.text = @"jory@email.com";
  //        vc.password.text = @"1234";
  //
  //        [vc textFieldShouldReturn:vc.password];
  //
  //        BOOL warningIsCorrect = checkViewControllerHasWarningWithMessage(vc, @"Password must be at least 6 characters");
  //        expect(warningIsCorrect).to.beTruthy();
  //    });
  //
  //    it(@"displays a warning if email is missing @", ^{
  //        vc.email.text = @"email.com";
  //        vc.password.text = @"12341234";
  //
  //        [vc textFieldShouldReturn:vc.password];
  //
  //        BOOL warningIsCorrect = checkViewControllerHasWarningWithMessage(vc, @"Email address appears to be invalid");
  //        expect(warningIsCorrect).to.beTruthy();
  //    });
  //
  //    it(@"displays only one warning at a time @", ^{
  //        vc.email.text = @"email.com";
  //        vc.password.text = @"12341234";
  //
  //        [vc textFieldShouldReturn:vc.password];
  //
  //        vc.email.text = @"jory@email.com";
  //        vc.password.text = @"1234";
  //
  //        [vc textFieldShouldReturn:vc.password];
  //
  //        NSInteger viewCount = 0;
  //        for (UIView *child in vc.view.subviews) {
  //            if ([child isKindOfClass:ARWarningView.class]) {
  //                viewCount++;
  //            }
  //        }
  //        expect(viewCount).to.equal(1);
  //    });

});

SpecEnd;

BOOL checkViewControllerHasWarningWithMessage(UIViewController *vc, NSString *msg)
{
    for (UIView *child in vc.view.subviews) {
        if ([child isKindOfClass:ARWarningView.class]) {
            return [msg isEqualToString:[(id)child text]];
        }
    }
    return NO;
}
