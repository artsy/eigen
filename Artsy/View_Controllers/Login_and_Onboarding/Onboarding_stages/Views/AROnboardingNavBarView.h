#import <UIKit/UIKit.h>

@class ARSentenceCaseButton;


@interface AROnboardingNavBarView : UIView

@property (nonatomic, readonly) UIButton *back;
@property (nonatomic, readonly) ARSentenceCaseButton *forward;
@property (nonatomic, readonly) UILabel *title;

@end
