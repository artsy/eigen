#import "ARSaleArtworkItemMasonryModule.h"
#import "ARSaleArtworkMasonryCollectionViewCell.h"
#import "Artsy-Swift.h"

@import ARCollectionViewMasonryLayout;

CGFloat marginForTraitCollection(UITraitCollection *traitCollection)
{
    return (traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassCompact ? 20 : 40);
}


@interface ARSaleArtworkItemMasonryModule () <ARCollectionViewMasonryLayoutDelegate>

@end


@implementation ARSaleArtworkItemMasonryModule

- (instancetype)initWithTraitCollection:(UITraitCollection *)traitCollection width:(CGFloat)width
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _traitCollection = traitCollection;

    ARCollectionViewMasonryLayout *layout = [[ARCollectionViewMasonryLayout alloc] initWithDirection:ARCollectionViewMasonryLayoutDirectionVertical];

    CGFloat margin = marginForTraitCollection(traitCollection);
    CGFloat verticalEdgeInset = traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassCompact ? 14 : 20;

    layout.itemMargins = CGSizeMake(margin, verticalEdgeInset);
    layout.rank = traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassCompact ? 2 : 3;
    layout.dimensionLength = (width - (layout.rank - 1) * margin) / layout.rank;
    layout.contentInset = UIEdgeInsetsMake(verticalEdgeInset, 0, verticalEdgeInset, 0);

    _moduleLayout = layout;
    return self;
}

- (Class)classForCell
{
    return [ARSaleArtworkMasonryCollectionViewCell class];
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(ARCollectionViewMasonryLayout *)collectionViewLayout variableDimensionForItemAtIndexPath:(NSIndexPath *)indexPath
{
    CGFloat staticDimension = collectionViewLayout.dimensionLength;
    SaleArtworkViewModel *viewModel = self.items[indexPath.row];
    return staticDimension / viewModel.aspectRatio + [ARSaleArtworkMasonryCollectionViewCell paddingForMetadata];
}

#pragma mark - ARSaleArtworkItemWidthDependentModule

- (void)setWidth:(CGFloat)width
{
    CGFloat margin = marginForTraitCollection(self.traitCollection);
    ARCollectionViewMasonryLayout *layout = (ARCollectionViewMasonryLayout *)self.moduleLayout;
    layout.dimensionLength = (width - (layout.rank - 1) * margin) / layout.rank;
}

@end
