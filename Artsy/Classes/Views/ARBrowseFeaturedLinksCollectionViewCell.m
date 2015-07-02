#import "ARBrowseFeaturedLinksCollectionViewCell.h"


@interface ARBrowseFeaturedLinksCollectionViewCell ()
@end


@implementation ARBrowseFeaturedLinksCollectionViewCell

- (void)updateWithTitle:(NSString *)title imageURL:(NSURL *)imageURL;
{
    if (!self.imageView) {
        _imageView = [[UIImageView alloc] init];
        self.imageView.contentMode = UIViewContentModeScaleAspectFill;
        self.imageView.clipsToBounds = YES;

        [self.contentView addSubview:self.imageView];
        [self.imageView alignToView:self.contentView];
    }

    if (!self.titleLabel) {
        _titleLabel = [[UILabel alloc] init];
        self.titleLabel.textColor = [UIColor whiteColor];
        self.titleLabel.font = [UIFont sansSerifFontWithSize:12];

        [self.contentView addSubview:self.titleLabel];
        [self setupTitleLabel];
    }

    [self setImageWithURL:imageURL];
    self.titleLabel.text = title.uppercaseString;

    self.isAccessibilityElement = YES;
    self.accessibilityLabel = title;
    self.accessibilityTraits = UIAccessibilityTraitButton;
}

- (void)setupTitleLabel
{
    [self.titleLabel constrainWidthToView:self.contentView predicate:@"-20"];
    [self.titleLabel alignCenterXWithView:self.contentView predicate:nil];
    [self.titleLabel alignBottomEdgeWithView:self.contentView predicate:@"-12"];
}

+ (NSString *)reuseID
{
    return NSStringFromClass(self.class);
}

- (void)setImageWithURL:(NSURL *)imageURL
{
    [self.imageView ar_setImageWithURL:imageURL];
}

@end
