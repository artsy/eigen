#import <UIKit/UIKit.h>


@interface ARFavoriteItemViewCell : UICollectionViewCell

+ (CGSize)sizeForCellwithSize:(CGSize)size insets:(UIEdgeInsets)insets;
- (void)setupWithRepresentedObject:(id)object;

@end
