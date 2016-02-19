#import "ARModelCollectionViewModule.h"


@interface ARSaleArtworkItemFlowModule : ARModelCollectionViewModule

- (instancetype)initWithTraitCollection:(UITraitCollection *)traitCollection width:(CGFloat)width;

@property (nonatomic, strong, readonly) UITraitCollection *traitCollection;

@property (nonatomic, strong) UICollectionViewFlowLayout *moduleLayout;

@end
