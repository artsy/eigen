#import "ARBrowseFeaturedLinksCollectionView.h"
#import "ARBrowseFeaturedLinksCollectionViewCell.h"

static CGFloat const ARDoubleRowStyleSpacing = 11;


@implementation ARBrowseFeaturedLinksCollectionView

- (instancetype)initWithStyle:(enum ARFeaturedLinkStyle)style
{
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    CGFloat width = [UIScreen mainScreen].bounds.size.width;
    CGFloat height = [self heightForCollectionViewWithStyle:style];
    self = [super initWithFrame:CGRectMake(0, 0, width, height) collectionViewLayout:flowLayout];
    if (!self) {
        return nil;
    }

    _style = style;
    flowLayout.scrollDirection = UICollectionViewScrollDirectionHorizontal;

    self.backgroundColor = [UIColor whiteColor];
    self.dataSource = self;
    self.delegate = self;
    self.showsHorizontalScrollIndicator = NO;

    [self registerClass:ARBrowseFeaturedLinksCollectionViewCell.class forCellWithReuseIdentifier:self.reuseIdentifier];

    return self;
}

- (CGSize)intrinsicContentSize
{
    return CGSizeMake(UIViewNoIntrinsicMetric, [self heightForCollectionViewWithStyle:self.style]);
}

- (CGFloat)heightForCollectionViewWithStyle:(ARFeaturedLinkStyle)style
{
    CGFloat cellHeight = [self heightForCellWithStyle:style];
    switch (style) {
        case ARFeaturedLinkLayoutSingleRow:
            return cellHeight;
        case ARFeaturedLinkLayoutDoubleRow:
            return cellHeight * 2 + ARDoubleRowStyleSpacing;
    }
}
- (CGFloat)heightForCellWithStyle:(ARFeaturedLinkStyle)style
{
    switch (style) {
        case ARFeaturedLinkLayoutSingleRow:
            if ([UIDevice isPhone]) {
                return 200;
            } else if (UIDeviceOrientationIsLandscape([UIDevice currentDevice].orientation)) {
                return 310;
            } else {
                return 226;
            }

        case ARFeaturedLinkLayoutDoubleRow:
            if ([UIDevice isPhone]) {
                return 90;
            } else if (UIDeviceOrientationIsLandscape([UIDevice currentDevice].orientation)) {
                return 120;
            } else {
                return 85;
            }
    }
}

- (CGFloat)widthForCellWithStyle:(ARFeaturedLinkStyle)style
{
    switch (self.style) {
        case ARFeaturedLinkLayoutSingleRow:
            if ([UIDevice isPhone]) {
                return 272;
            } else if (UIDeviceOrientationIsLandscape([UIDevice currentDevice].orientation)) {
                return 456;
            } else {
                return 328;
            }

        case ARFeaturedLinkLayoutDoubleRow:
            if ([UIDevice isPhone]) {
                return 132;
            } else if (UIDeviceOrientationIsLandscape([UIDevice currentDevice].orientation)) {
                return 176;
            } else {
                return 125;
            }
    }
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    CGFloat width = [self widthForCellWithStyle:self.style];
    CGFloat height = [self heightForCellWithStyle:self.style];

    if (!(width && height)) {
        return CGSizeZero;
    }

    return CGSizeMake(width, height);
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section
{
    CGFloat inset;
    if ([UIDevice isPhone]) {
        inset = 20;
    } else {
        inset = 50;
    }
    return UIEdgeInsetsMake(0, inset, 0, inset);
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section;
{
    return self.featuredLinks.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath;
{
    ARBrowseFeaturedLinksCollectionViewCell *cell = (id)[self dequeueReusableCellWithReuseIdentifier:self.reuseIdentifier forIndexPath:indexPath];

    FeaturedLink *link = self.featuredLinks[indexPath.row];
    NSURL *imageURL;
    switch (self.style) {
        case ARFeaturedLinkLayoutSingleRow:
            imageURL = link.largeImageURL;
            break;
        case ARFeaturedLinkLayoutDoubleRow:
            imageURL = link.smallImageURL;
            break;
    }

    [cell updateWithTitle:link.title imageURL:imageURL];

    return cell;
}

- (void)setFeaturedLinks:(NSArray *)featuredLinks
{
    _featuredLinks = featuredLinks.copy;
    [self reloadData];
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    FeaturedLink *link = self.featuredLinks[indexPath.row];
    [self.selectionDelegate didSelectFeaturedLink:link];
}

- (NSString *)reuseIdentifier
{
    return [ARBrowseFeaturedLinksCollectionViewCell reuseID];
}

@end
