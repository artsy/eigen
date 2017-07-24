#import "Artwork.h"
#import "ArtsyAPI+Private.h"
#import "ARRouter.h"

#import "MTLModel+JSON.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

@implementation ArtsyAPI (Sales)

+ (void)getSalesWithArtwork:(NSString *)artworkID
                    success:(void (^)(NSArray *sales))success
                    failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter salesWithArtworkRequest:artworkID];
    [self getRequest:request parseIntoAnArrayOfClass:[Sale class] success:success failure:failure];
}

+ (AFHTTPRequestOperation *)getArtworksForSale:(NSString *)saleID
                                       success:(void (^)(NSArray *))success
                                       failure:(void (^)(NSError *))failure
{
    NSURLRequest *request = [ARRouter artworksForSaleRequest:saleID];
    return [self performRequest:request success:^(id json) {
        NSArray *saleArtworksJSON = json[@"data"][@"sale"][@"sale_artworks"];

        NSArray *artworks = [saleArtworksJSON map:^id(id json) {
            // This is messy, sorry. We need to fill those back references from artwork -> sale artwork
            // without creating a reference cycle. So we inflate two models with JSON.
            SaleArtwork *saleArtwork = [SaleArtwork modelWithJSON:json];
            Artwork *artwork = [Artwork modelWithJSON:json[@"artwork"]];
            artwork.auction = saleArtwork.auction;
            artwork.saleArtwork = saleArtwork;
            return artwork;
        }];
        
        if (success) {
            success(artworks);
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
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
