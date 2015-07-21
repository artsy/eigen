#import "ARExternalWebBrowserViewController.h"
#import <JLRoutes/JLRoutes.h>


@interface TSMiniWebBrowser (Private)
@property (nonatomic, readonly, strong) UIWebView *webView;
@end


@interface ARExternalWebBrowserViewController () <UIGestureRecognizerDelegate>
@property (nonatomic, readonly, strong) UIGestureRecognizer *gesture;
@end


@implementation ARExternalWebBrowserViewController

- (void)dealloc;
{
    self.scrollView.delegate = nil;
}

- (instancetype)initWithURL:(NSURL *)url
{
    self = [super initWithURL:url];
    if (!self) {
        return nil;
    }

    self.showNavigationBar = NO;
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    [self setupConstraints];
    self.scrollView.delegate = self;
    self.scrollView.decelerationRate = UIScrollViewDecelerationRateNormal;

#ifdef STORE
#else
    UILongPressGestureRecognizer *adminGesture;
    adminGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(showAdminDetails:)];
    [self.view addGestureRecognizer:adminGesture];
#endif
}

- (void)showAdminDetails:(UILongPressGestureRecognizer *)gesture
{
    gesture.enabled = NO;
    UITextView *textView = [[UITextView alloc] init];
    textView.font = [UIFont fontWithName:@"Courier" size:14];
    textView.backgroundColor = [UIColor colorWithWhite:0.9 alpha:1];
    [self.view addSubview:textView];
    [textView alignTop:nil leading:@"0" bottom:@"0" trailing:@"0" toView:self.view];
    [textView constrainHeightToView:self.view predicate:@"*.5"];

    NSMutableString *details = [[NSMutableString alloc] initWithString:@"## Web View Details \n\n"];
    if (self.webView.request.URL.absoluteString.length) {
        [details appendFormat:@"Requested : %@ \n", self.webView.request.URL];
    }

    NSString *currentAddress = [self.webView stringByEvaluatingJavaScriptFromString:@"document.location.href"];
    if (![currentAddress isEqualToString:self.webView.request.URL.absoluteString]) {
        [details appendFormat:@"Current URL: %@ \n", currentAddress];
    }

    [details appendFormat:@"\n"];

    NSString *userName = [self.webView stringByEvaluatingJavaScriptFromString:@"sd.CURRENT_USER.name"];
    if (userName.length) {
        [details appendFormat:@"User: %@ \n", userName];
    } else {
        [details appendString:@"User: Not logged in \n"];
    }

    NSString *userAgent = [self.webView stringByEvaluatingJavaScriptFromString:@"window.clientInformation.userAgent"];
    [details appendFormat:@"User agent: %@ \n", userAgent];

    NSString *webSession = [self.webView stringByEvaluatingJavaScriptFromString:@"sd.SESSION_ID"];
    [details appendFormat:@"Web Session: %@ \n", webSession];


    textView.text = details;
}

- (void)setupConstraints
{
    [self.webView constrainTopSpaceToView:(UIView *)self.topLayoutGuide predicate:@"0"];
    [self.webView alignTop:nil leading:@"0" bottom:@"0" trailing:@"0" toView:self.view];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    if ([self.navigationController isKindOfClass:[ARNavigationController class]]) {
        UIGestureRecognizer *gesture = self.navigationController.interactivePopGestureRecognizer;

        [self.scrollView.panGestureRecognizer requireGestureRecognizerToFail:gesture];
        _gesture = gesture;
    }
}

- (void)viewWillDisappear:(BOOL)animated
{
    self.gesture.delegate = nil;
    [super viewWillDisappear:animated];
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent];
}

#pragma mark - Properties

- (UIScrollView *)scrollView
{
    return self.webView.scrollView;
}

#pragma mark UIScrollViewDelegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
}

#pragma mark UIGestureRecognizerDelegate

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    return YES;
}

#pragma mark UIWebViewDelegate

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    if (navigationType == UIWebViewNavigationTypeLinkClicked) {
        if ([JLRoutes canRouteURL:request.URL]) {
            [JLRoutes routeURL:request.URL];
            return NO;
        }
    }

    return YES;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (NSDictionary *)dictionaryForAnalytics
{
    if (self.currentURL) {
        return @{ @"url" : self.currentURL.absoluteString,
                  @"type" : @"url" };
    }

    return nil;
}

@end
