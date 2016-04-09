#import <UIKit/UIKit.h>
#import "ARButtonSubclasses.h"

@interface AROnboardingNavigationItemsView : UIView

@property (nonatomic) ARWhiteFlatButton *back;
@property (nonatomic) ARWhiteFlatButton *next;

- (void)showWarning:(NSString *)text;
- (void)hideWarning;
- (void)disableNextStep;
- (void)enableNextStep;


@end
