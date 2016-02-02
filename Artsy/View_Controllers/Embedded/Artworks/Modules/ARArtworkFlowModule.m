#import "ARArtworkFlowModule.h"

#import "ARPostAttachment.h"
#import "ARItemThumbnailViewCell.h"
#import "ARArtworkWithMetadataThumbnailCell.h"

/// Note: a purposeful lack of constants in here. YOLO.


@interface ARArtworkFlowModule ()
@property (nonatomic, strong) UICollectionViewFlowLayout *moduleLayout;
@property (nonatomic, assign) enum ARArtworkFlowLayout layout;
@property (nonatomic, assign) enum AREmbeddedArtworkPresentationStyle style;
@end


@implementation ARArtworkFlowModule

+ (instancetype)flowModuleWithLayout:(enum ARArtworkFlowLayout)layout andStyle:(enum AREmbeddedArtworkPresentationStyle)style
{
    ARArtworkFlowModule *module = [[self alloc] init];
    module.layout = layout;
    module.style = style;

    module.moduleLayout = [self createFlowLayoutForModule:module];

    return module;
}

+ (UICollectionViewFlowLayout *)createFlowLayoutForModule:(ARArtworkFlowModule *)module
{
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];

    switch (module.layout) {
        default:
            layout.minimumInteritemSpacing = 20;
            layout.itemSize = [module itemSizeWithLayout:module.layout andArtworks:module.items];
            layout.scrollDirection = UICollectionViewScrollDirectionHorizontal;
            layout.sectionInset = UIEdgeInsetsMake(0, 20, 0, 20);
            break;
    }

    return layout;
}

- (CGSize)intrinsicSize
{
    return [self.class intrinsicSizeWithlayout:self.layout andArtworks:self.items];
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{
    // Add paging
}

#pragma mark Flow Based Sizing

- (CGSize)itemSizeWithLayout:(enum ARArtworkFlowLayout)layout andArtworks:(NSArray *)items
{
    switch (layout) {
        case ARArtworkFlowLayoutDoubleRow:
            return CGSizeMake(100, 120);

        case ARArtworkFlowLayoutDoubleColumn:
            return CGSizeMake(160, 130);

        default:
            return CGSizeMake(300, 300);
    }
}

+ (CGSize)intrinsicSizeWithlayout:(enum ARArtworkFlowLayout)layout andArtworks:(NSArray *)items
{
    //    if (items.count == 0) {
    //        size = CGSizeMake(320, 320);
    //
    //    } else if (items.count == 1) {
    //        size = [self sizeForSingleItem:items.first];
    //
    //    } else {
    //        CGFloat height = [self sizeForSingleItem:items.first].height;
    //        size = CGSizeMake(320, height);
    //    }

    switch (layout) {
        case ARArtworkFlowLayoutDoubleRow:
            return CGSizeMake(300, 300);
            break;

        default:
            return CGSizeMake(300, 300);
    }
}

+ (CGSize)sizeForSingleItem:(id<ARPostAttachment>)item
{
    CGFloat aspectRatio = item.aspectRatio;
    CGFloat height, width;
    CGFloat ARFeedCarouselThresholdRatio = 3.0 / 2.0;

    CGSize sizeWithMaxHeight = [self sizeForSingleItem:item withHeight:280];

    if (aspectRatio) {
        if (aspectRatio < ARFeedCarouselThresholdRatio) {
            // Fit inside ARFeedWidth x ARFeedWidth Square
            if (aspectRatio <= 1) {
                return sizeWithMaxHeight;

            } else {
                width = 280;
                height = 280 / aspectRatio;
            }

        } else {
            // Contraints : height <= ARFeedWidth and width <= 2 * ARFeedWidth

            CGFloat maxWidth = 2 * 280;
            if (sizeWithMaxHeight.width > maxWidth) {
                return CGSizeMake(maxWidth, maxWidth / aspectRatio);
            } else {
                return sizeWithMaxHeight;
            }
        }

    } else {
        // force it to square
        height = 280;
        width = 280;
    }

    return CGSizeMake(width, height);
}

+ (CGSize)sizeForSingleItem:(id<ARPostAttachment>)item withHeight:(CGFloat)height
{
    CGFloat aspectRatio = item.aspectRatio;
    CGFloat width;

    if (aspectRatio) {
        width = height * aspectRatio;
    } else {
        // force it to square
        width = height;
    }

    return CGSizeMake(width, height);
}

- (Class)classForCell
{
    switch (self.style) {
        case AREmbeddedArtworkPresentationStyleArtworkOnly:
            return [ARItemThumbnailViewCell class];

        case AREmbeddedArtworkPresentationStyleArtworkMetadata:
            return [ARArtworkWithMetadataThumbnailCell class];
    }
}

@end
