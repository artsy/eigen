#import "ARComponentViewController.h"
#import "AREmission.h"

#import <React/RCTRootView.h>

@interface ARComponentViewController ()
@property (nonatomic, strong, readonly) AREmission *emission;
@property (nonatomic, strong, readonly) NSString *moduleName;
@property (nonatomic, strong) NSDictionary *initialProperties;
@property (nonatomic, assign) BOOL safeAreaInsetsAreSet;
@end

@implementation ARComponentViewController

- (instancetype)initWithEmission:(AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(NSDictionary *)initialProperties;
{
  if ((self = [super initWithNibName:nil bundle:nil])) {
    _emission = emission ?: [AREmission sharedInstance];
    _moduleName = moduleName;

    NSMutableDictionary *properties = [NSMutableDictionary new];
    [properties addEntriesFromDictionary:initialProperties];
    [properties addEntriesFromDictionary:@{@"isVisible": @YES}];
    _initialProperties = properties;
    _rootView = nil;
  }
  return self;
}

- (void)viewDidLoad;
{
  [super viewDidLoad];
  self.automaticallyAdjustsScrollViewInsets = NO;

  if (self.shouldInjectSafeAreaInsets) {
    [self updateSafeAreaInsets];
  }

  self.rootView = [[RCTRootView alloc] initWithBridge:self.emission.bridge
                                                   moduleName:self.moduleName
                                            initialProperties:self.initialProperties];
  [self.view addSubview:self.rootView];
  self.rootView.reactViewController = self;

  // We use AutoLayout to ensure the RCTView covers the whole view
  self.rootView.translatesAutoresizingMaskIntoConstraints = NO;

  // Most of the time we want to respect the 'safe area' positioning provided by the
  // OS, but in the cases where we have full bleed headers whiich should go behind
  // the status bar, then the top layout constrain will need to work with the main
  // view instead of the traditional topLayoutGuide
  id topConstrainedItem = self.fullBleed ? (id)self.view : self.topLayoutGuide;
  NSLayoutAttribute topConstrainedAttribute = self.fullBleed ? NSLayoutAttributeTop : NSLayoutAttributeBottom;

  [self.view addConstraints:@[
    [NSLayoutConstraint constraintWithItem:self.rootView
                                 attribute:NSLayoutAttributeTop
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:topConstrainedItem
                                 attribute:topConstrainedAttribute
                                multiplier:1
                                  constant:0],
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
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    NSMutableDictionary *appProperties = [self.rootView.appProperties mutableCopy];
    appProperties[@"isVisible"] = @NO;
    self.rootView.appProperties = appProperties;
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

- (void)setProperty:(id)value forKey:(NSString *)key
{
    if (self.isViewLoaded) {
        NSMutableDictionary *appProperties = [self.rootView.appProperties mutableCopy];
        appProperties[key] = value;
        self.rootView.appProperties = appProperties;
    } else {
        NSMutableDictionary *appProperties = [self.initialProperties mutableCopy];
        appProperties[key] = value;
        self.initialProperties = appProperties;
    }
}

- (void)updateSafeAreaInsets
{
    if (self.safeAreaInsetsAreSet) {
        return;
    }

    UIEdgeInsets safeAreaInsets = UIEdgeInsetsZero;
    if (@available(iOS 11.0, *)) {
        safeAreaInsets = self.view.safeAreaInsets;

        // Once we receive the correct top inset value it gets resetted to 0 after the VC gets hidden
        // So let's not reset it afterwards
        if (self.view.safeAreaInsets.top > 0) {
            self.safeAreaInsetsAreSet = YES;
        }
    } else {
        self.safeAreaInsetsAreSet = YES;
    }

    [self setProperty:@{ @"top": @(safeAreaInsets.top),
                         @"bottom": @(safeAreaInsets.bottom),
                         @"left": @(safeAreaInsets.left),
                         @"right": @(safeAreaInsets.right) }
               forKey:@"safeAreaInsets"];
}

-(void)viewSafeAreaInsetsDidChange
{
    [super viewSafeAreaInsetsDidChange];
    if (self.shouldInjectSafeAreaInsets) {
      [self updateSafeAreaInsets];
    }
}

@end
