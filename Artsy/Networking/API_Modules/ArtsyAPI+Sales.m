#import "Artwork.h"
#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+Sales.h"
#import "ARRouter.h"
#import "ARAnalyticsConstants.h"

#import "MTLModel+JSON.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <ARAnalytics/ARAnalytics.h>

@implementation ArtsyAPI (Sales)

+ (void)getSalesWithArtwork:(NSString *)artworkID
                    success:(void (^)(NSArray *sales))success
                    failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter salesWithArtworkRequest:artworkID];
    [self getRequest:request parseIntoAnArrayOfClass:[Sale class] success:success failure:failure];
}

+ (void)getSaleWithID:(NSString *)saleID
              success:(void (^)(Sale *sale))success
              failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter requestForSaleID:saleID];
    [self getRequest:request parseIntoAClass:[Sale class] success:success failure:failure];
}

+ (void)getSaleArtworksWithSale:(NSString *)saleID
                           page:(NSInteger)page
                       pageSize:(NSInteger)pageSize
                        success:(void (^)(NSArray<SaleArtwork *> *sale))success
                        failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter artworksForSaleRequest:saleID page:page pageSize:pageSize];
    [self getRequest:request parseIntoAnArrayOfClass:[SaleArtwork class] success:success failure:failure];
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
