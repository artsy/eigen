#import "ARAuctionResultsNetworkModel.h"


@interface ARAuctionResultsNetworkModel ()
@property (nonatomic, strong, readonly) Artwork *artwork;
@end


@implementation ARAuctionResultsNetworkModel

- (instancetype)initWithArtwork:(Artwork *)artwork;
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _artwork = artwork;
    return self;
}

- (void)getRelatedAuctionResults:(void (^)(NSArray<AuctionLot *> *auctionResults))success;
{
    [self.artwork getRelatedAuctionResults:success];
}

@end
