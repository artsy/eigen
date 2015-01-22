@interface ARFavoriteItemViewCell : UICollectionViewCell

+ (CGFloat)heightForCellWithOrientation:(UIInterfaceOrientation)orientation;
+ (CGFloat)widthForCellWithOrientation:(UIInterfaceOrientation)orientation;
- (void)setupWithRepresentedObject:(id)object;

@end
