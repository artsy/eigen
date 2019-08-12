#import "ARViewInRoomTransition.h"

#import "Artwork.h"
#import "ARViewInRoomViewController.h"
#import "ARArtworkViewController.h"
#import "ARFeedImageLoader.h"
#import "ARArtworkViewController.h"


@implementation ARViewInRoomTransition

- (NSTimeInterval)transitionDuration:(id<UIViewControllerContextTransitioning>)transitionContext
{
    return 0.38;
}

- (void)pushTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
    ARArtworkViewController *artworkController = (id)fromVC;
    ARViewInRoomViewController *virController = (id)toVC;

    NSAssert([artworkController isKindOfClass:[ARArtworkViewController class]], @"FromVC is not an ArtworkVC");
    NSAssert([virController isKindOfClass:[ARViewInRoomViewController class]], @"ToVC is not a ViewInRoomVC");

    // The Push plan:
    //  Create a new Artwork Imageview on the container's view
    //  Set its size to be the size of the original artwork
    //  Add the VIRVC behind the artwork at 0 alpha
    //  Simultaneously fade in the VIR and move the artwork to the VIR's correct position

    UIView *originalArtworkImageView = artworkController.imageView;
    Artwork *artwork = artworkController.artwork;
    CGRect endFrame = [transitionContext containerView].bounds;

    // Take into account the scrolling on the artwork view
    CGRect originalPositionFrame = originalArtworkImageView.frame;
    originalPositionFrame.origin.y -= artworkController.imageViewOffset.y;

    // Create a new UIImageView that sits on the container View
    // grab its image from either the imageView or the ZoomImage's background image

    UIImageView *artworkImageView = [ARViewInRoomViewController imageViewForFramedArtwork];
    artworkImageView.frame = originalPositionFrame;
    artworkImageView.image = [(UIImageView *)originalArtworkImageView image];

    if (!artworkImageView.image) {
        [[ARFeedImageLoader alloc] loadImageAtAddress:[artwork baseImageURL] desiredSize:ARFeedItemImageSizeLarge
                                         forImageView:artworkImageView
                                    customPlaceholder:nil];
    }

    // Add the controllers
    [transitionContext.containerView addSubview:artworkController.view];
    [transitionContext.containerView addSubview:virController.view];

    // Add the artwork above on the container, we can't move it to the
    // VIR view here cause it'd be faded in.
    [transitionContext.containerView addSubview:artworkImageView];

    // Hide the original so the resize animation works
    originalArtworkImageView.hidden = YES;

    // Put the VIR above the artwork view and make hidden
    virController.view.alpha = 0;
    virController.view.frame = [transitionContext containerView].bounds;

    [UIView animateWithDuration:[self transitionDuration:transitionContext]  delay:0 usingSpringWithDamping:0.8 initialSpringVelocity:0.8 options:0 animations:^{

        artworkImageView.frame = [ARViewInRoomViewController rectForImageViewWithArtwork:artwork withContainerFrame:endFrame];

    } completion:^(BOOL finished) {
        [artworkImageView removeFromSuperview];
        virController.artworkImageView = artworkImageView;

        [transitionContext completeTransition:YES];
    }];

    [UIView animateWithDuration:[self transitionDuration:transitionContext] * .66 delay:0.0 options:UIViewAnimationOptionCurveEaseOut animations:^{

        virController.view.alpha = 1;

    } completion:nil];


    CABasicAnimation *anim = [CABasicAnimation animationWithKeyPath:@"shadowOpacity"];
    anim.fromValue = [NSNumber numberWithFloat:0.0];
    anim.toValue = [NSNumber numberWithFloat:0.3];
    anim.duration = [self transitionDuration:transitionContext];
    [artworkImageView.layer addAnimation:anim forKey:@"shadowOpacity"];
    artworkImageView.layer.shadowOpacity = 0.3;
}

- (void)popTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
    ARArtworkViewController *artworkController = (id)toVC;
    ARViewInRoomViewController *virController = (id)fromVC;

    NSAssert([artworkController isKindOfClass:[ARArtworkViewController class]], @"FromVC is not an ArtworkVC");
    NSAssert([virController isKindOfClass:[ARViewInRoomViewController class]], @"ToVC is not a ViewInRoomVC");

    // The Pop plan:
    //  Create a new Artwork Imageview on the container's view
    //  Set its size to be the size of the VIR artwork
    //  Add the ArtworkView behind the VIRView at 0 alpha
    //  Simultaneously fade out the VIR and move the artwork to the Artwork View's correct position

    UIView *originalArtworkImageView = artworkController.imageView;
    UIImageView *originalVIRImageView = virController.artworkImageView;
    Artwork *artwork = artworkController.artwork;

    // Take into account the scrolling on the artwork view
    CGRect originalPositionFrame = originalArtworkImageView.frame;
    originalPositionFrame.origin.y -= artworkController.imageViewOffset.y;

    // Create a new UIImageView that sits on the container View
    // grab its image from either the imageView or the ZoomImage's background image
    // start it's position at the VIR size

    CGRect initialFrame = originalVIRImageView.frame;

    UIImageView *artworkImageView = [[UIImageView alloc] initWithFrame:initialFrame];
    artworkImageView.contentMode = UIViewContentModeScaleAspectFit;
    artworkImageView.image = [(UIImageView *)originalArtworkImageView image];

    // Just incase there's nothing, do it async
    if (!artworkImageView.image) {
        [[ARFeedImageLoader alloc] loadImageAtAddress:[artwork baseImageURL] desiredSize:ARFeedItemImageSizeLarge
                                         forImageView:artworkImageView
                                    customPlaceholder:nil];
    }

    // Add a shadow to the artwork image
    CALayer *layer = [artworkImageView layer];
    layer.shadowOffset = CGSizeMake(0, 4);
    layer.shadowOpacity = 1;
    layer.shadowColor = [[UIColor blackColor] CGColor];

    // Add the controllers
    [transitionContext.containerView addSubview:artworkController.view];
    [transitionContext.containerView addSubview:virController.view];

    // Add the artwork above on the container, we can't move it to the
    // VIR view here cause it'd be faded in.
    [transitionContext.containerView addSubview:artworkImageView];
    originalVIRImageView.hidden = YES;

    // Hide the original so the resize animation works
    originalArtworkImageView.hidden = YES;

    // Put the VIR above the artwork view and make hidden
    virController.view.alpha = 1;
    virController.view.frame = [transitionContext containerView].bounds;

    [UIView animateWithDuration:[self transitionDuration:transitionContext]  delay:0 usingSpringWithDamping:0.8 initialSpringVelocity:0.8 options:0 animations:^{

        artworkImageView.frame = originalPositionFrame;
        virController.view.alpha = 0;

    } completion:^(BOOL finished) {
        originalVIRImageView.hidden = NO;
        originalArtworkImageView.hidden = NO;
        [artworkImageView removeFromSuperview];

        [transitionContext completeTransition:YES];

        // Ensure the artwork VC is properly layed out to work around the issue described here:
        // https://github.com/artsy/eigen/issues/507
        [artworkController.navigationController.view setNeedsLayout];
        [artworkController.navigationController.view layoutIfNeeded];
    }];

    CABasicAnimation *anim = [CABasicAnimation animationWithKeyPath:@"shadowOpacity"];
    anim.fromValue = [NSNumber numberWithFloat:0.3];
    anim.toValue = [NSNumber numberWithFloat:0.0];
    anim.duration = [self transitionDuration:transitionContext];
    [artworkImageView.layer addAnimation:anim forKey:@"shadowOpacity"];
    artworkImageView.layer.shadowOpacity = 0.0;
}

@end
