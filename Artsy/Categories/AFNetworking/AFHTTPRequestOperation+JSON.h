#import <Foundation/Foundation.h>


@interface AFHTTPRequestOperation (JSON)

/// A shim to provide the same API as AFJSONOperation used to do
/// see http://cocoadocs.org/docsets/AFNetworking/1.3.4/Classes/AFJSONRequestOperation.html#//api/name/JSONRequestOperationWithRequest:success:failure:
/// to see how it used to work

+ (instancetype)JSONRequestOperationWithRequest:(NSURLRequest *)urlRequest success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure;

@end
