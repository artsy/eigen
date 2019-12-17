#import "ARSearchViewControllerStyling.h"
#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/FLKAutoLayout.h>
#import "ARFonts.h"
#import <Artsy+UIColors/UIColor+ArtsyColors.h>


@implementation ARSearchViewControllerStyling

- (NSString *)topLayoutConstraint
{
    return @"47";
}

- (NSString *)searchIconLeadingConstraintForSizeClass:(UIUserInterfaceSizeClass)sizeClass
{
    return (sizeClass == UIUserInterfaceSizeClassRegular) ? @"51" : @"26";
}

- (UIColor *)searchIconTintColor
{
    return [UIColor whiteColor];
}

- (NSAttributedString *)closeButtonAttributedText
{
    return [[NSAttributedString alloc] initWithString:@"CLOSE" attributes:@{
        NSKernAttributeName : @1,
        NSFontAttributeName : [UIFont sansSerifFontWithSize:[UIDevice isPad] ? 13 : 10],
        NSForegroundColorAttributeName : [UIColor whiteColor],
    }];
}

- (void)constrainTableView:(UITableView *)tableView toContentView:(UIView *)contentView
{
    [tableView alignTop:@"10" leading:@"10" bottom:@"0" trailing:@"10" toView:contentView];
}

@end
