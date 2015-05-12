#import "ARArtworkViewController.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARArtworkRelatedArtworksView.h"
#import "ARArtworkBlurbView.h"
#import "ARArtworkMetadataView.h"
#import "ARPostsViewController.h"
#import "ARArtworkView.h"
#import "ARArtworkViewController+ButtonActions.h"

@interface ARArtworkViewController() <UIScrollViewDelegate, ARArtworkRelatedArtworksViewParentViewController, ARArtworkBlurbViewDelegate, ARArtworkMetadataViewDelegate, ARPostsViewControllerDelegate>

@property (nonatomic, strong) ARArtworkView *view;
@property (nonatomic, strong, readonly) ARPostsViewController *postsVC;
@end

@implementation ARArtworkViewController

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

- (instancetype)init
{
    self = [super init];
    if (!self) { return nil; }
    _shouldAnimate = YES;
    return self;
}

- (instancetype)initWithArtworkID:(NSString *)artworkID fair:(Fair *)fair
{
    Artwork *artwork = [[Artwork alloc] initWithArtworkID:artworkID];
    return [self initWithArtwork:artwork fair:fair];
}

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair
{
    self = [self init];
    if (!self) { return nil; }

    _artwork = artwork;
    _fair = fair;

    return self;
}

- (void)loadView
{
    self.view = [[ARArtworkView alloc] initWithArtwork:self.artwork fair:self.fair andParentViewController:self];
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
    if (self.artwork.title == nil){
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
    }

    @weakify(self); 

    void (^completion)(void) = ^{
        @strongify(self);
        [self ar_removeIndeterminateLoadingIndicatorAnimated:self.shouldAnimate];
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

- (void)viewDidAppear:(BOOL)animated
{
    // When we get back from zoom / VIR allow the preview to do trigger zoom
    self.view.metadataView.userInteractionEnabled = YES;
    [super viewDidAppear:self.shouldAnimate && animated];
    CGRect frame = self.view.frame;
    [self.view.metadataView updateConstraintsIsLandscape:CGRectGetWidth(frame) > CGRectGetHeight(frame)];
}

- (void)viewDidDisappear:(BOOL)animated
{
    self.view.scrollsToTop = NO;
    [self.view.relatedArtworksView cancelRequests];
    [super viewDidDisappear:self.shouldAnimate && animated];
}

- (void)setHasFinishedScrolling
{
    // Get the full artwork details once scroll is settled.
    // This is only called on the primary artwork view
    self.view.scrollsToTop = YES;

    [self.artwork updateArtwork];
    [self.artwork updateSaleArtwork];
    [self.artwork updateFair];
    [self.artwork updatePartnerShow];
    [self.view.relatedArtworksView updateWithArtwork:self.artwork];
    if (!self.postsVC.posts.count){
        [self getRelatedPosts];
    }
}

- (void)getRelatedPosts
{
    @weakify(self);
    [self.artwork getRelatedPosts:^(NSArray *posts) {
        @strongify(self);
        [self updateWithRelatedPosts:posts];
    }];
}

- (void)updateWithRelatedPosts:(NSArray *)posts
{
    if (posts.count > 0) {
        self.postsVC.posts = posts;
        [UIView animateIf:self.shouldAnimate duration:ARAnimationDuration :^{
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

#pragma mark - ScrollView delegate methods

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
}

#pragma mark - VIR / Zoom Transition

- (CGPoint)imageViewOffset
{
    return (CGPoint){ 0, [self.view contentOffset].y };
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
}

- (NSUInteger)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

#pragma mark - ARArtworkBlurViewDelegate

-(void)artworkBlurView:(ARArtworkBlurbView *)blurbView shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

#pragma mark - ARArtworkMetadataViewDelegate

-(void)artworkMetadataView:(ARArtworkMetadataView *)metadataView shouldPresentViewController:(UIViewController *)viewController {
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

- (void)artworkMetadataView:(ARArtworkMetadataView *)metadataView didUpdateArtworkDetailView:(id)detailView
{
    [self.view.stackView setNeedsLayout];
    [self.view.stackView layoutIfNeeded];
}

- (void)artworkMetadataView:(ARArtworkMetadataView *)metadataView didUpdateArtworkActionsView:(ARArtworkActionsView *)actionsView
{
    [metadataView layoutIfNeeded];

    [UIView animateTwoStepIf:self.shouldAnimate
        duration:ARAnimationDuration * 2 :^{
            [self.view.stackView layoutIfNeeded];
        } midway:^{
            actionsView.alpha = 1;
        } completion:nil];
}

#pragma mark - ARPostsViewControllerDelegate

-(void)postViewController:(ARPostsViewController *)postViewController shouldShowViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

#pragma mark - ARArtworkRelatedArtworksViewParentViewController

- (void)relatedArtworksView:(ARArtworkRelatedArtworksView *)view shouldShowViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:self.shouldAnimate];
}

- (void)relatedArtworksView:(ARArtworkRelatedArtworksView *)view didAddSection:(UIView *)section;
{
    section.alpha = 0;
    [UIView animateTwoStepIf:self.shouldAnimate
        duration:ARAnimationDuration * 2 :^{
            [self.view.stackView setNeedsLayout];
            [self.view.stackView layoutIfNeeded];
        } midway:^{
            section.alpha = 1;
            [self.view flashScrollIndicators];
        } completion:nil];
}

@end
