#import "ARInboxComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

#import <React/RCTRootView.h>

@implementation ARInboxComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueries;
{
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersInboxQuery"]];
}

- (instancetype)initWithInbox;
{
    if ((self = [super initWithEmission:nil
                             moduleName:@"Inbox"
                      initialProperties:nil])) {
    }
    return self;
}

@end
