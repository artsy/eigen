#import "ARTopMenuViewController.h"
#import <FLKAutoLayout/FLKAutoLayout.h>

@interface ARTopMenuViewController ()
@property (nonatomic, strong) UINavigationController *nav;
@property (nonatomic, strong) UIView *statusBarView;
@property (nonatomic, strong) NSLayoutConstraint *statusBarVerticalConstraint;

@end

@implementation ARTopMenuViewController

- (instancetype) initWithNavigationController:(UINavigationController *)controller
{
  self = [super init];
  if (!self) { return nil; }

  _nav = controller;
  return self;
}

- (void)viewDidLoad
{
  [super viewDidLoad];

  _statusBarView = [[UIView alloc] init];
  _statusBarView.backgroundColor = UIColor.whiteColor;

  [self.view addSubview:_statusBarView];

  // Just a default value
  _statusBarVerticalConstraint = [_statusBarView constrainHeight:@"20"];
  [_statusBarView constrainWidthToView:self.view predicate:@"0"];
  [_statusBarView alignTopEdgeWithView:self.view predicate:@"0"];
  [_statusBarView alignLeadingEdgeWithView:self.view predicate:@"0"];

  // Add the nav to our VC
  [self.nav willMoveToParentViewController:self];
  [self addChildViewController:self.nav];
  [self.view addSubview:self.nav.view];
  [self.nav didMoveToParentViewController:self];
  [self addChildViewController:self.nav];

  [self.nav.view constrainTopSpaceToView:_statusBarView predicate:@"0"];
  [self.nav.view alignBottom:@"0" trailing:@"0" toView:self.view];
  [self.nav.view constrainWidthToView:self.view predicate:@"0"];
}

- (CGFloat)statusBarHeight
{
  // iPhone X support
  if (@available(iOS 11.0, *)) {
    return self.view.safeAreaInsets.top;
  } else {
    return 20;
  }
}

// safeAreaInsets for an iPhone X is null at viewDidLoad
// so we use viewDidLayoutSubviews to get the value eventually

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  if (_statusBarVerticalConstraint.constant != [self statusBarHeight]) {
    _statusBarVerticalConstraint.constant = [self statusBarHeight];
  }
}
@end
