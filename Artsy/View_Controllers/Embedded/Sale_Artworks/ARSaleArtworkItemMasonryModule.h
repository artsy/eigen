#import "ARModelCollectionViewModule.h"
#import "ARSaleArtworkItemWidthDependentModule.h"


@interface ARSaleArtworkItemMasonryModule : ARModelCollectionViewModule <ARSaleArtworkItemWidthDependentModule>

- (instancetype)initWithTraitCollection:(UITraitCollection *)traitCollection width:(CGFloat)width;

@property (nonatomic, strong, readonly) UITraitCollection *traitCollection;

@property (nonatomic, strong) UICollectionViewFlowLayout *moduleLayout;

@end
