#import <Foundation/Foundation.h>

@protocol AuctionResultsNetworkModel <NSObject>

- (instancetype)initWithArtwork:(Artwork *)artwork;

- (void)getRelatedAuctionResults:(void (^)(NSArray<AuctionLot *> *auctionResults))success;

@end


@interface ARAuctionResultsNetworkModel : NSObject <AuctionResultsNetworkModel>
@end
