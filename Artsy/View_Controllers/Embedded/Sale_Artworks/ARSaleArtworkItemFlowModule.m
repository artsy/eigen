#import "ARSaleArtworkItemFlowModule.h"
#import "ARSaleArtworkFlowCollectionViewCell.h"


@implementation ARSaleArtworkItemFlowModule

- (instancetype)initWithTraitCollection:(UITraitCollection *)traitCollection
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _traitCollection = traitCollection;

    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    CGFloat sideMargin = traitCollection.userInterfaceIdiom == UIUserInterfaceIdiomPad ? 50 : 20;
    layout.sectionInset = UIEdgeInsetsMake(20, sideMargin, 20, sideMargin);
    layout.itemSize = CGSizeMake(300, 120);

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
