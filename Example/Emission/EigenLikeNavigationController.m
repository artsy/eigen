#import "EigenLikeNavigationController.h"
#import <FLKAutoLayout/FLKAutoLayout.h>

@interface EigenLikeNavigationController() <UINavigationControllerDelegate>

@end

@implementation EigenLikeNavigationController

- (void)viewDidLoad
{
  [super viewDidLoad];

  self.navigationBarHidden = YES;
  self.delegate = self;

  UIButton *backButton = [self createBackButton];
  [self.view addSubview:backButton];
  [backButton constrainTopSpaceToView:self.topLayoutGuide predicate:@"20"];
  [backButton alignLeadingEdgeWithView:self.view predicate:@"3"];
  [backButton constrainWidth:@"40" height:@"40"];
  _backButton = backButton;

  UIKeyCommand *command = [UIKeyCommand keyCommandWithInput:@"|" modifierFlags:UIKeyModifierControl action:@selector(toggleNav)];
  [self addKeyCommand: command];
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  [UIView animateWithDuration:0.15 animations:^{
    self.backButton.alpha = (navigationController.viewControllers.count != 1) || self.showBackButtonOnRoot;
  }];
}

- (void)pop
{
  if (self.presentingViewController) {
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
    return;
  }
  // Support popping inside NavigatorIOS before falling back to our navigation VC
  UINavigationController *targetNav = self;
  for (UIViewController *controller in self.topViewController.childViewControllers) {
    if ([controller isKindOfClass:UINavigationController.class]) {
      if (controller.childViewControllers.count > 1) { targetNav = (id)controller; }
    }
  }
  [targetNav popViewControllerAnimated:YES];
}

- (UIButton *)createBackButton
{
  UIButton *backButton = [UIButton buttonWithType:UIButtonTypeCustom];
  [backButton setImage:[UIImage imageNamed:@"Back"] forState:UIControlStateNormal];
  [backButton addTarget:self action:@selector(pop) forControlEvents:UIControlEventTouchUpInside];
  backButton.adjustsImageWhenDisabled = NO;

  backButton.alpha = self.showBackButtonOnRoot ? 1 : 0;
  backButton.layer.cornerRadius = 20;
  backButton.layer.backgroundColor = [UIColor whiteColor].CGColor;

  return backButton;
}

- (BOOL)shouldAutorotate;
{
    return self.topViewController.shouldAutorotate;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations;
{
    return self.topViewController.supportedInterfaceOrientations;
}

- (void)toggleNav
{
  [UIView animateWithDuration:0.1 animations:^{
    CGFloat alpha = [self.backButton alpha];
    [self.backButton setAlpha:!alpha];
  }];
}

@end
