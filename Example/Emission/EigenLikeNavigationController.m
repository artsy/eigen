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
  [backButton constrainTopSpaceToView:self.topLayoutGuide predicate:@"12"];
  [backButton alignLeadingEdgeWithView:self.view predicate:@"12"];
  [backButton constrainWidth:@"40" height:@"40"];
  _backButton = backButton;
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  [UIView animateWithDuration:0.15 animations:^{
    self.backButton.alpha = navigationController.viewControllers.count != 1;
  }];
}

- (void)pop
{
  [self popViewControllerAnimated:YES];
}

- (UIButton *)createBackButton
{
  UIButton *backButton = [UIButton buttonWithType:UIButtonTypeCustom];
  [backButton setImage:[UIImage imageNamed:@"BackArrow"] forState:UIControlStateNormal];
  [backButton addTarget:self action:@selector(pop) forControlEvents:UIControlEventTouchUpInside];
  backButton.adjustsImageWhenDisabled = NO;
  backButton.backgroundColor = UIColor.blackColor;

  backButton.alpha = 0;

  backButton.layer.cornerRadius = 20;
  backButton.layer.borderColor = [UIColor whiteColor].CGColor;
  backButton.layer.borderWidth = 2;
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

@end
