#import "AROnboardingWebViewController.h"
#import "AROnboardingNavBarView.h"
#import "UIViewController+FullScreenLoading.h"

typedef NS_ENUM(NSInteger, ARScrollState) {
    ARScrollStateScrollingUp = -1,
    ARScrollStateTop,
    ARScrollStateScrollingDown
};

@interface AROnboardingWebViewController () <UIWebViewDelegate, UIScrollViewDelegate>
@property (nonatomic, strong) NSString *path;
@property (nonatomic, assign) CGFloat lastY;
@property (nonatomic, assign) CGFloat initialY;
@property (nonatomic, assign) ARScrollState scrollState;
@property (nonatomic, retain) AROnboardingNavBarView *navView;
@end

@implementation AROnboardingWebViewController

+ (void)initialize
{
    NSString *build = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectZero];
    NSString *fullAgent = [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];

    NSString *userAgent = [NSString stringWithFormat:@"Artsy-Mobile: %@ | v%@ | %@", version, build, fullAgent];

    [[NSUserDefaults standardUserDefaults] registerDefaults:@{ @"UserAgent" : userAgent } ];
}

- (instancetype)initWithMobileArtsyPath:(NSString *)path
{
    self = [super init];
    if (!self) { return nil; }

    _path = path;

    return self;
}

- (void)viewDidLoad
{
    UIWebView *webView = [[UIWebView alloc] initWithFrame:self.view.bounds];
    webView.delegate = self;
    webView.scalesPageToFit = YES;
    webView.backgroundColor = [UIColor whiteColor];
    webView.scrollView.contentInset = UIEdgeInsetsMake(30, 0, 0, 0);
    webView.scrollView.delegate = self;
    [self.view addSubview:webView];

    NSURL *url = [ARSwitchBoard.sharedInstance resolveRelativeUrl:self.path];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [webView loadRequest:request];

    // Doing this now means the back button is available whilst loading
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];

    AROnboardingNavBarView *navView = [[AROnboardingNavBarView alloc] init];
    [self.view addSubview:navView];
    self.navView = navView;

    [navView.title setText:@""];
    [navView.back setImage:[UIImage imageNamed:@"BackArrow_Highlighted"] forState:UIControlStateNormal];
    [navView.back addTarget:self action:@selector(popViewController) forControlEvents:UIControlEventTouchUpInside];

    [super viewDidLoad];
}

- (void)popViewController
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)webViewDidFinishLoad:(UIWebView *)aWebView
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
}

- (void)setBackButtonAlpha:(CGFloat)alpha
{
    UIView *back = self.navView.back;
    if (back.alpha != alpha) {
        [UIView animateWithDuration:ARAnimationDuration animations:^{
            back.alpha = alpha;
        }];
    }
}

- (ARScrollState)scrollStateForScrollView:(UIScrollView *)scrollView delta:(CGFloat *)delta
{
    CGFloat nextY = scrollView.contentOffset.y;
    ARScrollState nextState;
    if (nextY >= self.lastY) {
        nextState = ARScrollStateScrollingDown;
    } else if (nextY <= 0) {
        nextState = ARScrollStateTop;
    } else {
        nextState = ARScrollStateScrollingUp;
    }
    self.lastY = MAX(nextY, 0);

    *delta = fabs(nextY - self.initialY);

    if (self.scrollState != nextState) {
        self.scrollState = nextState;
        self.initialY = nextY;
    }
    return nextState;
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    CGFloat delta;
    ARScrollState scrollState = [self scrollStateForScrollView:scrollView delta:&delta];
    if ((scrollState == ARScrollStateTop) || (scrollState == ARScrollStateScrollingUp && delta > 160)) {
        [self setBackButtonAlpha:1];
    } else if (scrollState == ARScrollStateScrollingDown) {
        [self setBackButtonAlpha:0];
    }
}

@end
