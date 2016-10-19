#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ARSearchViewControllerStylingMode) {
    ARSearchViewControllerStylingModeMainScreen,
    ARSearchViewControllerStylingModeFair
};


@interface ARSearchViewControllerStyling : NSObject

- (NSString *)topLayoutConstraintForStyleMode:(ARSearchViewControllerStylingMode)styleMode;
- (NSString *)searchIconLeadingConstraintForStyleMode:(ARSearchViewControllerStylingMode)styleMode sizeClass:(UIUserInterfaceSizeClass)sizeClass;
- (UIColor *)searchIconTintColorForStyleMode:(ARSearchViewControllerStylingMode)styleMode;
- (NSAttributedString *)closeButtonAttribtedTextForStyleMode:(ARSearchViewControllerStylingMode)styleMode;
- (void)constrainTableView:(UITableView *)tableView toContentView:(UIView *)contentView forStyleMode:(ARSearchViewControllerStylingMode)styleMode;

@end
