#import "Artwork.h"
#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+Sales.h"
#import "ARRouter+RestAPI.h"
#import "ARAnalyticsConstants.h"

#import "MTLModel+JSON.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

@implementation ArtsyAPI (Sales)

+ (void)getSaleWithID:(NSString *)saleID
              success:(void (^)(Sale *sale))success
              failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter requestForSaleID:saleID];
    [self getRequest:request parseIntoAClass:[Sale class] success:success failure:failure];
}

+ (void)getLiveSaleStaticDataWithSaleID:(NSString *)saleID
                                   role:(NSString *)role
                                success:(void (^)(id state))success
                                failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter liveSaleStaticDataRequest:saleID role:role];
    [self performRequest:request
                 success:success
                 failure:passOnNetworkError(failure)];
}

@end
