#import "ARArtworkWithMetadataThumbnailCell.h"
#import "ARArtworkThumbnailMetadataView.h"

static const CGFloat ARArtworkCellMetadataMargin = 8;


@interface ARArtworkWithMetadataThumbnailCell ()
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) ARArtworkThumbnailMetadataView *metadataView;
@end


@implementation ARArtworkWithMetadataThumbnailCell

@dynamic imageSize;

+ (CGFloat)heightForMetaData
{
    return [ARArtworkThumbnailMetadataView heightForView] + ARArtworkCellMetadataMargin;
}

- (void)prepareForReuse
{
    self.imageView.image = [ARFeedImageLoader defaultPlaceholder];
    [self.metadataView resetLabels];
}

- (void)setupWithRepresentedObject:(Artwork *)artwork
{
    if (!self.imageView) {
        UIImageView *imageView = [[UIImageView alloc] init];
        imageView.contentMode = UIViewContentModeScaleAspectFill;
        imageView.clipsToBounds = YES;

        [self.contentView addSubview:imageView];

        [imageView alignTopEdgeWithView:self.contentView predicate:@"0"];
        [imageView alignCenterXWithView:self.contentView predicate:@"0"];
        [imageView constrainWidthToView:self.contentView predicate:@"0"];

        self.imageView = imageView;
    }

    if (!self.metadataView) {
        ARArtworkThumbnailMetadataView *metaData = [[ARArtworkThumbnailMetadataView alloc] init];
        [self.contentView addSubview:metaData];

        NSString *marginFormat = [NSString stringWithFormat:@"%0.f", ARArtworkCellMetadataMargin];
        NSString *heightFormat = [NSString stringWithFormat:@"%0.f", [ARArtworkThumbnailMetadataView heightForView]];

        [metaData constrainTopSpaceToView:self.imageView predicate:marginFormat];
        [metaData alignBottomEdgeWithView:self.contentView predicate:@"0"];
        [metaData alignCenterXWithView:self.contentView predicate:@"0"];
        [metaData constrainWidthToView:self.contentView predicate:@"0"];
        [metaData constrainHeight:heightFormat];

        self.metadataView = metaData;
    }

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

    [self.metadataView configureWithArtwork:artwork];

    self.accessibilityLabel = [artwork title];
    self.isAccessibilityElement = YES;
    self.accessibilityTraits = UIAccessibilityTraitButton;
}

@end
