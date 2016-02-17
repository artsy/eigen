#import <UIKit/UIKit.h>

/// Cell class for either Regular or Compact horizontal size classes. Do not reference this class directly, but rather one of the two subclasses beneath.
@interface ARSaleArtworkFlowCollectionViewCell : UICollectionViewCell

- (void)setupWithRepresentedObject:(id)object;

@end

/// Sale Artwork cell for regular horizontal size classes (iPad).
@interface ARSaleArtworkFlowCollectionViewRegularCell : ARSaleArtworkFlowCollectionViewCell

@end


/// Sale Artwork cell for compact horizontal size classes (typically iPhone, or iPad multitasking tray).
@interface ARSaleArtworkFlowCollectionViewCompactCell : ARSaleArtworkFlowCollectionViewCell

@end
