/// Shows an image above a standard metadata view
#import "ARItemThumbnailViewCell.h"
#import "ARFeedImageLoader.h"


@class Artwork, ARArtworkThumbnailMetadataView;


typedef enum : NSUInteger {
    ARArtworkWithMetadataThumbnailCellPriceInfoModeAuctionInfo,
    ARArtworkWithMetadataThumbnailCellPriceInfoModeSaleMessage,
    ARArtworkWithMetadataThumbnailCellPriceInfoModeNone,
} ARArtworkWithMetadataThumbnailCellPriceInfoMode;


@interface ARArtworkWithMetadataThumbnailCell : ARItemThumbnailViewCell

+ (CGFloat)heightForMetadataWithArtwork:(Artwork *)artwork;

- (void)setupWithRepresentedObject:(Artwork *)artwork;

@property (nonatomic, assign) enum ARFeedItemImageSize imageSize;
@property (nonatomic, readonly) ARArtworkThumbnailMetadataView *metadataView;

/// By default, will use UIViewContentModeAspectFill
@property (nonatomic, assign) enum UIViewContentMode imageViewContentMode;

@end
