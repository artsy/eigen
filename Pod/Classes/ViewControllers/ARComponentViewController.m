#import "ARComponentViewController.h"
#import "AREmission.h"

#import <React/RCTRootView.h>

@interface ARComponentViewController ()
@property (nonatomic, strong, readonly) AREmission *emission;
@property (nonatomic, strong, readonly) NSString *moduleName;
@property (nonatomic, strong, readonly) NSDictionary *initialProperties;
@property (nonatomic, strong) RCTRootView *rootView;
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
    _rootView = nil;
  }
  return self;
}

- (void)viewDidLoad;
{
  [super viewDidLoad];
  self.automaticallyAdjustsScrollViewInsets = NO;

  self.rootView = [[RCTRootView alloc] initWithBridge:self.emission.bridge
                                                   moduleName:self.moduleName
                                            initialProperties:self.initialProperties];
  [self.view addSubview:self.rootView];
  self.rootView.reactViewController = self;

  self.rootView.translatesAutoresizingMaskIntoConstraints = NO;
  [self.view addConstraints:@[
    [self topLayoutConstraintWithRootView:self.rootView],
    [NSLayoutConstraint constraintWithItem:self.rootView
                                 attribute:NSLayoutAttributeLeading
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.view
                                 attribute:NSLayoutAttributeLeading
                                multiplier:1
                                  constant:0],
    [NSLayoutConstraint constraintWithItem:self.rootView
                                 attribute:NSLayoutAttributeTrailing
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.view
                                 attribute:NSLayoutAttributeTrailing
                                multiplier:1
                                  constant:0],
    [NSLayoutConstraint constraintWithItem:self.rootView
                                 attribute:NSLayoutAttributeBottom
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.bottomLayoutGuide
                                 attribute:NSLayoutAttributeTop
                                multiplier:1
                                  constant:0]
  ]];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    NSMutableDictionary *appProperties = [self.rootView.appProperties mutableCopy];
    appProperties[@"isVisible"] = @YES;
    self.rootView.appProperties = appProperties;
    
    NSLog(@"ARComponentViewController(%@) viewWillAppear", self.rootView.moduleName);
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    NSMutableDictionary *appProperties = [self.rootView.appProperties mutableCopy];
    appProperties[@"isVisible"] = @NO;
    self.rootView.appProperties = appProperties;
    
    NSLog(@"ARComponentViewController(%@) viewWillDisappear", self.rootView.moduleName);
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
    return UIStatusBarStyleDefault;
}

@end
