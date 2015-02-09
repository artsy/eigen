#import "ARBrowseFeaturedLinksCollectionView.h"
#import "ARBrowseFeaturedLinksCollectionViewCell.h"
#import "ARBrowseFeaturedLinkInsetCell.h"

static CGFloat const ARPagingStyleDimension = 195;
static CGFloat const ARPagingStyleSpacing = 13;
static CGFloat const ARDoubleRowStyleSpacing = 11;

@interface ARBrowseFeaturedLinksCollectionView()
@property (nonatomic, strong) UIScrollView *secondaryScroll;
@end

@implementation ARBrowseFeaturedLinksCollectionView

- (instancetype)initWithStyle:(enum ARFeaturedLinkStyle)style
{
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    CGFloat width = [UIScreen mainScreen].bounds.size.width;
    CGFloat height = [self heightForCollectionViewWithStyle:style];
    self = [super initWithFrame:CGRectMake(0, 0, width, height) collectionViewLayout:flowLayout];
    if (!self) { return nil; }

    _style = style;
    flowLayout.scrollDirection = UICollectionViewScrollDirectionHorizontal;

    self.backgroundColor = [UIColor whiteColor];
    self.dataSource = self;
    self.delegate = self;
    self.showsHorizontalScrollIndicator = NO;

    if (style == ARFeaturedLinkLayoutSinglePaging) {
        flowLayout.minimumLineSpacing = ARPagingStyleSpacing;
        [self setupPaging];
        [self registerClass:ARBrowseFeaturedLinkInsetCell.class forCellWithReuseIdentifier:self.reuseIdentifier];

    } else {
        [self registerClass:ARBrowseFeaturedLinksCollectionViewCell.class forCellWithReuseIdentifier:self.reuseIdentifier];
    }

    return self;
}

- (void)setupPaging
{
    // Create a second scroll view which pages and is the size of a collection
    // view cell. Then move the scrollviews pan gesture to the collectionview.

    // Works, bit cray.
    // http://khanlou.com/2013/04/paging-a-overflowing-collection-view/

    CGFloat totalPageWidth = ARPagingStyleDimension + ARPagingStyleSpacing;
    CGFloat margin = (CGRectGetWidth(self.frame) - totalPageWidth)/ 2;
    self.contentInset = UIEdgeInsetsMake(0, margin, 0, 0);

    _secondaryScroll = [[UIScrollView alloc] initWithFrame:self.frame];
    _secondaryScroll.bounds = CGRectMake(0, 0, totalPageWidth, ARPagingStyleDimension);
    _secondaryScroll.clipsToBounds = NO;
    _secondaryScroll.delegate = self;
    _secondaryScroll.hidden = YES;
    _secondaryScroll.pagingEnabled = YES;

    [self addSubview:_secondaryScroll];

    [self addGestureRecognizer:_secondaryScroll.panGestureRecognizer];
    self.panGestureRecognizer.enabled = NO;
    self.scrollEnabled = NO;
}


- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if (scrollView == self.secondaryScroll) {
        // Ignore collection view scrolling callbacks
        CGPoint contentOffset = scrollView.contentOffset;
        contentOffset.x = contentOffset.x - self.contentInset.left;
        self.contentOffset = contentOffset;
    }
}

- (CGSize)intrinsicContentSize
{
    return CGSizeMake(UIViewNoIntrinsicMetric, [self heightForCollectionViewWithStyle:self.style]);
}

- (CGFloat)heightForCollectionViewWithStyle:(ARFeaturedLinkStyle)style
{
    CGFloat cellHeight =  [self heightForCellWithStyle:style];
    if (style == ARFeaturedLinkLayoutDoubleRow) {
        return cellHeight * 2 + ARDoubleRowStyleSpacing;
    } else {
        return cellHeight;
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
        case ARFeaturedLinkLayoutSinglePaging:
            return ARPagingStyleDimension;

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

- (CGFloat)widthForCellWithStyle:(ARFeaturedLinkStyle)style{

    switch (self.style) {
        case ARFeaturedLinkLayoutSingleRow:
            if ([UIDevice isPhone]) {
                return 272;
            } else if (UIDeviceOrientationIsLandscape([UIDevice currentDevice].orientation)) {
                return 456;
            } else {
                return 328;
            }
        case ARFeaturedLinkLayoutSinglePaging:
            return ARPagingStyleDimension;

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

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    CGFloat width = [self widthForCellWithStyle:self.style];
    CGFloat height = [self heightForCellWithStyle:self.style];

    if (!(width && height)) { return CGSizeZero; }

    return CGSizeMake(width, height);
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout insetForSectionAtIndex:(NSInteger)section
{
    CGFloat inset;
    if (self.style == ARFeaturedLinkLayoutSinglePaging){
        inset = ARPagingStyleSpacing / 2;
    } else if ([UIDevice isPhone]) {
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
    switch (self.style){
        case ARFeaturedLinkLayoutSingleRow:
            imageURL = link.largeImageURL;
            break;
        case ARFeaturedLinkLayoutSinglePaging:
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
    if (self.secondaryScroll){
        self.secondaryScroll.contentSize = [self.collectionViewLayout collectionViewContentSize];
        self.secondaryScroll.contentOffset = CGPointMake(ARPagingStyleDimension + ARPagingStyleSpacing, 0);
    };
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    FeaturedLink *link = self.featuredLinks[indexPath.row];
    [self.selectionDelegate didSelectFeaturedLink:link];
}

- (NSString *)reuseIdentifier
{
    if (self.style == ARFeaturedLinkLayoutSinglePaging) {
      return [ARBrowseFeaturedLinkInsetCell reuseID];
    }

    return [ARBrowseFeaturedLinksCollectionViewCell reuseID];
}

@end
