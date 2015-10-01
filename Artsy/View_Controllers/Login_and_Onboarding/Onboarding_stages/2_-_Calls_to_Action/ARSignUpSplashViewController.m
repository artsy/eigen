#import "ARSignUpSplashViewController.h"
#import "ARAppDelegate.h"
#import "ARCrossfadingImageView.h"
#import "ARUserManager.h"
#import "UIView+HitTestExpansion.h"

#import <UIAlertView+Blocks/UIAlertView+Blocks.h>

@interface ARSignUpSplashTextViewController : UIViewController
@property (nonatomic, readwrite) NSInteger index;
@property (nonatomic, strong, readwrite) NSString *text;
- (instancetype)initWithText:(NSString *)text andIndex:(NSInteger)index;
@end


@interface ARSignUpSplashViewController () <UIScrollViewDelegate, UIPageViewControllerDataSource, UIPageViewControllerDelegate>

@property (nonatomic) NSArray *pages;
@property (nonatomic) ARCrossfadingImageView *imageView;
@property (nonatomic) ARWhiteFlatButton *signUpButton;
@property (nonatomic) UIButton *logInButton;
@property (nonatomic) ARClearFlatButton *trialButton;
@property (nonatomic) UIPageViewController *pageViewController;
@property (nonatomic, strong, readwrite) UIPageControl *pageControl;
@property (nonatomic, strong, readwrite) UIActivityIndicatorView *spinnerView;
@property (nonatomic, strong, readwrite) UIImageView *logoView;
@end


@implementation ARSignUpSplashViewController

- (NSDictionary *)pageWithImageName:(NSString *)imageName bodyCopy:(NSString *)copy
{
    return @{
        @"image" : [UIImage imageNamed:imageName],
        @"copy" : copy
    };
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _pages = @[
            [self pageWithImageName:@"onboard_1.jpg"
                           bodyCopy:@"Explore and collect\nover 300,000 works from\n3,500 leading galleries,\nart fairs, and museums."],

            [self pageWithImageName:@"onboard_2.jpg"
                           bodyCopy:@"Favorite artists and works\nto get alerts about\nnew shows and personal recommendations."],

            [self pageWithImageName:@"onboard_3.jpg"
                           bodyCopy:@"Collect works and\nconnect with galleries.\nNeed help or advice? Artsy's specialists can help."],
        ];
    }


    return self;
}

- (void)loadView
{
    [super loadView];

    self.imageView = [[ARCrossfadingImageView alloc] init];
    self.imageView.shouldLoopImages = YES;
    [self.view addSubview:self.imageView];
    [self.imageView alignToView:self.view];
    self.imageView.userInteractionEnabled = YES;

}

- (void)viewDidLoad
{
    NSString *imageName = NSStringWithFormat(@"full_logo_white_%@", [UIDevice isPad] ? @"large" : @"small");
    self.logoView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:imageName]];
    self.logoView.contentMode = UIViewContentModeScaleAspectFit;
    [self.view addSubview:self.logoView];
    [self.logoView alignCenterXWithView:self.view predicate:@"0"];
    [self.logoView alignCenterYWithView:self.view predicate:[UIDevice isPad] ? @"-194" : @"-173"];

    self.spinnerView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [self.view addSubview:self.spinnerView];
    [self.spinnerView alignToView:self.view];
    [self.spinnerView startAnimating];

    NSArray *images = [self.pages map:^id(NSDictionary *object) {
        return [object objectForKey:@"image"];
    }];

    self.imageView.images = images;

    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated
{
    self.view.alpha = 0;
    [UIView animateWithDuration:ARAnimationDuration animations:^{
        self.view.alpha = 1;
    }];

    [super viewWillAppear:animated];
}

- (void)viewDidAppear:(BOOL)animated
{
    [[ARUserManager sharedManager] tryLoginWithSharedWebCredentials:^(NSError *error) {
        ar_dispatch_main_queue(^{
            if (error) {
                [UIView animateWithDuration:ARAnimationDuration animations:^{
                    [self.spinnerView removeFromSuperview];
                    self.spinnerView = nil;
                    [self showControls];
                }];
            } else {
                [self.delegate dismissOnboardingWithVoidAnimation:YES];
            }
        });
    }];

    [super viewDidAppear:animated];
}

- (void)showControls;
{
    self.pageViewController = [[UIPageViewController alloc] initWithTransitionStyle:UIPageViewControllerTransitionStyleScroll navigationOrientation:UIPageViewControllerNavigationOrientationHorizontal options:nil];
    self.pageViewController.dataSource = self;
    self.pageViewController.delegate = self;
    [self addChildViewController:self.pageViewController];
    [self.view addSubview:self.pageViewController.view];
    [self.pageViewController didMoveToParentViewController:self];
    ARSignUpSplashTextViewController *initialVC = [self viewControllerForIndex:0];
    if (initialVC) {
        self.pageControl.currentPage = 0;
        NSArray *initialVCs = @[ initialVC ];
        [self.pageViewController setViewControllers:initialVCs direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
    }

    UIScrollView *scrollView = [self.pageViewController.view.subviews detect:^BOOL(id object) {
        return [(UIView *)object isKindOfClass:[UIScrollView class]];
    }];
    scrollView.delegate = self;

    self.pageControl = [self pageControlForPaging];
    [self.view addSubview:self.pageControl];
    [self.pageControl constrainTopSpaceToView:self.logoView predicate:[UIDevice isPad] ? @"290" : @"160"];
    [self.pageControl alignCenterXWithView:self.view predicate:@"0"];

    self.signUpButton = [[ARWhiteFlatButton alloc] init];
    [self.view addSubview:self.signUpButton];
    [self.signUpButton setTitle:@"SIGN UP" forState:UIControlStateNormal];
    [self.signUpButton addTarget:self action:@selector(signUp:) forControlEvents:UIControlEventTouchUpInside];
    [self.signUpButton constrainTopSpaceToView:self.pageControl predicate:@"29"];
    [self.signUpButton alignCenterXWithView:self.view predicate:@"0"];

    self.trialButton = [[ARClearFlatButton alloc] init];
    [self.view addSubview:self.trialButton];
    [self.trialButton setTitle:@"TRY WITHOUT AN ACCOUNT" forState:UIControlStateNormal];
    [self.trialButton addTarget:self action:@selector(startTrial) forControlEvents:UIControlEventTouchUpInside];
    [self.trialButton constrainTopSpaceToView:self.signUpButton predicate:@"12"];
    [self.trialButton alignCenterXWithView:self.view predicate:@"0"];

    self.logInButton = [[UIButton alloc] init];
    self.logInButton.titleLabel.font = [UIFont sansSerifFontWithSize:13];
    self.logInButton.titleLabel.textAlignment = NSTextAlignmentRight;
    [self.logInButton addTarget:self action:@selector(logIn:) forControlEvents:UIControlEventTouchUpInside];
    [self.logInButton setTitle:@"LOG IN" forState:UIControlStateNormal];
    [self.view addSubview:self.logInButton];
    [self.logInButton ar_extendHitTestSizeByWidth:10 andHeight:10];
    [self.logInButton alignTrailingEdgeWithView:self.view predicate:[UIDevice isPad] ? @"-44" : @"-20"];
    [self.logInButton alignAttribute:NSLayoutAttributeCenterY toAttribute:NSLayoutAttributeBottom ofView:self.view predicate:[UIDevice isPad] ? @"-42" : @"-22"];
}

#pragma Property overrides

- (void)setFormEnabled:(BOOL)enabled
{
    self.logInButton.enabled = enabled;
    self.signUpButton.enabled = enabled;
    self.trialButton.enabled = enabled;
}

- (void)setBackgroundImage:(UIImage *)backgroundImage
{
    self.imageView.image = nil;
}

- (UIImage *)backgroundImage
{
    return self.imageView.images[self.imageView.currentIndex];
}

#pragma mark - UIPageViewControllerDataSource

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(ARSignUpSplashTextViewController *)viewController
{
    if (self.pageCount <= 1) {
        return nil;
    }


    NSInteger newIndex = viewController.index - 1;
    if (newIndex < 0) {
        newIndex = self.pageCount - 1;
    }

    return [self viewControllerForIndex:newIndex];
}

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerAfterViewController:(ARSignUpSplashTextViewController *)viewController
{
    if (self.pageCount <= 1) {
        return nil;
    }

    NSInteger newIndex = (viewController.index + 1) % self.pageCount;
    return [self viewControllerForIndex:newIndex];
}

- (ARSignUpSplashTextViewController *)viewControllerForIndex:(NSInteger)index
{
    if (index < 0 || index >= self.pageCount) {
        return nil;
    }

    return [[ARSignUpSplashTextViewController alloc] initWithText:self.pages[index][@"copy"] andIndex:index];
}

#pragma mark - UIPageViewControllerDelegate

- (void)pageViewController:(UIPageViewController *)pageViewController didFinishAnimating:(BOOL)finished previousViewControllers:(NSArray *)previousViewControllers transitionCompleted:(BOOL)completed
{
    if (!completed) {
        return;
    }
    NSInteger index = [self currentViewController].index;
    [self.pageControl setCurrentPage:index];
    self.imageView.currentIndex = index;
}

- (ARSignUpSplashTextViewController *)currentViewController
{
    return self.pageViewController.viewControllers.count > 0 ? self.pageViewController.viewControllers[0] : nil;
}

#pragma mark UISCrollViewDelegate methods

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    CGFloat width = scrollView.frame.size.width;
    CGFloat offset = scrollView.contentOffset.x;
    CGFloat shiftFactor = fabs(offset - width) / width;

    if (offset < width) {
        [self.imageView down:shiftFactor];
    } else {
        [self.imageView up:shiftFactor];
    }
}

#pragma mark Actions

- (IBAction)signUp:(id)sender
{
    [self.delegate splashDone:self];
}

- (IBAction)logIn:(id)sender
{
    [self.delegate splashDoneWithLogin:self];
}

- (void)startTrial
{
    [self setFormEnabled:NO animated:YES];

    [ARTrialController startTrialWithCompletion:^{
        // Load normal app
        [self.delegate dismissOnboardingWithVoidAnimation:YES];
    }
        failure:^(NSError *error) {
        [UIAlertView showWithTitle:@"Couldn’t Reach Artsy"
                           message:error.localizedDescription
                 cancelButtonTitle:@"Retry"
                 otherButtonTitles:nil
                          tapBlock:^(UIAlertView *alertView, NSInteger buttonIndex) {
                              [self performSelector:@selector(enableForm) withObject:nil];
                          }];
        }];
}

- (void)enableForm
{
    [self setFormEnabled:YES animated:YES];
}

#pragma mark View setup

- (void)setFormEnabled:(BOOL)enabled animated:(BOOL)animated
{
    [UIView animateIf:animated duration:0.15:^{
        for (UIView *view in @[self.trialButton, self.logInButton, self.signUpButton]) {
            view.userInteractionEnabled = enabled;
            view.alpha = enabled ? 1 : 0.3;
        }
    }];
}

- (NSInteger)pageCount
{
    return self.pages.count;
}

- (UIPageControl *)pageControlForPaging
{
    UIPageControl *control = [[UIPageControl alloc] init];
    control.pageIndicatorTintColor = [UIColor artsyMediumGrey];
    control.numberOfPages = self.pages.count;
    return control;
}

@end


@implementation ARSignUpSplashTextViewController
- (instancetype)initWithText:(NSString *)text andIndex:(NSInteger)index
{
    self = [super init];
    if (!self) {
        return nil;
    }
    _text = text;
    _index = index;
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    UILabel *copyLabel = [self labelForCopy];
    copyLabel.text = self.text;

    [self.view addSubview:copyLabel];
    [copyLabel constrainWidth:@"280" height:@"120"];
    [copyLabel alignCenterXWithView:self.view predicate:@"0"];
    [copyLabel alignCenterYWithView:self.view predicate:[UIDevice isPad] ? @"40" : @"-60"];
}

- (UILabel *)labelForCopy
{
    ARSerifLineHeightLabel *copyLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
    copyLabel.backgroundColor = [UIColor clearColor];
    copyLabel.opaque = NO;
    copyLabel.font = [UIFont serifFontWithSize:24];
    copyLabel.textColor = [UIColor whiteColor];
    copyLabel.textAlignment = NSTextAlignmentCenter;
    copyLabel.numberOfLines = 0;
    copyLabel.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    copyLabel.clipsToBounds = NO;
    copyLabel.layer.shadowOpacity = 0.8;
    copyLabel.layer.shadowRadius = 2.0;
    copyLabel.layer.shadowOffset = CGSizeZero;
    copyLabel.layer.shadowColor = [UIColor colorWithWhite:0 alpha:0.6].CGColor;
    copyLabel.layer.shouldRasterize = YES;
    return copyLabel;
}

@end
