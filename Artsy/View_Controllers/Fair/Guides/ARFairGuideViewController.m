#import "ARFairGuideViewController.h"
#import "ARNavigationButtonsViewController.h"
#import "ARSwitchView.h"
#import "ARSwitchView+FairGuide.h"
#import "ORStackView+ArtsyViews.h"
#import "ARFairFavoritesNetworkModel.h"
#import "ARFonts.h"
#import "User.h"
#import "ARTheme.h"

#import "UIDevice-Hardware.h"

#import <ORStackView/ORTagBasedAutoStackView.h>
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

// Switch view width should be divisible by the number of items (in this case 3) for consistent rendering.
static CGFloat const ARFairGuideSwitchviewWidth = 279;

typedef NS_ENUM(NSInteger, ARFairGuideViewOrder) {
    ARFairGuideViewTitle,
    ARFairGuideViewSubtitle,
    ARFairGuideViewSignupForArtsyButton,
    ARFairGuideViewTabs,
    ARFairGuideViewNavigationSeparator,
    ARFairGuideViewNavigationButtons,
    ARFairGuideViewShowsToFollowTitle,
    ARFairGuideViewShowsToFollowSeparator,
    ARFairGuideViewShowsToFollow,
    ARFairGuideViewAllExhibitors,
    ARFairGuideViewWhitespace
};

@class User;


@interface ARFairGuideViewController () <ARSwitchViewDelegate, ARFairFavoritesNetworkModelDelegate>

@property (nonatomic, strong, readwrite) Fair *fair;

@property (nonatomic, strong) ARNavigationButtonsViewController *currentViewController;
@property (nonatomic, strong) ARNavigationButtonsViewController *workViewController;
@property (nonatomic, strong) ARNavigationButtonsViewController *exhibitorsViewController;
@property (nonatomic, strong) ARNavigationButtonsViewController *artistsViewController;
@property (nonatomic, strong) ARFairFavoritesNetworkModel *fairFavorites;
@property (nonatomic, assign, readwrite) ARFairGuideSelectedTab selectedTabIndex;

@property (nonatomic, strong) User *currentUser;
@end


@implementation ARFairGuideViewController

@dynamic view;

#pragma mark - Lifecycle

AR_VC_OVERRIDE_SUPER_DESIGNATED_INITIALIZERS;

- (instancetype)initWithFair:(Fair *)fair
{
    self = [super initWithNibName:nil bundle:nil];
    if (!self) {
        return nil;
    }

    self.fair = fair;

    // We'll set this later in viewDidLoad, triggering the overridden setter
    _selectedTabIndex = ARFairGuideSelectedTabUndefined;

    return self;
}

#pragma mark - UIViewController

- (void)loadView
{
    self.view = [[ORStackScrollView alloc] initWithStackViewClass:ORTagBasedAutoStackView.class];
    self.view.stackView.bottomMarginHeight = 15;
    self.view.showsVerticalScrollIndicator = YES;
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.alwaysBounceVertical = YES;
}

- (BOOL)shouldAutorotate
{
    return NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

#pragma mark - Overridden Properties

- (void)setSelectedTabIndex:(ARFairGuideSelectedTab)selectedTabIndex
{
    if (selectedTabIndex != _selectedTabIndex) {
        [self.currentViewController willMoveToParentViewController:nil];
        [self.currentViewController removeFromParentViewController];
        [self.view.stackView removeSubview:self.currentViewController.view];

        switch (selectedTabIndex) {
            case ARFairGuideSelectedTabUndefined:
                self.currentViewController = nil;
                break;
            case ARFairGuideSelectedTabExhibitors:
                self.currentViewController = self.exhibitorsViewController;
                break;
            case ARFairGuideSelectedTabArtists:
                self.currentViewController = self.artistsViewController;
                break;
            case ARFairGuideSelectedTabWork:
                self.currentViewController = self.workViewController;
                break;
        }

        [self.currentViewController willMoveToParentViewController:self];
        [self addChildViewController:self.currentViewController];
        [self.view.stackView addSubview:self.currentViewController.view withTopMargin:@"12" sideMargin:@"20"];
        [self.currentViewController didMoveToParentViewController:self];
    }

    _selectedTabIndex = selectedTabIndex;

    // Need to dispatch to the next invocation of the run loop so that the child VC
    // has a chance to set its content
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.delegate fairGuideViewControllerDidChangeTab:self];
    });
}

- (ARNavigationButtonsViewController *)workViewController
{
    if (!_workViewController) {
        _workViewController = [[ARNavigationButtonsViewController alloc] init];
        _workViewController.view.tag = ARFairGuideViewNavigationButtons;
    }

    return _workViewController;
}

- (ARNavigationButtonsViewController *)exhibitorsViewController
{
    if (!_exhibitorsViewController) {
        _exhibitorsViewController = [[ARNavigationButtonsViewController alloc] init];
        _exhibitorsViewController.view.tag = ARFairGuideViewNavigationButtons;
    }

    return _exhibitorsViewController;
}

- (ARNavigationButtonsViewController *)artistsViewController
{
    if (!_artistsViewController) {
        _artistsViewController = [[ARNavigationButtonsViewController alloc] init];
        _artistsViewController.view.tag = ARFairGuideViewNavigationButtons;
    }

    return _artistsViewController;
}

- (ARFairFavoritesNetworkModel *)fairFavorites
{
    // Lazy-loading property
    if (!_fairFavorites) {
        _fairFavorites = [[ARFairFavoritesNetworkModel alloc] init];
        _fairFavorites.delegate = self;
    }

    return _fairFavorites;
}

- (BOOL)contentIsOverstretched
{
    return self.view.contentSize.height < CGRectGetHeight(self.view.frame);
}

#pragma mark - Public Methods

- (void)fairDidLoad
{
    for (UIView *childView in [self.view.stackView.subviews copy]) {
        [self.view.stackView removeSubview:childView];
    }

    if (self.showTopBorder) {
        [self addTopBorder];
    }

    if (self.hasCurrentUser) {
        [self addPersonalLabel];
        [self addTabView];
        [self addUserContent];
    }

    self.selectedTabIndex = ARFairGuideSelectedTabWork;

    CGFloat parentHeight = CGRectGetHeight(self.parentViewController.view.bounds) ?: CGRectGetHeight([UIScreen mainScreen].bounds);
    [self.view.stackView ensureScrollingWithHeight:parentHeight tag:ARFairGuideViewWhitespace];
}

#pragma mark - Private Methods

- (void)addTopBorder
{
    UIView *view = [[UIView alloc] initWithFrame:CGRectZero];
    view.backgroundColor = [UIColor artsyGrayMedium];
    [view constrainHeight:@"2"];
    [self.view.stackView addSubview:view withTopMargin:@"0" sideMargin:@"0"];
}

- (void)addPersonalLabel
{
    UILabel *titleLabel = [ARThemedFactory labelForViewSubHeaders];
    NSString *text = self.currentUser.name ? NSStringWithFormat(@"%@'s Guide", self.currentUser.name) : @"Your Personal Guide";
    titleLabel.text = [text uppercaseString];
    titleLabel.userInteractionEnabled = YES;
    titleLabel.tag = ARFairGuideViewTitle;
    [self.view.stackView addSubview:titleLabel withTopMargin:@"22" sideMargin:@"110"];
}

- (void)userDidLoginOrSignUp
{
    [self.delegate fairGuideViewControllerDidChangeUser:self];
    _selectedTabIndex = ARFairGuideSelectedTabUndefined;
}

- (void)addUserContent
{
    [self.fairFavorites getFavoritesForNavigationsButtonsForFair:self.fair
        artworks:^(NSArray *workArray) {
            [self.workViewController addButtonDescriptions:workArray unique:YES];
        }
        artworksByArtists:^(NSArray *workArray) {
            [self.workViewController addButtonDescriptions:workArray unique:YES];
        }
        exhibitors:^(NSArray *exhibitorsArray) {
            [self.exhibitorsViewController addButtonDescriptions:exhibitorsArray unique:YES];
        }
        artists:^(NSArray *artistsArray) {
            [self.artistsViewController addButtonDescriptions:artistsArray unique:YES];
        }
        failure:^(NSError *error){
            //ignore
        }];
}

- (void)addTabView
{
    ARSwitchView *switchView = [[ARSwitchView alloc] initWithButtonTitles:[ARSwitchView fairGuideButtonTitleArray]];
    switchView.delegate = self;
    switchView.tag = ARFairGuideViewTabs;

    [self.view.stackView addSubview:switchView withTopMargin:@"20" sideMargin:@"40"];
    [switchView constrainWidth:NSStringWithFormat(@"%@", @(ARFairGuideSwitchviewWidth))];
}

#pragma mark - ARSwitchViewDelegate


- (void)switchView:(ARSwitchView *)switchView didPressButtonAtIndex:(NSInteger)buttonIndex animated:(BOOL)animated
{
    if (buttonIndex == ARSwitchViewWorkButtonIndex) {
        self.selectedTabIndex = ARFairGuideSelectedTabWork;
    } else if (buttonIndex == ARSwitchViewArtistsButtonIndex) {
        self.selectedTabIndex = ARFairGuideSelectedTabArtists;
    } else if (buttonIndex == ARSwitchViewExhibitorsButtonIndex) {
        self.selectedTabIndex = ARFairGuideSelectedTabExhibitors;
    }
}

- (void)fairFavoritesNetworkModel:(ARFairFavoritesNetworkModel *)fairFavoritesNetworkModel shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

- (User *)currentUser
{
    return _currentUser ?: [User currentUser];
}

- (BOOL)hasCurrentUser
{
    return self.currentUser && (self.currentUser != (id)[NSNull null]);
}

@end
