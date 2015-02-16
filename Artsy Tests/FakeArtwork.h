#import "Artwork.h"

/// An Artwork that uses instant local promises instead of async
/// HTTP requests. You will need to set the local property like
/// fair, saleArtwork, or self before ketting it do its thing.

@interface FakeArtwork : Artwork

@property (nonatomic, strong, readwrite) SaleArtwork *saleArtwork;

@end
