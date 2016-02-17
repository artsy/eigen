#import "ARSaleArtworkItemFlowModule.h"
#import "ARSaleArtworkFlowCollectionViewCell.h"

@import ARCollectionViewMasonryLayout;


@interface ARSaleArtworkItemFlowModule () <ARCollectionViewMasonryLayoutDelegate>

@end


@implementation ARSaleArtworkItemFlowModule

- (instancetype)initWithTraitCollection:(UITraitCollection *)traitCollection width:(CGFloat)width
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _traitCollection = traitCollection;

    ARCollectionViewMasonryLayout *layout = [[ARCollectionViewMasonryLayout alloc] initWithDirection:ARCollectionViewMasonryLayoutDirectionVertical];
    layout.itemSize = CGSizeMake(width, 120);
    layout.minimumLineSpacing = 0;

    layout.itemMargins = CGSizeZero;
    layout.rank = 1;
    layout.dimensionLength = layout.itemSize.width;
    layout.contentInset = UIEdgeInsetsZero;

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

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(ARCollectionViewMasonryLayout *)collectionViewLayout variableDimensionForItemAtIndexPath:(NSIndexPath *)indexPath
{
    return collectionViewLayout.itemSize.height;
}

@end
