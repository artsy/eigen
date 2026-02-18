#import "ARComponentViewController.h"
#import "AREmission.h"
#import "ARAppDelegateHelper.h"

#import <React/RCTRootView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@interface ARComponentViewController ()
@property (nonatomic, strong, readonly) AREmission *emission;
@property (nonatomic, strong, readonly) NSString *moduleName;
@property (nonatomic, strong) NSDictionary *initialProperties;
@end

@implementation ARComponentViewController

+ (instancetype)module:(nonnull NSString *)moduleName withProps:(nullable NSDictionary *)props
{
    return [[ARComponentViewController alloc] initWithEmission:nil moduleName:moduleName initialProperties:props];
}

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

- (instancetype)initWithEmission:(AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(NSDictionary *)initialProperties
                 hidesBackButton:(BOOL)hidesBackButton;
{
    self = [self initWithEmission:emission moduleName:moduleName initialProperties:initialProperties];
    self.hidesBackButton = hidesBackButton;
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

    // We use AutoLayout to ensure the RCTView covers the whole view
    self.rootView.translatesAutoresizingMaskIntoConstraints = NO;
    
    [self.rootView alignToView:self.view];
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
  return [[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad;
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

@end
