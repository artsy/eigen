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

#import "MTLModel+JSON.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AFNetworking/AFNetworking.h>


@implementation ArtsyAPI (Artworks)

+ (void)getArtworkInfo:(NSString *)artworkID success:(void (^)(Artwork *artwork))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworkInfoRequestForArtworkID:artworkID];
    [self getRequest:request parseIntoAClass:Artwork.class success:success failure:failure];
}

+ (AFHTTPRequestOperation *)getArtistArtworks:(Artist *)artist andPage:(NSInteger)page withParams:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSMutableDictionary *newParams = [[NSMutableDictionary alloc] initWithDictionary:@{ @"size" : @10,
                                                                                        @"page" : @(page) }];
    [newParams addEntriesFromDictionary:params];
    NSURLRequest *request = [ARRouter newArtistArtworksRequestWithParams:newParams andArtistID:artist.artistID];
    return [self getRequest:request parseIntoAnArrayOfClass:Artwork.class success:success failure:failure];
}

+ (AFHTTPRequestOperation *)getArtworkFromUserFavorites:(NSString *)cursor success:(void (^)(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworksFromUsersFavoritesRequestWithCursor:cursor];
    return [self performGraphQLRequest:request success:^(id json) {
        id artworksConnection = json[@"data"][@"me"][@"saved_artworks"][@"artworks_connection"];
        NSDictionary *pageInfo = artworksConnection[@"pageInfo"];
        NSArray *artworksJson = [artworksConnection[@"edges"] valueForKey:@"node"];

        // Parse artworks, sale artworks, and make manual connection between the two if appropritate.
        NSArray *artworks = [artworksJson map:^id(id json) {
            Artwork *artwork = [Artwork modelWithJSON:json];

            id saleArtworkJSON = json[@"sale_artwork"];
            if (saleArtworkJSON != [NSNull null]) {
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

+ (AFHTTPRequestOperation *)getArtworksForGene:(Gene *)gene atPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworksFromGeneRequest:gene.geneID atPage:page];
    return [self getRequest:request parseIntoAnArrayOfClass:Artwork.class fromDictionaryWithKey:@"hits" success:success failure:failure];
}

+ (AFHTTPRequestOperation *)getAuctionComparablesForArtwork:(Artwork *)artwork success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    NSURLRequest *request = [ARRouter newArtworkComparablesRequest:artwork];
    return [self getRequest:request parseIntoAnArrayOfClass:AuctionLot.class success:success failure:failure];
}

+ (AFHTTPRequestOperation *)createPendingOrderWithArtworkID:(NSString *)artworkID editionSetID:(NSString *)editionSetID success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    NSURLRequest *request = [ARRouter newPendingOrderWithArtworkID:artworkID editionSetID:editionSetID];
    return [self performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        failure(error);
    }];
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

+ (AFHTTPRequestOperation *)getFairsForArtwork:(Artwork *)artwork success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    // The API returns related fairs regardless of whether or not they have the associated
    // data necessary to render the fair view. Fairs without an organizer/profile should
    // not be rendered as a fair. It is up to the client to make this distinction.

    NSURLRequest *request = [ARRouter newFairsRequestForArtwork:artwork];
    return [self getRequest:request
        parseIntoAnArrayOfClass:[Fair class]
                        success:^(NSArray *fairs) {
            success([fairs select:^BOOL(Fair *fair) {
                return fair.defaultProfileID != nil
                       || fair.organizer.fairOrganizerID != nil
                       || fair.organizer.profileID != nil;
            }]);
                        }
                        failure:failure];
}

+ (AFHTTPRequestOperation *)getShowsForArtworkID:(NSString *)artworkID
                                        inFairID:(NSString *)fairID
                                         success:(void (^)(NSArray *shows))success
                                         failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newShowsRequestForArtworkID:artworkID andFairID:fairID];
    return [self getRequest:request
        parseIntoAnArrayOfClass:[PartnerShow class]
                        success:success
                        failure:failure];
}

@end
