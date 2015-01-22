#import "ARFeedImageLoader.h"

/// The ARModelCollectionViewModule exists to act as a tool
/// to deal with different layouts for a collection of items

// Presentation styles used by artwork-specific subclasses.
typedef NS_ENUM(NSInteger, AREmbeddedArtworkPresentationStyle){
    AREmbeddedArtworkPresentationStyleArtworkOnly,
    AREmbeddedArtworkPresentationStyleArtworkMetadata
};

@interface ARModelCollectionViewModule : NSObject

/// A UICollectionView subclass that will deal with the layout of the items
- (UICollectionViewLayout *)moduleLayout;

/// The module holds the items
@property (nonatomic, copy) NSArray *items;

/// An intrinsic size that should always redirect to the class method
/// using the current settings for styles
- (CGSize)intrinsicSize;

/// The cell for displaying the models. Must be set by subclasses.
- (Class)classForCell;

/// If the module should support some form of paging this function is necessary
- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset;

-(ARFeedItemImageSize)imageSize;

@end
