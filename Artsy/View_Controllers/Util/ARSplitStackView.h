#import <ORStackView/ORStackView.h>


@interface ARSplitStackView : UIView

- (instancetype)initWithLeftPredicate:(NSString *)left rightPredicate:(NSString *)right;

@property (nonatomic, weak, readonly) ORStackView *leftStack;
@property (nonatomic, weak, readonly) ORStackView *rightStack;

@end
