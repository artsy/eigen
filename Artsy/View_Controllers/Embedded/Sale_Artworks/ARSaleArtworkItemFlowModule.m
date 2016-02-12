#import "ARSaleArtworkItemFlowModule.h"
#import "ARSaleArtworkFlowCollectionViewCell.h"


@implementation ARSaleArtworkItemFlowModule

- (instancetype)initWithTraitCollection:(UITraitCollection *)traitCollection width:(CGFloat)width
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _traitCollection = traitCollection;

    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    layout.itemSize = CGSizeMake(width, 120);
    layout.minimumLineSpacing = 0;

    _moduleLayout = layout;
    return self;
}

- (Class)classForCell
{
    if (self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular) {
        return [ARSaleArtworkFlowCollectionViewRegularCell class];
    } else {
        return [ARSaleArtworkFlowCollectionViewCompactCell class];
    }
}

@end
