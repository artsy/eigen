#import "ARComponentViewController.h"
#import "AREmission.h"

#import <React/RCTRootView.h>

@interface ARComponentViewController ()
@property (nonatomic, strong, readonly) AREmission *emission;
@property (nonatomic, strong, readonly) NSString *moduleName;
@property (nonatomic, strong, readonly) NSDictionary *initialProperties;
@end

@implementation ARComponentViewController

- (instancetype)initWithEmission:(AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(NSDictionary *)initialProperties;
{
  if ((self = [super initWithNibName:nil bundle:nil])) {
    _emission = emission ?: [AREmission sharedInstance];
    _moduleName = moduleName;
    _initialProperties = initialProperties;
  }
  return self;
}

- (void)viewDidLoad;
{
  [super viewDidLoad];
  self.automaticallyAdjustsScrollViewInsets = NO;

  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.emission.bridge
                                                   moduleName:self.moduleName
                                            initialProperties:self.initialProperties];
  [self.view addSubview:rootView];
  rootView.reactViewController = self;

  rootView.translatesAutoresizingMaskIntoConstraints = NO;
  [self.view addConstraints:@[
    [self topLayoutConstraintWithRootView:rootView],
    [NSLayoutConstraint constraintWithItem:rootView
                                 attribute:NSLayoutAttributeLeading
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.view
                                 attribute:NSLayoutAttributeLeading
                                multiplier:1
                                  constant:0],
    [NSLayoutConstraint constraintWithItem:rootView
                                 attribute:NSLayoutAttributeTrailing
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.view
                                 attribute:NSLayoutAttributeTrailing
                                multiplier:1
                                  constant:0],
    [NSLayoutConstraint constraintWithItem:rootView
                                 attribute:NSLayoutAttributeBottom
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.bottomLayoutGuide
                                 attribute:NSLayoutAttributeTop
                                multiplier:1
                                  constant:0]
  ]];
}

- (NSLayoutConstraint *)topLayoutConstraintWithRootView:(UIView *)rootView;
{
  return [NSLayoutConstraint constraintWithItem:rootView
                                      attribute:NSLayoutAttributeTop
                                      relatedBy:NSLayoutRelationEqual
                                         toItem:self.topLayoutGuide
                                      attribute:NSLayoutAttributeBottom
                                     multiplier:1
                                       constant:0];
}

- (BOOL)shouldAutorotate;
{
  return UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations;
{
  return self.shouldAutorotate ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
