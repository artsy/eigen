#import <AFNetworking/AFNetworking.h>


@implementation AFHTTPRequestOperation (JSON)

+ (instancetype)JSONRequestOperationWithRequest:(NSURLRequest *)urlRequest success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure
{
    return [self JSONRequestOperationWithRequest:urlRequest removeNulls:NO success:success failure:failure];
}

+ (instancetype)JSONRequestOperationWithRequest:(NSURLRequest *)urlRequest removeNulls:(BOOL)removeNulls success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure
{
    AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:urlRequest];
    AFJSONResponseSerializer *responseSerializer = [[AFJSONResponseSerializer alloc] init];
    responseSerializer.removesKeysWithNullValues = removeNulls;
    operation.responseSerializer = responseSerializer;
    [operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        if (success) { success(operation.request, operation.response, responseObject); }
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        if (failure) { failure(operation.request, operation.response, error, operation.responseObject); }
    }];

    return operation;
}

@end
