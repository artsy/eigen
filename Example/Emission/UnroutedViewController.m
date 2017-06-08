#import "UnroutedViewController.h"
#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

@interface UnroutedViewController()
@property NSString *route;
@end

@implementation UnroutedViewController

- (instancetype)initWithRoute:(NSString *)title
{
  if ((self = [super init])) {
    self.route = title;
  }
  return  self;
}

- (void)viewDidLoad
{
  UILabel *label = [UILabel new];
  label.text = self.route;
  label.font = [UIFont serifFontWithSize:18];
  label.textAlignment = NSTextAlignmentCenter;
  label.numberOfLines = 0;

  self.view.backgroundColor = [UIColor colorWithWhite:0.9 alpha:1];
  [self.view addSubview:label];

  [label constrainWidthToView:self.view predicate:@"-40"];
  [label alignCenterWithView:self.view];

  UIButton *openInEigen = [UIButton buttonWithType:UIButtonTypeCustom];
  openInEigen.titleLabel.font = [UIFont sansSerifFontWithSize:14];
  [openInEigen setTitle:@"OPEN IN EIGEN" forState:UIControlStateNormal];
  [self.view addSubview:openInEigen];
  [openInEigen constrainTopSpaceToView:label predicate:@"20"];
  [openInEigen alignCenterXWithView:self.view predicate:@"0"];
  [openInEigen addTarget:self action:@selector(openInEigen) forControlEvents:UIControlEventTouchUpInside];
}

- (void)openInEigen
{
  NSString *route = [NSString stringWithFormat:@"artsy:%@", self.route];
  NSURL *url = [NSURL URLWithString:route];
  [[UIApplication sharedApplication] openURL:url];
}

@end
