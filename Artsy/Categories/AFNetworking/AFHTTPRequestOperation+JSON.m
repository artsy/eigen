@import AFNetworking;


@implementation AFHTTPRequestOperation (JSON)

+ (instancetype)JSONRequestOperationWithRequest:(NSURLRequest *)urlRequest success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure
{
    AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:urlRequest];
    operation.responseSerializer = [[AFJSONResponseSerializer alloc] init];
    [operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        if (success) { success(operation.request, operation.response, responseObject); }
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        if (failure) { failure(operation.request, operation.response, error, operation.responseObject); }
    }];

    return operation;
}

@end
