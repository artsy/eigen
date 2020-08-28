#import "ARHeartStatus.h"

@class Artist;

/// The Network Model for the ArtistViewController


@interface ARArtistNetworkModel : NSObject

- (instancetype)initWithArtist:(Artist *)artist;
@property (readonly, nonatomic, strong) Artist *artist;

@end
