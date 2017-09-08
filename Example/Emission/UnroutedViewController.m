#import "UnroutedViewController.h"
#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/FLKAutoLayout.h>
#import <Emission/AREmission.h>
#import <Emission/ARSwitchBoardModule.h>

#import "ARDefaults.h"

@import WebKit;

@interface UnroutedViewController() <WKNavigationDelegate>
@property (readonly, nonatomic, strong) WKWebView *webView;
@property (nonatomic, readonly, strong) NSURL *initialURL;
@end

@implementation UnroutedViewController

- (instancetype)initWithRoute:(NSString *)route
{
  if ((self = [super init])) {
    _initialURL = [self urlForRoute:route];
    self.automaticallyAdjustsScrollViewInsets = NO;
  }

  return self;
}

- (NSURL *)urlForRoute:(NSString *)route
{
  if ([route containsString:@"http"]) {
    return [NSURL URLWithString:route];
  }

  BOOL useStaging = [[NSUserDefaults standardUserDefaults] boolForKey:ARUseStagingDefault];
  NSURL *url = [NSURL URLWithString: useStaging ? @"https://staging.artsy.net" : @"https://artsy.net"];
  return [url URLByAppendingPathComponent:route];
}

- (void)loadURL:(NSURL *)URL;
{
  AREmission *emission = [AREmission sharedInstance];
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:URL];
  NSString *agentString = [NSString stringWithFormat:@"Mozilla/5.0 Artsy-Mobile/3.3.0 Eigen/2017.07.07.13/3.3.0 (iPhone; iOS 9.0; Scale/2.00) AppleWebKit/601.1.46 (KHTML, like Gecko) Emission/1.x"];

  [request addValue:agentString forHTTPHeaderField:@"UserAgent"];
  [request addValue:emission.configurationModule.userID forHTTPHeaderField:@"X-User-ID"];
  [request addValue:emission.configurationModule.authenticationToken forHTTPHeaderField:@"X-Access-Token"];

  [self.webView loadRequest:request];
}

- (void)viewDidLoad
{
  [super viewDidLoad];
  WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];

  CGRect deviceBounds = [UIScreen mainScreen].bounds;
  WKWebView *webView = [[WKWebView alloc] initWithFrame:deviceBounds configuration:config];

  webView.frame = self.view.bounds;
  webView.navigationDelegate = self;
  [self.view addSubview:webView];

  _webView = webView;

  [self loadURL:self.initialURL];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
  return UIStatusBarStyleLightContent;
}

- (void)viewWillLayoutSubviews
{
  [self.webView constrainTopSpaceToView:self.flk_topLayoutGuide predicate:@"0"];
  [self.webView alignLeading:@"0" trailing:@"0" toView:self.view];
  [self.webView alignBottomEdgeWithView:self.view predicate:@"0"];
}

- (UIStatusBarStyle)statusBarStyle
{
  return self.statusBarStyle;
}


#pragma mark - Properties

#pragma mark WKWebViewDelegate

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;
{
  decisionHandler([self shouldLoadNavigationAction:navigationAction]);
}

- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;
{
  if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
    NSString *route = navigationAction.request.URL.absoluteString;
    AREmission.sharedInstance.switchBoardModule.presentNavigationViewController(self, route);
  }
  return WKNavigationActionPolicyAllow;
}


@end
