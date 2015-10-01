#import "AREmbeddedModelsPreviewDelegate.h"
#import "AREmbeddedModelsViewController.h"
#import "AREmbeddedModelPreviewViewController.h"
#import "ARSwitchBoard.h"
#import "ARTopMenuViewController.h"
#import "ARSpotlight.h"


@interface AREmbeddedModelsPreviewDelegate ()
// Parent holds it
@property (nonatomic, weak, readonly) AREmbeddedModelsViewController *modelVC;
@end


@implementation AREmbeddedModelsPreviewDelegate

- (instancetype)initWithModelVC:(AREmbeddedModelsViewController *)modelVC;
{
    self = [super init];
    if (!self) {
        return nil;
    }
    _modelVC = modelVC;
    return self;
}

- (nullable UIViewController *)previewingContext:(id<UIViewControllerPreviewing>)previewingContext viewControllerForLocation:(CGPoint)location
{
    UICollectionView *collectionView = self.modelVC.collectionView;
    CGPoint locationOnWindow = [collectionView convertPoint:location fromView:nil];
    NSIndexPath *index = [collectionView indexPathForItemAtPoint:locationOnWindow];
    UICollectionViewCell *cell = [collectionView cellForItemAtIndexPath:index];
    if (!cell) {
        return nil;
    }

    // Only show visible content, e.g. cropped images by tabs
    ARTopMenuViewController *topVC = [ARTopMenuViewController sharedController];
    CGRect visible = CGRectIntersection([cell convertRect:cell.bounds toView:nil], [topVC.tabContentView convertRect:topVC.tabContentView.bounds toView:nil]);
    previewingContext.sourceRect = visible;

    id object = [self.modelVC.items objectAtIndex:index.row];
    AREmbeddedModelPreviewViewController *embed = [[AREmbeddedModelPreviewViewController alloc] initWithObject:object];
    [embed updateWithCell:cell];

    return embed;
}

- (void)previewingContext:(id<UIViewControllerPreviewing>)previewingContext commitViewController:(AREmbeddedModelPreviewViewController *)viewControllerToCommit
{
    id object = viewControllerToCommit.object;
    id viewController = nil;
    ARSwitchBoard *switchBoard = [ARSwitchBoard sharedInstance];

    if ([object isKindOfClass:Artwork.class]) {
        NSArray *items = self.modelVC.items;

        // TODO: Check for Fair context?
        NSInteger index = [items indexOfObject:object];
        viewController = [switchBoard loadArtworkSet:items inFair:nil atIndex:index];

    } else if ([object isKindOfClass:Artist.class]) {
        viewController = [switchBoard loadArtistWithID:[object artistID]];
    } else if ([object isKindOfClass:Gene.class]) {
        viewController = [switchBoard loadGene:object];
    }

    if (viewController) {
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
    } else {
        if ([object respondsToSelector:@selector(publicArtsyPath)]) {
            [switchBoard loadPath:[object publicArtsyPath]];
        }
    }
}

@end
