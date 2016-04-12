#import "ARBrowseFeaturedLinksCollectionViewController.h"
#import "ARBrowseFeaturedLinksCollectionViewCell.h"

#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

static CGFloat const ARDoubleRowStyleSpacing = 11;


@interface ARBrowseFeaturedLinksCollectionViewController ()
@property (nonatomic, strong) NSLayoutConstraint *heightConstraint;
@property (nonatomic, strong, readonly) UICollectionViewFlowLayout *collectionViewLayout;
@end


@implementation ARBrowseFeaturedLinksCollectionViewController
@dynamic collectionViewLayout;

- (instancetype)initWithStyle:(enum ARFeaturedLinkStyle)style
{
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    CGFloat sideMargin = [UIDevice isPad] ? 50 : 20;
    layout.sectionInset = UIEdgeInsetsMake(0, sideMargin, 0, sideMargin);
    layout.scrollDirection = UICollectionViewScrollDirectionHorizontal;
    layout.minimumLineSpacing = ARDoubleRowStyleSpacing;

    self = [super initWithCollectionViewLayout:layout];
    if (!self) {
        return nil;
    }

    _style = style;

    return self;
}

- (void)updateHeightConstraintWithSize:(CGSize)size
{
    CGFloat height = [self heightForStyle:self.style size:size];
    if (!self.heightConstraint) {
        self.heightConstraint = [self.view constrainHeight:@(height).stringValue];
    } else if (height != self.heightConstraint.constant) {
        self.heightConstraint.constant = height;
    }
    [self.collectionView.superview layoutIfNeeded];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.collectionView alignToView:self.view];
    self.collectionView.delegate = self;
    self.collectionView.dataSource = self;
    self.collectionView.backgroundColor = [UIColor whiteColor];
    self.collectionView.showsHorizontalScrollIndicator = NO;
    [self.collectionView registerClass:ARBrowseFeaturedLinksCollectionViewCell.class forCellWithReuseIdentifier:self.reuseIdentifier];
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];

    [self updateItemSizeWithParentSize:size];

    [coordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> context) {
        if (!CGSizeEqualToSize(size, CGSizeZero)) {
            [self updateHeightConstraintWithSize:self.parentViewController.view.frame.size];
        }
    } completion:nil];
}

- (void)updateViewConstraints;
{
    [super updateViewConstraints];
    CGRect parentFrame = self.parentViewController.view.frame;
    if (self.parentViewController && !CGRectEqualToRect(parentFrame, CGRectZero)) {
        [self updateItemSizeWithParentSize:parentFrame.size];
        [self updateHeightConstraintWithSize:parentFrame.size];
    }
}

- (void)updateItemSizeWithParentSize:(CGSize)parentSize
{
    CGSize cellSize = [self sizeForCellWithSize:parentSize];
    if (!CGSizeEqualToSize(self.collectionViewLayout.itemSize, cellSize)) {
        self.collectionViewLayout.itemSize = cellSize;
        [self.collectionViewLayout invalidateLayout];
    }
}

- (CGFloat)heightForStyle:(ARFeaturedLinkStyle)style size:(CGSize)size
{
    CGFloat cellHeight = [self heightForCellWithStyle:style size:size];
    CGFloat height = 0;
    switch (style) {
        case ARFeaturedLinkLayoutSingleRow:
            height = cellHeight;
            break;

        case ARFeaturedLinkLayoutDoubleRow:
            height = (2 * cellHeight) + ARDoubleRowStyleSpacing;
            break;
    }

    height = height + self.collectionViewLayout.sectionInset.top + self.collectionViewLayout.sectionInset.bottom;
    return height;
}

- (CGFloat)heightForCellWithStyle:(ARFeaturedLinkStyle)style size:(CGSize)size
{
    switch (style) {
        case ARFeaturedLinkLayoutSingleRow:
            if ([UIDevice isPhone]) {
                return 200;
            } else if (size.width > size.height) {
                return 310;
            } else {
                return 226;
            }

        case ARFeaturedLinkLayoutDoubleRow:
            if ([UIDevice isPhone]) {
                return 90;
            } else if (size.width > size.height) {
                return 120;
            } else {
                return 85;
            }
    }
}

- (CGFloat)widthForCellWithStyle:(ARFeaturedLinkStyle)style size:(CGSize)size
{
    switch (self.style) {
        case ARFeaturedLinkLayoutSingleRow:
            if ([UIDevice isPhone]) {
                return 272;
            } else if (size.width > size.height) {
                return 456;
            } else {
                return 328;
            }

        case ARFeaturedLinkLayoutDoubleRow:
            if ([UIDevice isPhone]) {
                return 132;
            } else if (size.width > size.height) {
                return 176;
            } else {
                return 125;
            }
    }
}

- (CGSize)sizeForCellWithSize:(CGSize)size
{
    CGFloat width = [self widthForCellWithStyle:self.style size:size];
    CGFloat height = [self heightForCellWithStyle:self.style size:size];

    return CGSizeMake(width, height);
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section;
{
    return self.featuredLinks.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath;
{
    ARBrowseFeaturedLinksCollectionViewCell *cell = (id)[self.collectionView dequeueReusableCellWithReuseIdentifier:self.reuseIdentifier forIndexPath:indexPath];

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
    [self.collectionView reloadData];
    if (self.parentViewController && !CGRectEqualToRect(self.parentViewController.view.frame, CGRectZero)) {
        [self updateHeightConstraintWithSize:self.parentViewController.view.frame.size];
    }
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
