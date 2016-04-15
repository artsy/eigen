
#import "ARTopMenuViewController+Testing.h"


@implementation ARTopMenuViewController (Testing)

- (instancetype)initWithStubbedNetworking
{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/xapp_token" withResponse:@{}];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/site_hero_units" withResponse:@[ @{ @"heading" : @"something" } ]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@{}];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/shows/feed" withResponse:@{}];

    return [super init];
}

@end
