#import "ARArtworkWithMetadataThumbnailCell.h"

#import "Artwork.h"
#import "ARArtworkThumbnailMetadataView.h"

#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

static const CGFloat ARArtworkCellMetadataMargin = 8;


@interface ARArtworkWithMetadataThumbnailCell ()
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) ARArtworkThumbnailMetadataView *metadataView;
@end


@implementation ARArtworkWithMetadataThumbnailCell

@dynamic imageSize;

+ (CGFloat)heightForMetadataWithArtwork:(Artwork *)artwork
{
    return [self heightIncludingPriceLabel:[self showPriceLabelWithArtwork:artwork]] + ARArtworkCellMetadataMargin;
}

+ (CGFloat)heightIncludingPriceLabel:(BOOL)includePriceLabel
{
    if (includePriceLabel) {
        return [UIDevice isPad] ? 63 : 51;
    } else {
        return [UIDevice isPad] ? 42 : 34;
    }
}

+ (BOOL)showPriceLabelWithArtwork:(Artwork *)artwork
{
    return artwork.saleMessage.length && !artwork.auction;
}

- (void)prepareForReuse
{
    self.imageView.image = [ARFeedImageLoader defaultPlaceholder];
    [self.metadataView resetLabels];
    [self.metadataView removeConstraints:self.metadataView.constraints];
}

- (void)setupWithRepresentedObject:(Artwork *)artwork
{
    if (!self.imageView) {
        UIImageView *imageView = [[UIImageView alloc] init];
        imageView.contentMode = self.imageViewContentMode ?: UIViewContentModeScaleAspectFill;
        imageView.clipsToBounds = YES;

        [self.contentView addSubview:imageView];

        [imageView alignTopEdgeWithView:self.contentView predicate:@"0"];
        [imageView alignCenterXWithView:self.contentView predicate:@"0"];

        [imageView constrainWidthToView:self.contentView predicate:@"0"];

        self.imageView = imageView;
    }

    BOOL showPrice = [self.class showPriceLabelWithArtwork:artwork];

    if (!self.metadataView) {
        ARArtworkThumbnailMetadataView *metaData = [[ARArtworkThumbnailMetadataView alloc] init];
        [metaData configureWithArtwork:artwork showPriceLabel:showPrice];
        [self.contentView addSubview:metaData];
        self.metadataView = metaData;
    } else {
        [self.metadataView configureWithArtwork:artwork showPriceLabel:showPrice];
    }

    NSString *marginFormat = [NSString stringWithFormat:@"%0.f", ARArtworkCellMetadataMargin];
    NSString *heightFormat = [NSString stringWithFormat:@"%0.f", [self.class heightIncludingPriceLabel:showPrice]];

    [self.metadataView constrainTopSpaceToView:self.imageView predicate:marginFormat];
    [self.metadataView alignBottomEdgeWithView:self.contentView predicate:@"0"];
    [self.metadataView alignCenterXWithView:self.contentView predicate:@"0"];
    [self.metadataView constrainWidthToView:self.contentView predicate:@"0"];
    [self.metadataView constrainHeight:heightFormat];

    [self layoutIfNeeded];

    NSString *baseUrl = [artwork baseImageURL];

    ARFeedItemImageSize size = self.imageSize;
    if (self.imageSize == ARFeedItemImageSizeAuto) {
        CGSize imageSize = self.imageView.bounds.size;
        CGFloat longestDimension = (imageSize.height > imageSize.width) ? imageSize.height : imageSize.width;
        size = (longestDimension > 200) ? ARFeedItemImageSizeLarge : ARFeedItemImageSizeSmall;
    }

    [[ARFeedImageLoader alloc] loadImageAtAddress:baseUrl desiredSize:size
                                     forImageView:self.imageView
                                customPlaceholder:nil];

    self.accessibilityLabel = [artwork title];
    self.isAccessibilityElement = YES;
    self.accessibilityTraits = UIAccessibilityTraitButton;
}


@end
