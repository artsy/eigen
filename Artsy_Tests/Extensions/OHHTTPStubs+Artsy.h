

@interface OHHTTPStubs (Artsy)

/// Stubs a path and returns a dictionary as it's json representation with a 200 status code
+ (void)stubJSONResponseAtPath:(NSString *)path withResponse:(id)response;

/// Stubs a path and returns a dictionary as it's json representation with a custom status code
+ (void)stubJSONResponseAtPath:(NSString *)path withResponse:(id)response andStatusCode:(NSInteger)code;

/// Stubs a path, looking for specific params and returns a dictionary as it's json representation with a status code of 200
+ (void)stubJSONResponseAtPath:(NSString *)path withParams:(NSDictionary *)params withResponse:(id)response;

/// Stubs a path, looking for specific params and returns a dictionary as it's json representation with a custom status code
+ (void)stubJSONResponseAtPath:(NSString *)path withParams:(NSDictionary *)params withResponse:(id)response andStatusCode:(NSInteger)code;

/// Stubs a request with an image from the test bundle
+ (void)stubImageResponseAtPath:(NSString *)path withTestImageFile:(NSString *)imageName;

/// Stubs a request with a default image
+ (void)stubImageResponseAtPathWithDefault:(NSString *)path;

@end
