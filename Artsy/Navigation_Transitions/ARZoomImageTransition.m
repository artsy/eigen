// An interesting article on catiledlayers
// http://red-glasses.com/index.php/tutorials/catiledlayer-how-to-use-it-how-it-works-what-it-does/

#import "ARZoomImageTransition.h"
#import "ARZoomArtworkImageViewController.h"
#import "ARArtworkViewController.h"
#import "ARArtworkViewController.h"
#import "ARDispatchManager.h"


@implementation ARZoomImageTransition

- (NSTimeInterval)transitionDuration:(id<UIViewControllerContextTransitioning>)transitionContext
{
    return 0.2;
}

- (void)pushTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
    ARArtworkViewController *artworkController = (id)fromVC;
    ARZoomArtworkImageViewController *zoomController = (id)toVC;

    NSAssert([artworkController isKindOfClass:[ARArtworkViewController class]], @"FromVC is not an ArtworkVC");
    NSAssert([zoomController isKindOfClass:[ARZoomArtworkImageViewController class]], @"ToVC is not a ViewInRoomVC");

    // Add the controllers, the zoom controller is clear, so adding it will show nothing
    [transitionContext.containerView addSubview:artworkController.view];
    [transitionContext.containerView addSubview:zoomController.view];
    zoomController.view.frame = [transitionContext containerView].bounds;

    UIImageView *originalArtworkImageView = (id)artworkController.imageView;

    CGRect endFrame = [transitionContext containerView].bounds;
    CGRect originalPositionFrame = [originalArtworkImageView convertRect:originalArtworkImageView.bounds toView:transitionContext.containerView];

    // create a zoom view, and set it to be above the preview image view
    ARZoomView *artworkImageView = [[ARZoomView alloc] initWithImage:zoomController.image frame:endFrame];
    artworkImageView.backgroundImage = originalArtworkImageView.image;
    [artworkImageView setMaxMinZoomScalesForSize:originalPositionFrame.size];
    artworkImageView.zoomScale = artworkImageView.minimumZoomScale;
    artworkImageView.contentOffset = CGPointMake(-originalPositionFrame.origin.x, -originalPositionFrame.origin.y);

    originalArtworkImageView.alpha = 0;

    // Add the zoom view on top of the zoom controller
    [transitionContext.containerView addSubview:artworkImageView];

    [artworkImageView setMaxMinZoomScalesForCurrentFrame];

    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
        CGFloat zoomScale = [artworkImageView scaleForFullScreenZoomInSize:endFrame.size];
        CGPoint targetContentOffset = [artworkImageView centerContentOffsetForZoomScale:zoomScale];
        [artworkImageView performBlockWhileIgnoringContentOffsetChanges:^{
            artworkImageView.zoomScale = zoomScale;
        }];
        artworkImageView.contentOffset = targetContentOffset;
    } completion:^(BOOL finished) {

        // remove from animation context
        [artworkImageView removeFromSuperview];

        // let the zoom view have it
        zoomController.zoomView = artworkImageView;

        [transitionContext completeTransition:YES];
    }];
}

- (void)popTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
    ARArtworkViewController *artworkController = (id)toVC;
    ARZoomArtworkImageViewController *zoomController = (id)fromVC;

    NSAssert([artworkController isKindOfClass:[ARArtworkViewController class]], @"ToVC is not an ArtworkVC");
    NSAssert([zoomController isKindOfClass:[ARZoomArtworkImageViewController class]], @"FromVC is not a ViewInRoomVC");

    // Add the controllers, the zoom controller is clear, so adding it will show nothing
    [transitionContext.containerView addSubview:artworkController.view];
    [transitionContext.containerView addSubview:zoomController.view];

    [artworkController.view setNeedsLayout];

    // We need to give the artworkViewController a chance to lay its view out.
    // Otherwise, convertRect:toView: will return values with respect to a possibly stale layout.
    ar_dispatch_main_queue(^{
        ARZoomView *artworkImageView = zoomController.zoomView;
        [zoomController unconstrainZoomView];

        artworkController.view.frame = [transitionContext containerView].bounds;
        zoomController.view.frame = [transitionContext containerView].bounds;

        // Get the position to move the zoom view into
        UIView *originalArtworkImageView = artworkController.imageView;

        CGRect originalPositionFrame = [originalArtworkImageView convertRect:originalArtworkImageView.bounds toView:transitionContext.containerView];

        [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
            CGPoint targetContentOffset = CGPointMake(-originalPositionFrame.origin.x, -originalPositionFrame.origin.y);
            [artworkImageView setMaxMinZoomScalesForSize:originalPositionFrame.size];
            [artworkImageView performBlockWhileIgnoringContentOffsetChanges:^{
                artworkImageView.zoomScale = artworkImageView.minimumZoomScale;
            }];
            artworkImageView.contentOffset = targetContentOffset;
        } completion:^(BOOL finished) {

            // previously the artwork was hidden
            originalArtworkImageView.alpha = 1;
            [zoomController.zoomView removeZoomViewForTransition];
            [zoomController.view removeFromSuperview];

            [transitionContext completeTransition:YES];
        }];
    });
}

@end
