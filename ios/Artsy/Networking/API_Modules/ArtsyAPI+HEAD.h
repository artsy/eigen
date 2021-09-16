#import "ArtsyAPI.h"

NS_ASSUME_NONNULL_BEGIN


@interface ArtsyAPI (HEAD)

+ (void)getHTTPRedirectForRequest:(NSURLRequest *)request completion:(void (^)(NSString *_Nullable redirectLocation, NSError *_Nullable error))completion;

@end

NS_ASSUME_NONNULL_END
