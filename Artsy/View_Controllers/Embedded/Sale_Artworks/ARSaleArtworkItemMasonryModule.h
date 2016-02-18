#import "ARModelCollectionViewModule.h"


@interface ARSaleArtworkItemMasonryModule : ARModelCollectionViewModule

- (instancetype)initWithTraitCollection:(UITraitCollection *)traitCollection width:(CGFloat)width;

@property (nonatomic, strong, readonly) UITraitCollection *traitCollection;

@property (nonatomic, strong) UICollectionViewFlowLayout *moduleLayout;

@end
