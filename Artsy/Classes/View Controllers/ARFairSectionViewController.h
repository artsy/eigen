#import <ORStackView/ORStackView.h>

@interface ARFairSectionViewController : UIViewController

- (instancetype)initWithFair:(Fair *)fair;
- (UILabel *)addPageTitleWithString:(NSString *)title;
- (void)addSubview:(UIView *)view withTopMargin:(NSString *)margin;
- (void)addSubview:(UIView *)view withTopMargin:(NSString *)topMargin sideMargin:(NSString *)sideMargin;
- (void)addGenericSeparatorWithSideMargin:(NSString *)sideMargin;
@property (nonatomic, strong, readonly) Fair *fair;

@end

