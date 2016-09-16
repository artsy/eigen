#import <Extraction/ARSwitchView.h>

extern NSInteger ARSwitchViewArtistButtonIndex;
extern NSInteger ARSwitchViewForSaleButtonIndex;


@interface ARSwitchView (Artist)

- (void)disableForSale;

+ (NSArray *)artistButtonTitlesArray;

@end
