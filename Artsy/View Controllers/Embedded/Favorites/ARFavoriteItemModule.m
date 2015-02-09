#import "ARFavoriteItemModule.h"
#import "ARFavoriteItemViewCell.h"

@implementation ARFavoriteItemModule

- (instancetype)init
{
    self = [super init];
    if (!self) {return nil;}
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    CGFloat sideMargin = [UIDevice isPad] ? 50 : 20;
    layout.sectionInset = UIEdgeInsetsMake(20, sideMargin, 20, sideMargin);
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    CGFloat width = [ARFavoriteItemViewCell widthForCellWithOrientation:orientation];
    CGFloat height = [ARFavoriteItemViewCell heightForCellWithOrientation:orientation];
    layout.itemSize = (CGSize){ width, height };
    _moduleLayout = layout;
    return self;
}

- (Class)classForCell
{
    return [ARFavoriteItemViewCell class];
}

- (ARFeedItemImageSize)imageSize
{
    return ARFeedItemImageSizeLarge;
}

@end
