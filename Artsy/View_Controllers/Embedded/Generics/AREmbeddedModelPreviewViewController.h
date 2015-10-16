#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// A View Controller for previewing an item in AREmbeddedModelsViewController
/// given that we don't know the items, it tries to be as generic as possible
/// around what it is presenting

@interface AREmbeddedModelPreviewViewController : UIViewController

/// Init function with a represented object
- (instancetype)initWithObject:(id)object;

/// The object being represented
@property (nonatomic, strong, readonly) id object;

/// Try to take out the image from the cell.
- (void)updateWithCell:( UICollectionViewCell *)cell;


@end

NS_ASSUME_NONNULL_END