#import "ARSaleArtworkItemMasonryModule.h"
#import "ARSaleArtworkMasonryCollectionViewCell.h"
#import "Artsy-Swift.h"

@import ARCollectionViewMasonryLayout;


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

    //    self.moduleLayout.itemMargins = [self.class itemMarginsforLayout:self.layout];
    //    self.moduleLayout.rank = [self.class rankForlayout:self.layout];
    //    self.moduleLayout.dimensionLength = [self.class dimensionForlayout:self.layout useLandscapeValues:useLandscapeValues];
    //    self.moduleLayout.contentInset = [self.class edgeInsetsForlayout:self.layout];

    ARCollectionViewMasonryLayout *layout = [[ARCollectionViewMasonryLayout alloc] initWithDirection:ARCollectionViewMasonryLayoutDirectionVertical];
    //    layout.itemSize = CGSizeMake(width, 120); // This is unused, might be a nice place to stash some value.

    CGFloat margin = traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassCompact ? 20 : 40;
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

@end
