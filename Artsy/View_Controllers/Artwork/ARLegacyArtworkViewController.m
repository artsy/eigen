#import "ARLegacyArtworkViewController.h"

#import "Artwork.h"
#import "ARSystemTime.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARArtworkViewController.h"
#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARArtworkRelatedArtworksView.h"
#import "ARArtworkBlurbView.h"
#import "ARArtworkMetadataView.h"
#import "ARPostsViewController.h"
#import "ARArtworkView.h"
#import "ArtsyEcho.h"
#import "ARArtworkViewController+ButtonActions.h"
#import "UIViewController+ARUserActivity.h"
#import "ARScrollNavigationChief.h"

#import "ArtsyAPI+Artworks.h"

#import "UIDevice-Hardware.h"

#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>


@interface ARLegacyArtworkViewController () <UIScrollViewDelegate, ARArtworkRelatedArtworksViewParentViewController, ARArtworkBlurbViewDelegate, ARPostsViewControllerDelegate>

@property (nonatomic, strong) ARArtworkView *view;
@property (nonatomic, strong, readonly) ARPostsViewController *postsVC;
@property (nonatomic, strong) NSTimer *updateInterfaceWhenAuctionChangesTimer;
@property (nonatomic, strong, readwrite) ArtsyEcho *echo;

@end


@implementation ARLegacyArtworkViewController

@dynamic view;

- (void)dealloc;
{
    if (self.isViewLoaded) {
        // See:
        // * https://github.com/artsy/eigen/issues/103
        // * https://github.com/artsy/eigen/pull/218#issuecomment-75958606
        self.view.delegate = nil;
        // And nill-ify these as well, for good measure.
        self.view.metadataView.delegate = nil;
        self.view.artworkBlurbView.delegate = nil;
        self.postsVC.delegate = nil;
    }
}

- (instancetype)initWithArtworkID:(NSString *)artworkID fair:(Fair *)fair
{
    Artwork *artwork = [[Artwork alloc] initWithArtworkID:artworkID];
    return [self initWithArtwork:artwork fair:fair];
}

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair
{
    self = [self init];
    if (!self) {
        return nil;
    }

    _artwork = artwork;
    _fair = fair;
    _echo = [[ArtsyEcho alloc] init];
    [_echo setup];

    [artwork onArtworkUpdate:^{
        [self artworkHasLoaded];
    } failure:^(NSError * _Nonnull error) {
        // NOOP as the above is only used for analytics purposes
    }];

    return self;
}

- (void)artworkHasLoaded
{
    // NOOP, used to hook analytics to work after the artwork has enough data to send BNMO info
}

- (void)loadView
{
    self.view = [[ARArtworkView alloc] initWithArtwork:self.artwork fair:self.fair echo:self.echo andParentViewController:self];
    self.view.delegate = self;
    self.view.metadataView.delegate = self;
    self.view.artworkBlurbView.delegate = self;
    self.view.relatedArtworksView.parentViewController = self;

    // Adding the posts view separately because we must add its View Controller to self.
    _postsVC = [[ARPostsViewController alloc] init];
    self.postsVC.view.tag = ARArtworkRelatedPosts;
    self.postsVC.delegate = self;
    self.postsVC.view.alpha = 0;
    [self.view.stackView addViewController:self.postsVC toParent:self withTopMargin:nil sideMargin:@"20"];
}

- (void)viewDidLoad
{
    if (self.artwork.title == nil) {
        [self ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
    }

    __weak typeof(self) wself = self;

    void (^completion)(void) = ^{
        __strong typeof (wself) sself = wself;
        [sself ar_removeIndeterminateLoadingIndicatorAnimated:ARPerformWorkAsynchronously];
        [sself ar_setDataLoaded];
    };

    [self.artwork onArtworkUpdate:^{
        completion();
    } failure:^(NSError *error) {
        completion();
    }];

    [super viewDidLoad];
}

- (UIImageView *)imageView
{
    return self.view.metadataView.imageView;
}

-(void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [ArtsyAPI recordViewingOfArtwork:self.artwork.artworkID success:nil failure:nil];
}

- (void)viewDidAppear:(BOOL)animated
{
    // When we get back from zoom / VIR allow the preview to do trigger zoom
    self.view.metadataView.userInteractionEnabled = YES;
    [super viewDidAppear:ARPerformWorkAsynchronously && animated];
    CGRect frame = self.view.frame;
    [self.view.metadataView updateConstraintsIsLandscape:CGRectGetWidth(frame) > CGRectGetHeight(frame)];

    self.ar_userActivityEntity = self.artwork;
}

- (void)viewWillDisappear:(BOOL)animated;
{
    [super viewWillDisappear:animated];
    [self.userActivity invalidate];
}

- (void)viewDidDisappear:(BOOL)animated
{
    self.view.scrollsToTop = NO;
    [self.view.relatedArtworksView cancelRequests];
    [super viewDidDisappear:ARPerformWorkAsynchronously && animated];
    [self.updateInterfaceWhenAuctionChangesTimer invalidate];
    self.updateInterfaceWhenAuctionChangesTimer = nil;
}

- (void)setHasFinishedScrolling
{
    // Get the full artwork details once scroll is settled.
    // This is only called on the primary artwork view
    self.view.scrollsToTop = YES;
    [self setupUI];
}

- (void)setupUI
{
    __weak ARLegacyArtworkViewController *weakSelf = self;
    [self.artwork updateArtwork];
    [self.artwork onSaleArtworkUpdate:^(SaleArtwork * _Nonnull saleArtwork) {
        [weakSelf startTimerForSaleArtwork:saleArtwork];
    } failure:nil allowCached:NO];
    [self.artwork updateSaleArtwork];
    [self.artwork updateFair];
    [self.artwork updatePartnerShow];
    [self.view.relatedArtworksView updateWithArtwork:self.artwork];
    if (!self.postsVC.posts.count) {
        [self getRelatedPosts];
    }
}

/// Reloads the artwork set view controller to fetch fresh content from the server.
/// Useful for artworks that are lots in auctions, to reload when the auction event begins or ends.
- (void)reloadUI
{
    ARArtworkViewController *newViewController = [[ARSwitchBoard sharedInstance] loadArtwork:self.artwork inFair:self.artwork.fair];
    // We need to fetch this upfront and cache in a local variable, since `self.navigationController` will be nil once we pop.
    UINavigationController *navigationController = self.navigationController;
    [navigationController popViewControllerAnimated:NO];
    [navigationController pushViewController:newViewController animated:NO];
}

- (void)getRelatedPosts
{
    __weak typeof(self) wself = self;
    [self.artwork getRelatedPosts:^(NSArray *posts) {
        __strong typeof (wself) sself = wself;
        [sself updateWithRelatedPosts:posts];
    }];
}

- (void)updateWithRelatedPosts:(NSArray *)posts
{
    if (posts.count > 0) {
        self.postsVC.posts = posts;
        [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration:^{
            self.postsVC.view.alpha = 1;
        }];
    } else {
        [self.view.stackView removeSubview:self.postsVC.view];
        _postsVC = nil;
    }
}

- (NSString *)inquiryURLRepresentation
{
    return [NSString stringWithFormat:@"http://artsy.net/artwork/%@", self.artwork.artworkID];
}

- (void)startTimerForSaleArtwork:(SaleArtwork *)saleArtwork
{
    if (saleArtwork.auction.uiDateOfInterest == nil) { return; }
    
    NSDate *now = [ARSystemTime date];
    NSTimeInterval interval = [saleArtwork.auction.uiDateOfInterest timeIntervalSinceDate:now];
    if (interval > 0) {
        self.updateInterfaceWhenAuctionChangesTimer = [NSTimer scheduledTimerWithTimeInterval:interval target:self selector:@selector(reloadUI) userInfo:nil repeats:NO];
    }
}

#pragma mark - ScrollView delegate methods

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
}

#pragma mark - VIR / Zoom Transition

- (CGPoint)imageViewOffset
{
    return (CGPoint){0, [self.view contentOffset].y};
}

#pragma mark - Tapping on buttons
#pragma mark Moved to ARArtworkViewController+ButtonActions.m

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

#pragma mark rotation

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];

    [self.view.metadataView updateConstraintsIsLandscape:size.width > size.height];

    // Capture the duration now, because the coordinator’s internal context will be gone by the time the animation
    // completion block is called *if* the transition is interrupted by the sign-in view controller being shown modally.
    //
    // See https://github.com/artsy/eigen/issues/494
    NSTimeInterval transitionDuration = coordinator.transitionDuration;

    self.view.metadataView.right.alpha = 1;
    [UIView animateWithDuration:.1 animations:^{
        self.view.metadataView.right.alpha = 0;
    } completion:^(BOOL finished) {
        [UIView animateWithDuration:.1 delay:transitionDuration-.2 options:0 animations:^{
            self.view.metadataView.right.alpha = 1;
        } completion:nil];
    }];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

#pragma mark - ARArtworkBlurViewDelegate

- (void)artworkBlurView:(ARArtworkBlurbView *)blurbView shouldPresentViewController:(UIViewController *)viewController
{
    [self.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

#pragma mark - ARArtworkDetailViewDelegate

- (void)artworkDetailView:(ARArtworkDetailView *)detailView shouldPresentViewController:(UIViewController *)viewController
{
    [self.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)didUpdateArtworkDetailView:(id)detailView
{
    [self.view.stackView setNeedsLayout];
    [self.view.stackView layoutIfNeeded];
}

#pragma mark - ARArtworkActionsViewDelefate

- (void)didUpdateArtworkActionsView:(ARArtworkActionsView *)actionsView
{
    [self.view.stackView layoutIfNeeded];
}

#pragma mark - ARPostsViewControllerDelegate

- (void)postViewController:(ARPostsViewController *)postViewController shouldShowViewController:(UIViewController *)viewController
{
    [self.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

#pragma mark - ARArtworkRelatedArtworksViewParentViewController

- (void)relatedArtworksView:(ARArtworkRelatedArtworksView *)view shouldShowViewController:(UIViewController *)viewController
{
    [self.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)relatedArtworksView:(ARArtworkRelatedArtworksView *)view didAddSection:(UIView *)section;
{
    [self.view.stackView setNeedsLayout];
    [self.view.stackView layoutIfNeeded];
}

@end
