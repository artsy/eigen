#import "Artist.h"
#import "Artwork.h"
#import "ArtsyAPI+Private.h"
#import "ARRouter.h"
#import "AuctionLot.h"
#import "Fair.h"
#import "FairOrganizer.h"
#import "Gene.h"
#import "PartnerShow.h"
#import "ARDispatchManager.h"
#import "ARLogger.h"
#import "ARAnalyticsConstants.h"

#import "MTLModel+JSON.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AFNetworking/AFNetworking.h>
#import <ARAnalytics/ARAnalytics.h>


@implementation ArtsyAPI (Artworks)

+ (AFHTTPRequestOperation *)getArtworkFromUserFavorites:(NSString *)cursor success:(void (^)(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworksFromUsersFavoritesRequestWithCursor:cursor];
    return [self performGraphQLRequest:request success:^(id json) {
        id artworksConnection = json[@"data"][@"me"][@"saved_artworks"][@"artworks_connection"];
        NSDictionary *pageInfo = artworksConnection[@"pageInfo"];
        NSArray *artworksJson = [artworksConnection[@"edges"] valueForKey:@"node"];

        if (!artworksJson) {
            NSLog(@"Failure fetching GraphQL data: %@", json);
            [ARAnalytics event:ARAnalyticsGraphQLResponseError withProperties:json];
            if (failure) {
                failure([NSError errorWithDomain:@"JSON parsing" code:0 userInfo:json]);
            }
            return;
        }

        // Parse artworks, sale artworks, and make manual connection between the two if appropritate.
        NSArray *artworks = [artworksJson map:^id(id json) {
            // AFNetworking will remove keys from dictionaries that contain null values, but not arrays that contain *only* nulls.
            // Once https://github.com/AFNetworking/AFNetworking/pull/4052 is merged, we can update AFNetworking and remove this NSNull check.
            // So we need to do some additional checking, just to be safe.
            if (json == [NSNull null]) { return nil; }
            Artwork *artwork = [Artwork modelWithJSON:json];

            id saleArtworkJSON = json[@"sale_artwork"];
            if (saleArtworkJSON) {
                SaleArtwork *saleArtwork = [SaleArtwork modelWithJSON:saleArtworkJSON];
                artwork.auction = saleArtwork.auction;
                artwork.saleArtwork = saleArtwork;
            }
            return artwork;
        }];

        if (success) {
            success(pageInfo[@"endCursor"], [pageInfo[@"hasNextPage"] boolValue], artworks);
        }
    } failure:failure];
}

+ (void)getAuctionArtworkWithSale:(NSString *)saleID artwork:(NSString *)artworkID success:(void (^)(id auctionArtwork))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *saleArtworkRequest = [ARRouter saleArtworkRequestForSaleID:saleID artworkID:artworkID];
    NSURLRequest *biddersRequest = [ARRouter biddersRequestForSale:saleID];
    NSURLRequest *bidderPositionRequest = [ARRouter bidderPositionsRequestForSaleID:saleID artworkID:artworkID];

    [self getRequests:@[ saleArtworkRequest, biddersRequest, bidderPositionRequest ] success:^(NSArray *operations) {

        // Doing all parsing here since completion blocks fire async per: https://github.com/AFNetworking/AFNetworking/issues/362
        ar_dispatch_async(^{

            AFHTTPRequestOperation *saleArtworkOperation = [operations find:^BOOL(AFHTTPRequestOperation *operation) {
                return operation.request == saleArtworkRequest;
            }];

            AFHTTPRequestOperation *biddersOperation = [operations find:^BOOL(AFHTTPRequestOperation *operation) {
                return operation.request == biddersRequest;
            }];

            AFHTTPRequestOperation *positionsOperation = [operations find:^BOOL(AFHTTPRequestOperation *operation) {
                return operation.request == bidderPositionRequest;
            }];

            // Parse sale artwork
            SaleArtwork *saleArtwork = nil;
            if (saleArtworkOperation.error == nil) {
                saleArtwork = [SaleArtwork modelWithJSON:saleArtworkOperation.responseObject];
            }

            // Parse bidders
            if (biddersOperation.error == nil) {
                for (NSDictionary *dictionary in biddersOperation.responseObject) {
                    Bidder *bidder = [Bidder modelWithJSON:dictionary];
                    if ([bidder.saleID isEqualToString:saleID]) {
                        saleArtwork.bidder = bidder;
                        break;
                    }
                }
            }

            // Parse bidder positions
            if (positionsOperation.error == nil) {
                saleArtwork.positions = [positionsOperation.responseObject map:^id(NSDictionary *dictionary) {
                    NSError *error = nil;
                    BidderPosition *position = [BidderPosition  modelWithJSON:dictionary error:&error];
                    if (error) {
                        ARErrorLog(@"Couldn't parse bidder position. Error: %@", error.localizedDescription);
                    }
                    return position;
                }];
            }
            
            if (success) {
                ar_dispatch_main_queue(^{
                    success(saleArtwork);
                });
            }
        });

    }];
}

@end
