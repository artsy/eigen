#import "ARBrowseFeaturedLinkInsetCell.h"

@interface ARBrowseFeaturedLinkInsetCell ()
@property (nonatomic, strong) UIImageView *overlayImageView;
@end

@implementation ARBrowseFeaturedLinkInsetCell

- (void)updateWithTitle:(NSString *)title imageURL:(NSURL *)imageURL
{
    [super updateWithTitle:title imageURL:imageURL];

    self.titleLabel.textAlignment = NSTextAlignmentCenter;
    self.titleLabel.font = [self.titleLabel.font fontWithSize:12];

    UIColor *shadowColor = [UIColor artsyHeavyGrey];
    self.titleLabel.clipsToBounds = NO;
    self.titleLabel.layer.shadowOpacity = 0.8;
    self.titleLabel.layer.shadowRadius = 2.0;
    self.titleLabel.layer.shadowOffset = CGSizeZero;
    self.titleLabel.layer.shadowColor = shadowColor.CGColor;
    self.titleLabel.layer.shouldRasterize = YES;
}

- (void)setImageWithURL:(NSURL *)imageURL
{
    @weakify(self);

    [self.imageView ar_setImageWithURL:imageURL
        completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
            @strongify(self);

            if (!image || error || self.overlayImageView) {
                return;
            }

            self.overlayImageView = [[UIImageView alloc] init];
            [self.contentView insertSubview:self.overlayImageView belowSubview:self.titleLabel];
            self.overlayImageView.image =  [UIImage imageNamed:@"Image_Shadow_Overlay.png"];
            self.overlayImageView.frame = self.contentView.frame;
        }
    ];
}

@end
