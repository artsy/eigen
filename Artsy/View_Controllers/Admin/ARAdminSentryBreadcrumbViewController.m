#import "ARAdminSentryBreadcrumbViewController.h"

#import <Sentry/Sentry.h>
#import <Sentry/SentryFileManager.h>

@import FLKAutoLayout;
#import <ObjectiveSugar/ObjectiveSugar.h>

#import "ARAppStatus.h"

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
    NSArray<NSDictionary<NSString *, id> *> *breadCrumbs = [[store.fileManager getAllStoredBreadcrumbs] reverse];

    NSArray <NSString *> *messages = [breadCrumbs map: ^id(NSDictionary *data) {

        NSDictionary *breadcrumb = [NSJSONSerialization JSONObjectWithData: data[@"data"] options:NSJSONReadingAllowFragments error:NULL];

        NSString *timestamp = breadcrumb[@"timestamp"];
        NSString *category = breadcrumb[@"category"];

        // Is a console log message
        if ([category isEqualToString:@"console"]){
            return [NSString stringWithFormat:@"🕰 %@ \n%@ - %@", timestamp, breadcrumb[@"level"], breadcrumb[@"message"]];
        }

        // Is the start of an API call
        if ([category isEqualToString:@"fetch"]){
            NSString *url =  breadcrumb[@"data"][@"url"];
            NSString *method = breadcrumb[@"data"][@"method"];
            NSString *status = @"START";

            return [NSString stringWithFormat:@"🕰 %@ \n%@ - %@ %@",timestamp, status, method, url];
        }

        // Is the end of an API call
        if ([category isEqualToString:@"xhr"]){
            NSString *url =  breadcrumb[@"data"][@"url"];
            NSString *method = breadcrumb[@"data"][@"method"];
            NSString *status = breadcrumb[@"data"][@"status_code"];

            return [NSString stringWithFormat:@"🕰 %@ \n%@   - %@ %@", timestamp, status, method, url];
        }

        // Is a generic API call
        if (category) {
           return [NSString stringWithFormat:@"🕰 %@ \n🔎 %@ \n%@", timestamp, category, breadcrumb[@"data"]];
        }

        // Never seen it happen, but we have a select below just in case
        return nil;
    }];

    UITextView *tv = [[UITextView alloc] initWithFrame:self.view.bounds];
    tv.font = [UIFont fontWithName:@"Menlo-Regular" size:13];
    tv.textContainerInset = UIEdgeInsetsMake(60, 20, 60, 20);
    tv.contentOffset = CGPointMake(0, 60);
    tv.editable = NO;
    [self.view addSubview:tv];
    [tv alignToView:self.view];

    if(ARAppStatus.isDev) {
        tv.text = @"Cannot access breadcrumbs in dev mode. Sorry.";
    } else {
        tv.text = [[messages select:^BOOL(id object) { return object; }] join:@"\n\n"];
    }

}

@end
