#import "OHHTTPStubs+Artsy.h"
#import "ARRouter.h"

#import <OHHTTPStubs/OHHTTPStubs.h>
#import <AFNetworking/AFHTTPRequestOperation.h>


@implementation OHHTTPStubs (Artsy)

+ (void)stubJSONResponseForHost:(NSString *)host withResponse:(id)response
{
    NSObject <OHHTTPStubsDescriptor> *stub = [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
        if ([host containsString:@"*"]) {
            NSString *theirHost = request.URL.host;
            NSArray *components = [theirHost componentsSeparatedByString:@"*"];
            return [theirHost hasPrefix:components.firstObject] && [theirHost hasSuffix:components.lastObject];
        } else {
            return [request.URL.host isEqualToString: host];
        }
    } withStubResponse:^OHHTTPStubsResponse *(NSURLRequest *request) {
        NSData *data = [NSJSONSerialization dataWithJSONObject:response options:0 error:nil];
        return [OHHTTPStubsResponse responseWithData:data statusCode:200 headers:@{ @"Content-Type": @"application/json" }];
    }];

    stub.name = host;
}

+ (void)stubJSONResponseAtPath:(NSString *)path withResponse:(id)response
{
    [OHHTTPStubs stubJSONResponseAtPath:path withResponse:response andStatusCode:200];
}

+ (void)stubJSONResponseAtPath:(NSString *)path withResponse:(id)response andStatusCode:(NSInteger)code;
{
    [OHHTTPStubs stubJSONResponseAtPath:path withParams:nil withResponse:response andStatusCode:code];
}

+ (void)stubJSONResponseAtPath:(NSString *)path withParams:(NSDictionary *)params withResponse:(id)response
{
    [OHHTTPStubs stubJSONResponseAtPath:path withParams:params withResponse:response andStatusCode:200];
}

+ (void)stubJSONResponseAtPath:(NSString *)path withParams:(NSDictionary *)params withResponse:(id)response andStatusCode:(NSInteger)code
{
   NSObject <OHHTTPStubsDescriptor> *stub = [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
        if (request.URL == nil) {
            return nil;
//            [NSException raise:NSInvalidArgumentException format:@"Recieved a nil URL to stub: %@ - %@", NSStringFromClass([self class]), NSStringFromSelector(_cmd)];
        }

        NSURLComponents *requestComponents = [NSURLComponents componentsWithURL:request.URL resolvingAgainstBaseURL:NO];
        NSString *urlString = path;

        // Append the params dict as a query string
        if (params) {
            AFHTTPRequestSerializer *serializer = [[AFHTTPRequestSerializer alloc] init];
            NSURLRequest *request = [serializer requestWithMethod:@"GET" URLString:urlString parameters:params error:nil];
            urlString = [urlString stringByAppendingFormat:@"?%@", request.URL.query];
        }

        NSURL *stubbedURL = [NSURL URLWithString:urlString];
        NSURLComponents *stubbedComponents = [NSURLComponents componentsWithURL:stubbedURL resolvingAgainstBaseURL:NO];

        BOOL pathsMatch = [requestComponents.path isEqualToString:stubbedComponents.path];
        BOOL queriesMatch = params ? [requestComponents.query isEqualToString:stubbedComponents.query] : YES;
        return (pathsMatch && queriesMatch);

    } withStubResponse:^OHHTTPStubsResponse *(NSURLRequest *request) {
        NSData *data = [NSJSONSerialization dataWithJSONObject:response options:0 error:nil];
        return [OHHTTPStubsResponse responseWithData:data statusCode:(int)code headers:@{ @"Content-Type": @"application/json" }];
    }];

    stub.name = path;
}

+ (void)stubImageResponseAtPathWithDefault:(NSString *)path
{
    return [self stubImageResponseAtPath:path withTestImageFile:@"stubbed_image.png"];
}

+ (void)stubImageResponseAtPath:(NSString *)path withTestImageFile:(NSString *)imageName
{
    [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
        NSURLComponents *requestComponents = [NSURLComponents componentsWithURL:request.URL resolvingAgainstBaseURL:NO];
        return [requestComponents.path isEqualToString:path];

    } withStubResponse:^OHHTTPStubsResponse *(NSURLRequest *request) {
        NSBundle *bundle = [NSBundle bundleForClass:ARTestContext.class];
        NSString *path = [bundle pathForResource:imageName ofType:nil];
        NSAssert(path, @"Could not find image in test bundle");

        return [OHHTTPStubsResponse responseWithFileAtPath:path statusCode:200 headers:@{ @"Content-Type": @"image/xyz" }];
    }];
}

@end
