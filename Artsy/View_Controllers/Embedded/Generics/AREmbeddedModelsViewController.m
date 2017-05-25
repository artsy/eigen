#import "ARLogger.h"
#import "AREmbeddedModelsViewController.h"

#import "ARAppConstants.h"
#import "ARItemThumbnailViewCell.h"
#import "ARReusableLoadingView.h"
#import "AREmbeddedModelsPreviewDelegate.h"
#import "AREmbeddedModelPreviewViewController.h"
#import "ARTopMenuViewController.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARArtworkMasonryModule (Private)
- (void)updateLayoutForSize:(CGSize)size;
@end


@interface AREmbeddedModelsViewController () <ARCollectionViewMasonryLayoutDelegate>

@property (nonatomic, strong) UICollectionView *collectionView;
@property (nonatomic, strong) NSLayoutConstraint *heightConstraint;
@property (nonatomic, strong) AREmbeddedModelsPreviewDelegate *previewDelegate;

// Private Accessors
@property (nonatomic, strong, readwrite) Fair *fair;

@end


@implementation AREmbeddedModelsViewController

- (void)viewDidLoad
{
    self.collectionView = [self createCollectionView];
    self.collectionView.backgroundColor = [UIColor whiteColor];
    self.collectionView.dataSource = self;
    self.collectionView.delegate = self;
    self.collectionView.scrollsToTop = NO;
    self.collectionView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    self.collectionView.showsHorizontalScrollIndicator = NO;
    self.collectionView.showsVerticalScrollIndicator = NO;

    [self.collectionView registerClass:[UICollectionReusableView class] forSupplementaryViewOfKind:UICollectionElementKindSectionHeader withReuseIdentifier:UICollectionElementKindSectionHeader];
    [self.collectionView registerClass:[UICollectionReusableView class] forSupplementaryViewOfKind:UICollectionElementKindSectionFooter withReuseIdentifier:UICollectionElementKindSectionFooter];
    [self.view addSubview:self.collectionView];

    if ([self respondsToSelector:@selector(registerForPreviewingWithDelegate:sourceView:)]) {
        self.previewDelegate = [[AREmbeddedModelsPreviewDelegate alloc] initWithModelVC:self];

        UIView *rootView = [ARTopMenuViewController sharedController].view;
        [self registerForPreviewingWithDelegate:self.previewDelegate sourceView:rootView];
    }

    [super viewDidLoad];
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];
    self.collectionView.frame = self.view.bounds;
}

- (void)updateForSize:(CGSize)size
{
    if ([self.activeModule isKindOfClass:[ARArtworkMasonryModule class]]) {
        [(ARArtworkMasonryModule *)self.activeModule updateLayoutForSize:size];
    }

    [self.view setNeedsUpdateConstraints];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
    if (!parent) {
        return;
    }
    [self updateForSize:parent.view.frame.size];
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];

    [coordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> context) {
        [self updateForSize:size];
        [self.view layoutIfNeeded];
    } completion:nil];
}

- (UICollectionView *)createCollectionView
{
    // Because the collection view is lazily created at view will appear
    // there we can't guarantee that the activemodule is set already.

    UICollectionView *collectionView = nil;
    if (!self.activeModule) {
        self.activeModule = [ARArtworkFlowModule flowModuleWithLayout:ARArtworkFlowLayoutSingleRow
                                                             andStyle:AREmbeddedArtworkPresentationStyleArtworkOnly];
    }

    collectionView = [[UICollectionView alloc] initWithFrame:CGRectZero collectionViewLayout:self.activeModule.moduleLayout];
    return collectionView;
}

- (void)setCollectionView:(UICollectionView *)collectionView
{
    _collectionView = collectionView;
    if (self.activeModule) {
        [self.collectionView registerClass:self.activeModule.classForCell
                forCellWithReuseIdentifier:NSStringFromClass(self.activeModule.classForCell)];
        self.collectionView.collectionViewLayout = self.activeModule.moduleLayout;
    }
}

- (void)setActiveModule:(ARModelCollectionViewModule *)activeModule
{
    if (self.collectionView && activeModule) {
        // Must be done in this order, otherwise inexplicable crashes happen inside Apple code.
        self.collectionView.collectionViewLayout = activeModule.moduleLayout;
        [self.collectionView registerClass:activeModule.classForCell
                forCellWithReuseIdentifier:NSStringFromClass(activeModule.classForCell)];
        _activeModule = activeModule;
        [self.collectionView reloadData];
        [self.collectionView layoutIfNeeded];
    } else {
        _activeModule = activeModule;
    }
}

- (BOOL)currentContentFillsView
{
    if (self.collectionView.contentSize.height < self.collectionView.bounds.size.height) {
        return NO;
    }

    if (self.collectionView.contentSize.width < self.collectionView.bounds.size.width) {
        return NO;
    }

    return YES;
}

#pragma mark - Sizing

- (CGSize)preferredContentSize
{
    return [self.activeModule intrinsicSize];
}

#pragma mark - Reloading

- (NSArray *)items
{
    return [self.activeModule items];
}

- (void)resetItems
{
    if (!self && !self.collectionView) {
        return;
    }

    self.activeModule.items = @[];
    [self.collectionView reloadData];

    [self postItemChangeCleanup];
}

- (void)appendItems:(NSArray *)items
{
    if ((!self && !self.collectionView) || items.count == 0) {
        return;
    }

    self.activeModule.items = [self.activeModule.items arrayByAddingObjectsFromArray:items];
    [self.collectionView reloadData];

    // This can crash when you have hundreds of works, but is the right way to do it
    // TODO: Figure this out

    //    NSInteger artworkCount = [self collectionView:self.collectionView numberOfItemsInSection:0];
    //
    //    NSInteger start = artworkCount - artworks.count - 1;
    //    NSMutableArray *indexPaths = [NSMutableArray array];
    //
    //    for (NSInteger i = 0; i < artworks.count; i++) {
    //        NSIndexPath *path = [NSIndexPath indexPathForItem:start + i inSection:0];
    //        [indexPaths addObject:path];
    //    }
    //
    //    if (self.collectionView.scrollEnabled) {
    //        [CATransaction begin];
    //        [CATransaction setValue:(id)kCFBooleanTrue forKey:kCATransactionDisableActions];
    //    }
    //
    //    [self.collectionView insertItemsAtIndexPaths:indexPaths];
    //
    //    if (self.collectionView.scrollEnabled) {
    //        [CATransaction commit];
    //    }

    [self postItemChangeCleanup];
}

// Actions that need to be performed after updating our active module's items.
- (void)postItemChangeCleanup
{
    [self updateViewConstraints];
    [self.view.superview setNeedsUpdateConstraints];
}

- (void)setConstrainHeightAutomatically:(BOOL)constrainHeightAutomatically
{
    _constrainHeightAutomatically = constrainHeightAutomatically;

    if (constrainHeightAutomatically) {
        self.heightConstraint = [self.view constrainHeight:@"260"];
        self.collectionView.scrollEnabled = NO;
    } else {
        [self.view removeConstraint:self.heightConstraint];
        self.collectionView.scrollEnabled = YES;
        [self.view setNeedsUpdateConstraints];
    }
}

- (void)updateViewConstraints
{
    [super updateViewConstraints];

    if (self.heightConstraint) {
        self.heightConstraint.constant = self.activeModule.intrinsicSize.height;
    }
}

- (void)setHeaderHeight:(CGFloat)headerHeight
{
    _headerHeight = headerHeight;
    [self.collectionView.collectionViewLayout invalidateLayout];
}

- (void)setStickyHeaderHeight:(CGFloat)stickyHeaderHeight
{
    _stickyHeaderHeight = stickyHeaderHeight;
    [self.collectionView.collectionViewLayout invalidateLayout];
}


#pragma mark - UIScrollViewDelegate methods

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    if (self.scrollDelegate && [self.scrollDelegate respondsToSelector:@selector(scrollViewDidScroll:)]) {
        [self.scrollDelegate scrollViewDidScroll:scrollView];
    }

    if (self.delegate && (scrollView.contentSize.height - scrollView.contentOffset.y) < scrollView.bounds.size.height) {
        if ([self.delegate respondsToSelector:@selector(embeddedModelsViewControllerDidScrollPastEdge:)]) {
            [self.delegate embeddedModelsViewControllerDidScrollPastEdge:self];
        }
    }

    if (_delegate && (scrollView.contentSize.width - scrollView.contentOffset.x) < scrollView.bounds.size.width) {
        if ([self.delegate respondsToSelector:@selector(embeddedModelsViewControllerDidScrollPastEdge:)]) {
            [self.delegate embeddedModelsViewControllerDidScrollPastEdge:self];
        }
    }
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{
    SEL scrollViewWillEndDraggingSelector = @selector(scrollViewWillEndDragging:withVelocity:targetContentOffset:);
    if (self.activeModule && [self.activeModule respondsToSelector:scrollViewWillEndDraggingSelector]) {
        [self.activeModule scrollViewWillEndDragging:scrollView withVelocity:velocity targetContentOffset:targetContentOffset];
    }

    if (self.scrollDelegate && [self.scrollDelegate respondsToSelector:scrollViewWillEndDraggingSelector]) {
        [self.scrollDelegate scrollViewWillEndDragging:scrollView withVelocity:velocity targetContentOffset:targetContentOffset];
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
    if ([self.scrollDelegate respondsToSelector:@selector(scrollViewDidEndDecelerating:)]) {
        [self.scrollDelegate scrollViewDidEndDecelerating:scrollView];
    }
}

#pragma mark - UICollectionViewDelegate methods

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    [self.delegate embeddedModelsViewController:self didTapItemAtIndex:indexPath.row];
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView
{
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return self.items.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    id cell = [collectionView dequeueReusableCellWithReuseIdentifier:NSStringFromClass(self.activeModule.classForCell) forIndexPath:indexPath];
    id item = self.items[indexPath.row];

    if ([cell respondsToSelector:@selector(setImageSize:)]) {
        [cell setImageSize:self.activeModule.imageSize];
    }

    if ([cell respondsToSelector:@selector(setupWithRepresentedObject:)]) {
        [cell setupWithRepresentedObject:item];

    } else {
        ARErrorLog(@"Could not set up cell %@", cell);
    }

    return cell;
}

#pragma mark ARCollectionViewDelegateFlowLayout

- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath
{
    if ([kind isEqualToString:UICollectionElementKindSectionHeader]) {
        UICollectionReusableView *view = [collectionView dequeueReusableSupplementaryViewOfKind:kind withReuseIdentifier:kind forIndexPath:indexPath];
        if (view.subviews.count == 0) {
            [view addSubview:self.headerView];
            [self.headerView alignTopEdgeWithView:view predicate:@"0"];
            [self.headerView alignLeading:@"0" trailing:@"0" toView:view];
        }
        return view;

    } else if ([kind isEqualToString:UICollectionElementKindSectionFooter]) {
        UICollectionReusableView *view = [collectionView dequeueReusableSupplementaryViewOfKind:kind withReuseIdentifier:kind forIndexPath:indexPath];
        if (view.subviews.count == 0) {
            ARReusableLoadingView *loadingView = [[ARReusableLoadingView alloc] init];
            [view addSubview:loadingView];
            [loadingView startIndeterminateAnimated:ARPerformWorkAsynchronously];
            [loadingView alignTopEdgeWithView:view predicate:@"0"];
            [loadingView alignLeading:@"0" trailing:@"0" toView:view];
        }
        return view;

    } else if ([kind isEqualToString:ARCollectionElementKindSectionStickyHeader]) {
        UICollectionReusableView *view = [collectionView dequeueReusableSupplementaryViewOfKind:kind withReuseIdentifier:kind forIndexPath:indexPath];
        if (view.subviews.count == 0) {
            [view addSubview:self.stickyHeaderView];
            [self.stickyHeaderView alignTopEdgeWithView:view predicate:@"0"];
            [self.stickyHeaderView alignLeading:@"0" trailing:@"0" toView:view];
        }
        return view;
    }

    NSAssert(NO, @"Should not be able to get here");
    return [UICollectionReusableView new];
}

- (void)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout stickyHeaderHasChangedStickyness:(BOOL)isAttachedToLeadingEdge
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(embeddedModelsViewController:stickyHeaderDidChangeStickyness:)]) {
        [self.delegate embeddedModelsViewController:self stickyHeaderDidChangeStickyness:isAttachedToLeadingEdge];
    }
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout referenceSizeForStickyHeaderInSection:(NSInteger)section
{
    return self.stickyHeaderView ? CGSizeMake(CGRectGetWidth(self.collectionView.bounds), self.stickyHeaderHeight) : CGSizeZero;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout referenceSizeForHeaderInSection:(NSInteger)section
{
    return self.headerView ? CGSizeMake(CGRectGetWidth(self.collectionView.bounds), self.headerHeight) : CGSizeZero;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout referenceSizeForFooterInSection:(NSInteger)section
{
    return self.showTrailingLoadingIndicator ? CGSizeMake(CGRectGetWidth(self.collectionView.bounds), 44) : CGSizeZero;
}

#pragma mark ARCollectionViewMasonryLayoutDelegate Methods

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(ARCollectionViewMasonryLayout *)collectionViewLayout variableDimensionForItemAtIndexPath:(NSIndexPath *)indexPath
{
    if ([self.activeModule conformsToProtocol:@protocol(ARCollectionViewMasonryLayoutDelegate)]) {
        return [(id<ARCollectionViewMasonryLayoutDelegate>)self.activeModule collectionView:collectionView layout:collectionViewLayout variableDimensionForItemAtIndexPath:indexPath];
    } else {
        return 0;
    }
}

@end
