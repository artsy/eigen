#import "ARTopMenuViewController.h"
#import <FLKAutoLayout/FLKAutoLayout.h>

@interface ARTopMenuViewController ()
@property (nonatomic, strong) UINavigationController *nav;
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

  // Add the nav to our VC
  [self.nav willMoveToParentViewController:self];
  [self addChildViewController:self.nav];
  [self.view addSubview:self.nav.view];
  [self.nav didMoveToParentViewController:self];
  [self addChildViewController:self.nav];

  [self.nav.view alignTopEdgeWithView:self.view predicate:@"0"];
  [self.nav.view alignBottom:@"0" trailing:@"0" toView:self.view];
  [self.nav.view constrainWidthToView:self.view predicate:@"0"];
}

@end
