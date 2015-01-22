#import "ARModelCollectionViewModule.h"

typedef NS_ENUM(NSInteger, ARArtworkFlowLayout){
    ARArtworkFlowLayoutSingleRow,
    ARArtworkFlowLayoutDoubleRow,
    ARArtworkFlowLayoutPagingCarousel,
    ARArtworkFlowLayoutDoubleColumn
};

/// Handles the layout and styling for Carousel & Single image
/// layouts in an AREmbeddedModelsViewController
@interface ARArtworkFlowModule : ARModelCollectionViewModule  <UICollectionViewDelegateFlowLayout, UIScrollViewDelegate>

/// Create a flow based module
+ (instancetype)flowModuleWithLayout:(enum ARArtworkFlowLayout)layout andStyle:(enum AREmbeddedArtworkPresentationStyle)style;

/// Gets the size for the view with a style & items
+ (CGSize)intrinsicSizeWithlayout:(enum ARArtworkFlowLayout)layout andArtworks:(NSArray *)items;

/// The artsy specific styles for the layout
@property (nonatomic, assign, readonly) enum AREmbeddedArtworkPresentationStyle style;

@end
