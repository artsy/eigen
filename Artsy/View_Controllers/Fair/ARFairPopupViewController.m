#import "ARFairPopupViewController.h"


@interface ARFairPopupViewController ()

@property (nonatomic, copy, readonly) NSString *titleString;
@property (nonatomic, copy, readonly) NSString *slug;
@property (nonatomic, copy, readonly) NSURL *imageURL;

@end


@implementation ARFairPopupViewController

- (instancetype)initWithFair:(Fair *)fair
{
    return [self initWithFairTitle:fair.name imageBackgroundURL:[NSURL URLWithString:fair.bannerAddress] slug:fair.fairID];
}

- (instancetype)initWithFairTitle:(NSString *)title imageBackgroundURL:(NSURL *)url slug:(NSString *)slug
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _slug = slug;
    _titleString = title;
    _imageURL = url;

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.view.backgroundColor = [UIColor clearColor];
    self.popoverView.alpha = 0;

    [self.backgroundImageView ar_setImageWithURL:self.imageURL];
    self.titleLabel.text = self.titleString.uppercaseString;

    UITapGestureRecognizer *dismissTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismissPopover)];
    [self.view addGestureRecognizer:dismissTap];

    UITapGestureRecognizer *goGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(goToFair)];
    [self.popoverView addGestureRecognizer:goGesture];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    [UIView animateIf:animated duration:ARAnimationQuickDuration:^{
        self.view.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
    }];

    [UIView animateIf:animated duration:ARAnimationDuration:^{
        self.popoverView.alpha = 1;
        self.popoverYCenterConstraint.constant += 8;
        [self.view setNeedsLayout];
        [self.view layoutIfNeeded];
    }];
}

- (void)animateOut:(BOOL)animated :(void (^)())completion
{
    NSParameterAssert(completion);

    [UIView animateIf:animated duration:ARAnimationQuickDuration:^{
        self.view.backgroundColor = [UIColor clearColor];
        self.view.backgroundColor = [UIColor clearColor];

    } completion:^(BOOL finished) {
        completion();
    }];
}

- (void)dismissPopover
{
    [self animateOut:YES :^{
        [self.presentingViewController dismissViewControllerAnimated:NO completion:nil];
    }];
}

- (void)goToFair
{
    [self dismissPopover];

    UIViewController *controller = [ARSwitchBoard.sharedInstance loadPath:self.slug];
    [self.presentingViewController.navigationController pushViewController:controller animated:YES];
}

- (void)presentOnViewController:(UIViewController *)parent animated:(BOOL)animated
{
    self.modalPresentationCapturesStatusBarAppearance = YES;

    parent.modalPresentationStyle = UIModalPresentationCurrentContext;
    self.modalPresentationStyle = UIModalPresentationOverCurrentContext;

    [parent presentViewController:self animated:NO completion:nil];
}

@end
