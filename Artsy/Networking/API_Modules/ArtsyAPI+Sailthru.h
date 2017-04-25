#import "ArtsyAPI.h"

NS_ASSUME_NONNULL_BEGIN

@interface ArtsyAPI (Sailthru)

+ (void)getDecodedURLAndRegisterClick:(NSURL *)encodedURL completion:(void (^)(NSURL *decodedURL))completion;

@end

NS_ASSUME_NONNULL_END
