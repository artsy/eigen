#import <Foundation/Foundation.h>
#import "WatchArtwork.h"

@class Artwork;

@interface WatchArtwork (FromArtwork)

- (instancetype)initWithArtsyArtwork:(Artwork *)artwork;

@end
