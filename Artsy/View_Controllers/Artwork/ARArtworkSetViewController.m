#import "Artwork.h"
#import "ARArtworkSetViewController.h"
#import "ARViewInRoomViewController.h"
#import "ARArtworkViewController.h"
#import "ARTopMenuViewController.h"

#import <ARAnalytics/ARAnalytics.h>

#import "UIDevice-Hardware.h"

@interface ARArtworkSetViewController () <ARMenuAwareViewController>

@property (nonatomic, strong) Fair *fair;
@property (nonatomic, strong) NSArray<Artwork *> *artworks;
@property (nonatomic, assign) NSInteger index;

@end


@implementation ARArtworkSetViewController

- (instancetype)initWithArtworkID:(NSString *)artworkID
{
    return [self initWithArtworkID:artworkID fair:nil];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID fair:(Fair *)fair
{
    Artwork *artwork = [[Artwork alloc] initWithArtworkID:artworkID];
    return [self initWithArtwork:artwork fair:fair];
}

- (instancetype)initWithArtwork:(Artwork *)artwork
{
    return [self initWithArtwork:artwork fair:nil];
}

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair
{
    return [self initWithArtworkSet:@[ artwork ] fair:fair];
}

- (instancetype)initWithArtworkSet:(NSArray<Artwork *> *)artworkSet
{
    return [self initWithArtworkSet:artworkSet fair:nil atIndex:0];
}

- (instancetype)initWithArtworkSet:(NSArray<Artwork *> *)artworkSet fair:(Fair *)fair
{
    return [self initWithArtworkSet:artworkSet fair:fair atIndex:0];
}

- (instancetype)initWithArtworkSet:(NSArray<Artwork *> *)artworkSet atIndex:(NSInteger)index
{
    return [self initWithArtworkSet:artworkSet fair:nil atIndex:index];
}

- (instancetype)initWithArtworkSet:(NSArray<Artwork *> *)artworkSet fair:(Fair *)fair atIndex:(NSInteger)index
{
    self = [super initWithTransitionStyle:UIPageViewControllerTransitionStyleScroll navigationOrientation:UIPageViewControllerNavigationOrientationHorizontal options:nil];

    if (!self) {
        return nil;
    }

    _fair = fair;
    _artworks = artworkSet;
    _index = [self isValidArtworkIndex:index] ? index : 0;

    self.delegate = self;
    self.dataSource = self;
    self.automaticallyAdjustsScrollViewInsets = NO;

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    ARArtworkViewController *artworkVC = [self viewControllerForIndex:self.index];
    [self setViewControllers:@[ artworkVC ] direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
}

- (BOOL)isValidArtworkIndex:(NSInteger)index
{
    if (index < 0 || index >= self.artworks.count) {
        return NO;
    }
    return YES;
}

- (void)viewWillTransitionToSize:(CGSize)newSize withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:newSize withTransitionCoordinator:coordinator];
    BOOL landscape = newSize.width > newSize.height;
    Artwork *artwork = self.currentArtworkViewController.artwork;

    BOOL isTopViewController = self.navigationController.topViewController == self;
    BOOL isShowingModalViewController = [ARTopMenuViewController sharedController].presentedViewController != nil;
    BOOL canShowInRoom = self.currentArtworkViewController.artwork.canViewInRoom;

    if (![UIDevice isPad] && canShowInRoom && !isShowingModalViewController && isTopViewController) {
        if (landscape) {
            ARViewInRoomViewController *viewInRoomVC = [[ARViewInRoomViewController alloc] initWithArtwork:artwork];
            viewInRoomVC.popOnRotation = YES;
            viewInRoomVC.rotationDelegate = self;

            [self.navigationController pushViewController:viewInRoomVC animated:YES];
        }
    }

    if (![UIDevice isPad]) {
        // TODO Why is this needed at all?
        self.view.bounds = (CGRect){ CGPointZero, newSize };
    }
}

- (ARArtworkViewController *)viewControllerForIndex:(NSInteger)index
{
    if (![self isValidArtworkIndex:index]) return nil;

    ARArtworkViewController *artworkViewController = [[ARArtworkViewController alloc] initWithArtwork:self.artworks[index] fair:self.fair];
    artworkViewController.index = index;

    return artworkViewController;
}

#pragma mark -
#pragma mark Page view controller data source

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(ARArtworkViewController *)viewController
{
    if (self.artworks.count == 1) {
        return nil;
    }

    NSInteger newIndex = viewController.index - 1;
    if (newIndex < 0) {
        newIndex = self.artworks.count - 1;
    }
    return [self viewControllerForIndex:newIndex];
}

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerAfterViewController:(ARArtworkViewController *)viewController
{
    if (self.artworks.count == 1) {
        return nil;
    }

    NSInteger newIndex = (viewController.index + 1) % self.artworks.count;
    return [self viewControllerForIndex:newIndex];
}

#pragma mark -
#pragma mark Page view controller delegate


- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    if (self.navigationController) {
        UIGestureRecognizer *gesture = self.navigationController.interactivePopGestureRecognizer;
        [self.pagingScrollView.panGestureRecognizer requireGestureRecognizerToFail:gesture];
    }

    [self.currentArtworkViewController setHasFinishedScrolling];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad] ? YES : self.currentArtworkViewController.artwork.canViewInRoom;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return UIInterfaceOrientationPortrait;
}

- (UIInterfaceOrientationMask)pageViewControllerSupportedInterfaceOrientations:(UIPageViewController *)pageViewController
{
    return [self supportedInterfaceOrientations];
}

- (void)pageViewController:(UIPageViewController *)pageViewController willTransitionToViewControllers:(NSArray *)pendingViewControllers
{
    ARArtworkViewController *destinationViewController = [pendingViewControllers firstObject];
    NSString *destinationArtworkID = destinationViewController.artwork.artworkID;

    [ARAnalytics event:@"artwork set swipe started" withProperties:@{
        @"origin artwork id": self.currentArtworkViewController.artwork.artworkID ?: @"",
        @"destination artwork id": destinationArtworkID ?: @""
    }];
}

- (void)pageViewController:(UIPageViewController *)pageViewController didFinishAnimating:(BOOL)finished previousViewControllers:(NSArray *)previousViewControllers transitionCompleted:(BOOL)completed;
{
    ARArtworkViewController *originViewController = [previousViewControllers firstObject];
    NSString *originArtworkID = originViewController.artwork.artworkID;

    [ARAnalytics event:@"artwork set swipe finished" withProperties:@{
        @"origin artwork id": originArtworkID ?: @"",
        @"destination artwork id": self.currentArtworkViewController.artwork.artworkID ?: @"",
        @"status": completed ? @"completed" : @"cancelled"
    }];
    if (completed) {
        [self.currentArtworkViewController setHasFinishedScrolling];
    }
}

- (UIScrollView *)pagingScrollView
{
    return self.view.subviews.firstObject;
}

- (ARArtworkViewController *)currentArtworkViewController
{
    return self.viewControllers.lastObject;
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.currentArtworkViewController.artwork) {
        return @{ @"artwork" : self.currentArtworkViewController.artwork.artworkID,
                  @"type" : @"artwork" };
    }

    return nil;
}

#pragma mark -
#pragma mark Menu aware controller

- (BOOL)hidesStatusBarBackground
{
    return NO;
}

@end
