#import <UIKit/UIKit.h>
#import "ARButtonSubclasses.h"


@interface AROnboardingNavigationItemsView : UIView

@property (nonatomic, strong, readonly) ARWhiteFlatButton *back;
@property (nonatomic, strong, readonly) ARWhiteFlatButton *next;

- (void)showWarning:(NSString *)text;
- (void)hideWarning;
- (void)disableNextStep;
- (void)enableNextStep;
- (void)defaultNextStep;
- (void)addBackButton;
- (void)hideBackButton;

@end
