#import "InternalWebViewController.h"
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

#import <WebKit/WebKit.h>

@interface InternalWebViewController ()
@property (nonatomic, readonly, strong) NSURL *initialURL;
@end

@implementation InternalWebViewController

- (instancetype)initWithURL:(NSURL *)url
{
  self = [super init];
  if (!self) {
    return nil;
  }

  _initialURL = url;
  self.automaticallyAdjustsScrollViewInsets = NO;

  return self;
}

- (void)viewDidLoad
{
  [super viewDidLoad];

  WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
  WKWebView *webView = [[WKWebView alloc] initWithFrame:self.view.bounds configuration:config];
  [self.view addSubview:webView];

  [webView constrainTopSpaceToView:self.flk_topLayoutGuide predicate:@"0"];
  [webView alignLeading:@"0" trailing:@"0" toView:self.view];
  [webView alignBottomEdgeWithView:self.view predicate:@"0"];

  NSURLRequest *initialRequest = [NSURLRequest requestWithURL:self.initialURL];
  [webView loadRequest:initialRequest];
}

@end
