#import "ARArtistNetworkModel.h"

@interface ARStubbedArtistNetworkModel : ARArtistNetworkModel

@property (readwrite, nonatomic, strong) Artist *artistForArtistInfo;
@property (readwrite, nonatomic, copy) NSArray *artworksForArtworksAtPage;

@end
