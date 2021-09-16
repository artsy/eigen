#import "ArtsyAPI.h"

NS_ASSUME_NONNULL_BEGIN


@interface ArtsyAPI (Pages)

+ (void)getPageContentForSlug:(NSString *)slug completion:(void (^)(NSString *))completion;

@end

NS_ASSUME_NONNULL_END
