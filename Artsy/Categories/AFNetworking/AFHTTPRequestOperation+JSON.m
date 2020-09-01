#import <Foundation/Foundation.h>
#import <AFNetworking/AFNetworking.h>

@implementation AFHTTPSessionManager (JSON)

+ (instancetype)JSONRequestOperationWithRequest:(NSURLRequest *)urlRequest
                                        success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success
                                        failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure
{
    return [self JSONRequestOperationWithRequest:urlRequest removeNulls:NO success:success failure:failure];
}

+ (instancetype)JSONRequestOperationWithRequest:(NSURLRequest *)urlRequest
                                    removeNulls:(BOOL)removeNulls
                                        success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success
                                        failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure
{
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    AFJSONResponseSerializer *responseSerializer = [[AFJSONResponseSerializer alloc] init];
    responseSerializer.removesKeysWithNullValues = removeNulls;
    manager.responseSerializer = responseSerializer;
    
    [manager GET: [NSURL URLWithString: urlRequest.URL.absoluteString]
         headers:nil
      parameters:nil
        progress:nil
         success:^(NSURLSessionTask *task, id responseObject) {
        if (success) {
            success(task.originalRequest, (NSHTTPURLResponse*) task.response, responseObject);
           }
        
    }
         failure:^(NSURLSessionTask *operation, NSError *error) {
        if (failure) { failure(operation.originalRequest, (NSHTTPURLResponse*) operation.response, error, operation.response);
        }
    }];

    return manager;
}

@end
