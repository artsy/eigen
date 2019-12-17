#import <UIKit/UIKit.h>

@interface ARSearchViewControllerStyling : NSObject

- (NSString *)topLayoutConstraint;
- (NSString *)searchIconLeadingConstraintForSizeClass:(UIUserInterfaceSizeClass)sizeClass;
- (UIColor *)searchIconTintColor;
- (NSAttributedString *)closeButtonAttributedText;
- (void)constrainTableView:(UITableView *)tableView toContentView:(UIView *)contentView;

@end
