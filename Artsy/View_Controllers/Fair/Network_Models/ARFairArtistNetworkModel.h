#import "ARFairArtistViewController.h"


@interface ARFairArtistNetworkModel : NSObject <FairArtistNeworkModel>

@end


@interface ARStubbedFairArtistNetworkModel : NSObject <FairArtistNeworkModel>
@property (nonatomic, copy) NSArray *shows;
@property (nonatomic, strong) Artist *artist;
@end
