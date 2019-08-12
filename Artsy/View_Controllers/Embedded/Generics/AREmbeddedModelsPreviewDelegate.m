#import "AREmbeddedModelsPreviewDelegate.h"

#import "Artist.h"
#import "Artwork.h"
#import "AREmbeddedModelsViewController.h"
#import "AREmbeddedModelPreviewViewController.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARSwitchboard+Eigen.h"
#import "ARTopMenuViewController.h"
#import "ARSpotlight.h"
#import "Gene.h"


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
    if (!cell || !cell.window) {
        return nil;
    }

    // Only show visible content, e.g. cropped images by tabs
    ARTopMenuViewController *topVC = [ARTopMenuViewController sharedController];
    CGRect visible = CGRectIntersection([cell convertRect:cell.bounds toView:nil], [topVC.tabContentView convertRect:topVC.tabContentView.bounds toView:nil]);
    previewingContext.sourceRect = visible;

    id object = [self.modelVC.items objectAtIndex:index.row];

    // TODO: Add peek support for Artists, Genes
    // Only Peek for artworks right now
    if (![object isKindOfClass:Artwork.class]) {
        return nil;
    }

    AREmbeddedModelPreviewViewController *embed = [[AREmbeddedModelPreviewViewController alloc] initWithObject:object];
    [embed updateWithCell:cell];

    return embed;
}

- (void)previewingContext:(id<UIViewControllerPreviewing>)previewingContext commitViewController:(AREmbeddedModelPreviewViewController *)viewControllerToCommit
{
    id object = viewControllerToCommit.object;
    id viewController = nil;
    ARSwitchBoard *switchBoard = ARSwitchBoard.sharedInstance;

    if ([object isKindOfClass:Artwork.class]) {
        viewController = [switchBoard loadArtwork:object inFair:nil];

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
