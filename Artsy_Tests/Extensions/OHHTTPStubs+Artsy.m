@import OHHTTPStubs;
@import AFNetworking;


@implementation OHHTTPStubs (Artsy)

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
    [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
        NSURLComponents *requestComponents = [NSURLComponents componentsWithURL:request.URL resolvingAgainstBaseURL:NO];
        NSString *urlString = path;

        if (params) {
            NSString *stubbedQueryString = AFQueryStringFromParametersWithEncoding(params, NSUTF8StringEncoding);
            urlString = [urlString stringByAppendingFormat:@"?%@", stubbedQueryString];
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
