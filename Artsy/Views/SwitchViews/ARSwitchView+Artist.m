#import "ARSwitchView+Artist.h"

#import "ARFonts.h"

NSInteger ARSwitchViewArtistButtonIndex = 0;
NSInteger ARSwitchViewForSaleButtonIndex = 1;


@interface ARSwitchView ()
@property (nonatomic, strong, readwrite) NSArray *buttons;
@property (nonatomic, strong, readonly) UIView *selectionIndicator;
@end


@implementation ARSwitchView (Artist)

- (void)disableForSale
{
    UIButton *forSaleButton = self.buttons[ARSwitchViewForSaleButtonIndex];
    forSaleButton.enabled = NO;
    [forSaleButton setTitleColor:[UIColor artsyGrayBold] forState:UIControlStateDisabled];
}

+ (NSArray *)artistButtonTitlesArray
{
    return @[ @"ARTWORKS", @"FOR SALE" ];
}

@end
