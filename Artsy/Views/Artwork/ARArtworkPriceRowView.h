#import <UIKit/UIKit.h>


@interface ARArtworkPriceRowView : UIView

@property (nonatomic) CGFloat margin;
@property (nonatomic, strong) UILabel *messageLabel;
@property (nonatomic, strong) UILabel *priceLabel;

- (void)setPriceAccessoryImage:(UIImage *)image;

@end
