#import "ARRouter.h"


@interface ArtsyAPI (Private)

/// A simple method for performing a ARJSONRequest and passing back the returned JSON as a native object
+ (AFJSONRequestOperation *)performRequest:(NSURLRequest *)request success:(void (^)(id))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error))failure;

+ (AFJSONRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAClass:(Class)klass success:(void (^)(id))success failure:(void (^)(NSError *error))failure;
+ (AFJSONRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAnArrayOfClass:(Class)klass success:(void (^)(NSArray *))success failure:(void (^)(NSError *error))failure;

/// If the object you're after is hidden behind a key, this function is for you
+ (AFJSONRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAClass:(Class)klass withKey:(NSString *)key success:(void (^)(id))success failure:(void (^)(NSError *error))failure;

/// If the array you're after is hidden behind a key, this function is for you
+ (AFJSONRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAnArrayOfClass:(Class)klass withKey:(NSString *)key success:(void (^)(NSArray *))success failure:(void (^)(NSError *error))failure;

/// If you're dealing with dictionary as the root object and want an array of objects
+ (AFJSONRequestOperation *)getRequest:(NSURLRequest *)request parseIntoAnArrayOfClass:(Class)klass fromDictionaryWithKey:(NSString *)key success:(void (^)(NSArray *))success failure:(void (^)(NSError *error))failure;

+ (void)getXappTokenWithCompletion:(void (^)(NSString *xappToken, NSDate *expirationDate))callback;
+ (void)getXappTokenWithCompletion:(void (^)(NSString *xappToken, NSDate *expirationDate))callback failure:(void (^)(NSError *error))failure;
+ (void)handleXappTokenError:(NSError *)error;
@end
