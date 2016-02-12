#import "ARModelCollectionViewModule.h"


@interface ARSaleArtworkItemFlowModule : ARModelCollectionViewModule

- (instancetype)initWithTraitCollection:(UITraitCollection *)traitCollection;

@property (nonatomic, strong, readonly) UITraitCollection *traitCollection;

@property (nonatomic, strong) UICollectionViewFlowLayout *moduleLayout;

@end
