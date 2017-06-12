#import "ARBrowseViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARBrowseFeaturedLinksCollectionViewCell.h"
#import "ARAppConstants.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"

#import "UIDevice-Hardware.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@interface ARBrowseViewCell : ARBrowseFeaturedLinksCollectionViewCell
@end


@implementation ARBrowseViewCell

- (void)setupTitleLabel
{
    [self.titleLabel setFont:[self.titleLabel.font fontWithSize:16]];
    [self.titleLabel constrainWidthToView:self.contentView predicate:@"-26"];
    [self.titleLabel alignLeadingEdgeWithView:self.contentView predicate:@"13"];
    [self.titleLabel alignBottomEdgeWithView:self.contentView predicate:@"-13"];
}

@end

/////////////////


@interface ARBrowseViewController () <UICollectionViewDataSource, UICollectionViewDelegate, UICollectionViewDelegateFlowLayout, ARMenuAwareViewController>
@property (nonatomic, strong, readonly) NSArray *menuLinks;
@end


@implementation ARBrowseViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];

    [self setupCollectionView];
    [self.collectionView registerClass:[ARBrowseViewCell class] forCellWithReuseIdentifier:[ARBrowseViewCell reuseID]];

    [super viewDidLoad];
}

- (UIScrollView *)menuAwareScrollView
{
    return self.collectionView;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    if (self.menuLinks.count < 1) {
        __weak typeof (self) wself = self;
        [self.networkModel getBrowseFeaturedLinks:^(NSArray *links) {
            __strong typeof (wself) sself = wself;
            [sself.collectionView reloadData];
        } failure:nil];
    }
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (CGFloat)itemMargin
{
    return [UIDevice isPad] ? 20 : 16;
}

- (NSInteger)numberOfColumnsForSize:(CGSize)size
{
    if ([UIDevice isPad]) {
        if (size.width > size.height) {
            return 3;
        } else {
            return 2;
        }
    } else {
        return 1;
    }
}

- (CGFloat)collectionViewInsetMargin
{
    return [UIDevice isPad] ? 40 : 22;
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [coordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> context) {
         [self.collectionView.collectionViewLayout invalidateLayout];
    } completion:nil];

    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
}

- (void)setupCollectionView
{
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];

    UICollectionView *collectionView = [[UICollectionView alloc] initWithFrame:CGRectZero collectionViewLayout:layout];

    collectionView.dataSource = self;
    collectionView.delegate = self;
    collectionView.backgroundColor = [UIColor whiteColor];
    [self.collectionView.collectionViewLayout invalidateLayout];
    [self.view addSubview:collectionView];

    [collectionView alignToView:self.view];
    _collectionView = collectionView;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.collectionView.collectionViewLayout invalidateLayout];
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section
{
    return [self itemMargin];
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section
{
    return [self itemMargin];
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section
{
    CGFloat margin = self.collectionViewInsetMargin;
    return UIEdgeInsetsMake(margin, margin, margin, margin);
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    NSInteger numberOfColumns = numberOfColumns = [self numberOfColumnsForSize:self.view.frame.size];
    NSInteger numberOfMargins = numberOfColumns - 1;
    CGFloat totalMarginsWidth = (numberOfMargins * self.itemMargin) + (2 * self.collectionViewInsetMargin);

    CGFloat collectionViewWidth = self.view.frame.size.width;
    CGFloat cellWidth = (collectionViewWidth - totalMarginsWidth) / (float)numberOfColumns;

    CGFloat heightToWidthFactor;

    if ([UIDevice isPhone]) {
        heightToWidthFactor = .597;
    } else {
        CGRect frame = self.view.frame;
        if (CGRectGetWidth(frame) > CGRectGetHeight(frame)) {
            heightToWidthFactor = 1;
        } else {
            heightToWidthFactor = .8358;
        }
    }

    CGFloat cellHeight = cellWidth * heightToWidthFactor;
    return CGSizeMake(cellWidth, cellHeight);
}

- (NSArray *)menuLinks
{
    return self.networkModel.links;
}

#pragma mark - UICollectionViewDelegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    FeaturedLink *link = [self.menuLinks objectAtIndex:indexPath.row];
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:link.href];
    if (viewController) {
        [self.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
    }
}

#pragma mark - UICollectionViewDataSource

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    ARBrowseViewCell *cell = (id)[self.collectionView dequeueReusableCellWithReuseIdentifier:[ARBrowseViewCell reuseID] forIndexPath:indexPath];
    FeaturedLink *link = self.menuLinks[indexPath.row];
    [cell updateWithTitle:link.title imageURL:link.largeImageURL];

    return cell;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return self.menuLinks.count;
}

#pragma mark - Orientation

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

#pragma mark - ARRootViewController

- (BOOL)isRootViewController
{
    return YES;
}

@end
