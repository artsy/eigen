#import "ArtsyAPI.h"

NS_ASSUME_NONNULL_BEGIN


@interface ArtsyAPI (HEAD)

+ (void)getHTTPResponseHeadersForRequest:(NSURLRequest *)request completion:(void (^)(NSInteger responseCode, NSDictionary *headers, NSError *_Nullable error))completion;

@end

NS_ASSUME_NONNULL_END
