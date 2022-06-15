#import <Foundation/Foundation.h>
#import <AFNetworking/AFHTTPRequestOperation.h>

@interface AFHTTPRequestOperation (JSON)

/// A shim to provide the same API as AFJSONOperation used to do
/// see http://cocoadocs.org/docsets/AFNetworking/1.3.4/Classes/AFJSONRequestOperation.html#//api/name/JSONRequestOperationWithRequest:success:failure:
/// to see how it used to work

/// Same as the function beneath, but doesn't strip nulls from JSON response body.
+ (instancetype)JSONRequestOperationWithRequest:(NSURLRequest *)urlRequest success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure;

+ (instancetype)JSONRequestOperationWithRequest:(NSURLRequest *)urlRequest removeNulls:(BOOL)removeNulls success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure;

@end
