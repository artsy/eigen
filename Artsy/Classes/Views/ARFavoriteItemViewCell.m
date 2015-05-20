#import "ARFavoriteItemViewCell.h"
#import "ARFeedImageLoader.h"

static const CGFloat ARFavoriteCellMetadataMargin = 8;
static const CGFloat ARFavoriteCellLabelHeight = 34;

@interface ARFavoriteItemViewCell()
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) NSLayoutConstraint *imageHeightConstraint;
@end

@implementation ARFavoriteItemViewCell

- (void)prepareForReuse
{
    self.titleLabel.text = @"";
    self.imageView.image = [ARFeedImageLoader defaultPlaceholder];
}

+ (CGSize)sizeForCellwithSize:(CGSize)contentArea
{
    CGFloat width;
    CGFloat height;

    int columns = [UIDevice isPad] ? 3 : 2;
    CGFloat margin = [UIDevice isPad] ? (contentArea.width > contentArea.height ? 50 : 32) : 20;
    CGFloat marginsWidth = margin * (columns - 1);
    CGFloat availableWidth = contentArea.width - marginsWidth;
    width = availableWidth / columns;

    CGFloat imageHeight = .7 * width;
    height = imageHeight + ARFavoriteCellMetadataMargin + ARFavoriteCellLabelHeight;

    return CGSizeMake(floor(width), floor(height));
}

- (void)setupWithRepresentedObject:(id)object
{
    if (!self.imageView) {
        UIImageView *imageView = [[UIImageView alloc] init];
        imageView.contentMode = UIViewContentModeScaleAspectFill;
        imageView.clipsToBounds = YES;
        [self.contentView addSubview:imageView];
        [imageView alignTop:@"0" leading:@"0" bottom:nil trailing:@"0" toView:self.contentView];
        [imageView setContentCompressionResistancePriority:UILayoutPriorityDefaultLow forAxis:UILayoutConstraintAxisVertical];
        self.imageView = imageView;
    }

    if ([object respondsToSelector:@selector(largeImageURL)]) {
        NSURL *url = [object largeImageURL];
        [self.imageView ar_setImageWithURL:url];
    } else if ([object respondsToSelector:@selector(squareImageURL)]) {
        NSURL *url = [object squareImageURL];
        [self.imageView ar_setImageWithURL:url];
    }
    
    if (!self.titleLabel) {
        UILabel *label = [[UILabel alloc] init];
        label.font = [UIFont sansSerifFontWithSize:12];
        label.textAlignment = NSTextAlignmentCenter;
        label.numberOfLines = 0;
        label.backgroundColor = [UIColor whiteColor];
        label.opaque = YES;
        [self.contentView addSubview:label];
        [label constrainTopSpaceToView:self.imageView predicate:@(ARFavoriteCellMetadataMargin).stringValue];
        [label alignBottomEdgeWithView:self.contentView predicate:@"0"];
        [label constrainWidthToView:self.contentView predicate:nil];
        [label alignCenterXWithView:self.contentView predicate:nil];
        [label constrainHeight:@(ARFavoriteCellLabelHeight).stringValue];
        self.titleLabel = label;
    }

    if ([object respondsToSelector:@selector(name)]) {
        self.titleLabel.text = [object name].uppercaseString;
    }
    [self layoutIfNeeded];
}

@end
