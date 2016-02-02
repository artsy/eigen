//#import "ARRouter.h"
#import "ArtsyAPI.h"

@class AFHTTPRequestOperation;

@interface ArtsyAPI (Private)

/// A simple method for performing a ARJSONRequest and passing back the returned JSON as a native object
+ (AFHTTPRequestOperation *)performRequest:(NSURLRequest *)request success:(void (^)(id))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error))failure;

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
