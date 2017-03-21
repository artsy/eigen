#import <Mantle/Mantle.h>

@class SaleArtwork;


@interface LotStanding : MTLModel <MTLJSONSerializing>

@property (nonatomic, strong, readonly) SaleArtwork *saleArtwork;
@property (nonatomic, assign, readonly) BOOL isLeading;

@end
