#import "ARFeedImageLoader.h"

/// The ARItemThumbnail is an object aware re-usable
/// view that loads a thumbnail

@interface ARItemThumbnailViewCell : UICollectionViewCell

/// Deals with setting up it's own imageview and setting the
/// thumbnail for that object

- (void)setupWithRepresentedObject:(id)object;

@property (nonatomic, assign) enum ARFeedItemImageSize imageSize;

@end
