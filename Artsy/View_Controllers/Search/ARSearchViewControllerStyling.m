#import "ARSearchViewControllerStyling.h"
#import "UIDevice-Hardware.h"

@import FLKAutoLayout;
@import Artsy_UIFonts;
@import Artsy_UIColors;


@implementation ARSearchViewControllerStyling

- (NSString *)topLayoutConstraintForStyleMode:(ARSearchViewControllerStylingMode)styleMode
{
    switch (styleMode) {
        case ARSearchViewControllerStylingModeMainScreen:
            return @"47";
        case ARSearchViewControllerStylingModeFair:
            return @"24";
    }
}

- (NSString *)searchIconLeadingConstraintForStyleMode:(ARSearchViewControllerStylingMode)styleMode
{
    switch (styleMode) {
        case ARSearchViewControllerStylingModeMainScreen:
            return @"26";
        case ARSearchViewControllerStylingModeFair:
            return @"10";
    }
}

- (UIColor *)searchIconTintColorForStyleMode:(ARSearchViewControllerStylingMode)styleMode
{
    switch (styleMode) {
        case ARSearchViewControllerStylingModeMainScreen:
            return [UIColor whiteColor];
        case ARSearchViewControllerStylingModeFair:
            return [UIColor artsyGraySemibold];
    }
}

- (NSAttributedString *)closeButtonAttribtedTextForStyleMode:(ARSearchViewControllerStylingMode)styleMode
{
    UIColor *textColor;

    switch (styleMode) {
        case ARSearchViewControllerStylingModeMainScreen:
            textColor = [UIColor whiteColor];
            break;
        case ARSearchViewControllerStylingModeFair:
            textColor = [UIColor artsyGraySemibold];
            break;
    }

    return [[NSAttributedString alloc] initWithString:@"CLOSE" attributes:@{
        NSKernAttributeName : @1,
        NSFontAttributeName : [UIFont sansSerifFontWithSize:[UIDevice isPad] ? 13 : 10],
        NSForegroundColorAttributeName : textColor,
    }];
}

- (void)constrainTableView:(UITableView *)tableView toContentView:(UIView *)contentView forStyleMode:(ARSearchViewControllerStylingMode)styleMode
{
    switch (styleMode) {
        case ARSearchViewControllerStylingModeMainScreen:
            [tableView alignTop:@"10" leading:@"10" bottom:@"0" trailing:@"10" toView:contentView];
            break;
        case ARSearchViewControllerStylingModeFair:
            [tableView alignToView:contentView];
            break;
    }
}

@end
