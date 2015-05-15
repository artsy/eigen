#import "ARModelCollectionViewModule.h"
#import "ARArtworkFlowModule.h"
#import "ARArtworkMasonryModule.h"

@class AREmbeddedModelsViewController;

@protocol AREmbeddedModelsDelegate<NSObject>

-(void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController;

/// Allows the host view controller to act on an item tap, will
/// default to ARSwitchboard if selector not valid
- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index;

@optional

/// This message gets passed if the edge is reached. Currently
/// unimplemented, may be moved to a block property.
- (void)embeddedModelsViewControllerDidScrollPastEdge:(AREmbeddedModelsViewController *)controller;
- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath;
@end


/// The AREmbedded Models View Controller is a layout agnostic way to
/// present thumbnailable items like artworks with optional metadata.

@interface AREmbeddedModelsViewController : UIViewController <UICollectionViewDelegate, UICollectionViewDataSource>

/// An optional delegate for actions
@property (nonatomic, weak) id <AREmbeddedModelsDelegate> delegate;

/// The items shown by the embedded models VC
@property (nonatomic, copy, readonly) NSArray *items;

/// Appends items and inserts the collectionview items
- (void)appendItems:(NSArray *)items;

/// The module that controls the UICollectionViewLayout
@property (nonatomic, strong) ARModelCollectionViewModule *activeModule;

///  To provide extra customization to the collection view
@property (nonatomic, strong, readonly) UICollectionView *collectionView;

/// Update the height constraint when new items are added, defaults OFF
/// useful when dealing with vertical layouts.
@property (nonatomic, assign) BOOL constrainHeightAutomatically;

/// Header View for when the view controller is basically another VCs view.
@property (nonatomic, strong) UIView *headerView;
@property (nonatomic, assign) CGFloat headerHeight;

/// Shows a progress indicator, only works in masonry
@property (nonatomic, assign) BOOL showTrailingLoadingIndicator;

/// Recieves UIScrollViewDelegate methods
@property (nonatomic, strong) id <UIScrollViewDelegate> scrollDelegate;

@property (nonatomic, strong, readonly) Fair *fair;

@property (nonatomic, assign, readwrite) BOOL shouldAnimate;

@end
