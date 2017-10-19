#import "ArtsyAPI.h"

@class AFHTTPRequestOperation;

typedef void (^NetworkFailureBlock)(NSURLRequest *, NSHTTPURLResponse *, NSError *);
NetworkFailureBlock passOnNetworkError(void (^)(NSError *error));


@interface ArtsyAPI (Private)

/// A simple method for performing a ARJSONRequest and passing back the returned JSON as a native object. Nulls are maintained.
+ (AFHTTPRequestOperation *)performRequest:(NSURLRequest *)request success:(void (^)(id))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error))failure;
/// A simple method for performing a ARJSONRequest and passing back the returned JSON as a native object. Nulls are removed if specified.
+ (AFHTTPRequestOperation *)performRequest:(NSURLRequest *)request removeNullsFromResponse:(BOOL)removeNulls success:(void (^)(id))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error))failure;

/// A method for performing an ARJSONRequest that checks for GraphQL errors prior to invoking the success callback.
/// It also removes keys with null values from the response JSON.
+ (AFHTTPRequestOperation *)performGraphQLRequest:(NSURLRequest *)request success:(void (^)(id))success failure:(void (^)(NSError *error))failure;

/// A method for performing an ARJSONRequest that checks for GraphQL errors prior to invoking the success callback.
+ (AFHTTPRequestOperation *)performGraphQLRequest:(NSURLRequest *)request success:(void (^)(id))success failure:(void (^)(NSError *error))failure;

/// A more complete response API for the request, in case you need more than just the response object
+ (AFHTTPRequestOperation *)performRequest:(NSURLRequest *)request fullSuccess:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failureCallback;

+ (AFHTTPRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAClass:(Class)klass success:(void (^)(id))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAnArrayOfClass:(Class)klass success:(void (^)(NSArray *))success failure:(void (^)(NSError *error))failure;

/// If the object you're after is hidden behind a key, this function is for you
+ (AFHTTPRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAClass:(Class)klass withKey:(NSString *)key success:(void (^)(id))success failure:(void (^)(NSError *error))failure;

/// If the array you're after is hidden behind a key, this function is for you
+ (AFHTTPRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAnArrayOfClass:(Class)klass withKey:(NSString *)key success:(void (^)(NSArray *objects))success failure:(void (^)(NSError *error))failure;

/// If you're dealing with dictionary as the root object and want an array of objects
+ (AFHTTPRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAnArrayOfClass:(Class)klass fromDictionaryWithKey:(NSString *)key success:(void (^)(NSArray *objects))success failure:(void (^)(NSError *error))failure;

/// Performs a series of requests then runs the success block
+ (void)getRequests:(NSArray *)requests success:(void (^)(NSArray *operations))completed;

+ (void)handleXappTokenError:(NSError *)error;
@end
