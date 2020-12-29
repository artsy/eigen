#import "ArtsyAPI.h"

@class Sale, SaleArtwork;
@class AFHTTPRequestOperation;

NS_ASSUME_NONNULL_BEGIN

@interface ArtsyAPI (Sales)

+ (void)getSaleWithID:(NSString *)saleID
              success:(void (^)(Sale *sale))success
              failure:(void (^)(NSError *error))failure;

+ (void)getLiveSaleStaticDataWithSaleID:(NSString *)saleID
                                   role:(NSString * __nullable)role
                                success:(void (^)(id state))success
                                failure:(void (^)(NSError *error))failure;

@end

NS_ASSUME_NONNULL_END
