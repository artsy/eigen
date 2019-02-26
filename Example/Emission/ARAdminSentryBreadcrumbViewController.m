#import "ARAdminSentryBreadcrumbViewController.h"

#import <Sentry/Sentry.h>
#import <Sentry/SentryFileManager.h>

#import <FLKAutoLayout/FLKAutoLayout.h>

// Pull out the private fileManager
@interface SentryBreadcrumbStore (Private)
@property(nonatomic, strong) SentryFileManager *fileManager;
@end


@implementation ARAdminSentryBreadcrumbViewController

- (void)viewDidLoad
{
  [super viewDidLoad];

  // Grab the breadcrumbs from analytics calls and API wins/losses
  // Convert those into string messages
  // Throw them into a UITextView
  // :shippit:
  //
  SentryBreadcrumbStore *store =  [SentryClient sharedClient].breadcrumbs;
  NSArray<NSDictionary<NSString *, id> *> *breadCrumbs = [[[store.fileManager getAllStoredBreadcrumbs] reverseObjectEnumerator] allObjects];

  NSMutableArray <NSString *> *messages = [NSMutableArray array];
  for (NSDictionary *data in breadCrumbs) {
    NSDictionary *breadcrumb = [NSJSONSerialization JSONObjectWithData: data[@"data"] options:NSJSONReadingAllowFragments error:NULL];

    NSString *timestamp = breadcrumb[@"timestamp"];
    NSString *category = breadcrumb[@"category"];
    NSString *message;

    // Is a console log message
    if ([category isEqualToString:@"console"]){
      message = [NSString stringWithFormat:@"🕰 %@ \n%@ - %@", timestamp, breadcrumb[@"level"], breadcrumb[@"message"]];
    }

    // Is the start of an API call
    if (!message && [category isEqualToString:@"fetch"]){
      NSString *url =  breadcrumb[@"data"][@"url"];
      NSString *method = breadcrumb[@"data"][@"method"];
      NSString *status = @"START";

      message = [NSString stringWithFormat:@"🕰 %@ \n%@ - %@ %@",timestamp, status, method, url];
    }

    // Is the end of an API call
    if (!message && [category isEqualToString:@"xhr"]){
      NSString *url =  breadcrumb[@"data"][@"url"];
      NSString *method = breadcrumb[@"data"][@"method"];
      NSString *status = breadcrumb[@"data"][@"status_code"];

      message = [NSString stringWithFormat:@"🕰 %@ \n%@   - %@ %@", timestamp, status, method, url];
    }

    // Is a generic API call
    if (!message && category) {
      message = [NSString stringWithFormat:@"🕰 %@ \n🔎 %@ \n%@", timestamp, category, breadcrumb[@"data"]];
    }

    if (message){
      [messages addObject:message];
    }
  }

  UITextView *tv = [[UITextView alloc] initWithFrame:self.view.bounds];
  tv.font = [UIFont fontWithName:@"Menlo-Regular" size:13];
  tv.textContainerInset = UIEdgeInsetsMake(60, 20, 60, 20);
  tv.contentOffset = CGPointMake(0, 60);
  tv.editable = NO;
  [self.view addSubview:tv];
  [tv alignToView:self.view];

  tv.text = [messages componentsJoinedByString:@"\n\n"];
}

@end
