#import <Foundation/Foundation.h>
#import "WatchArtwork.h"


@interface ARWatchMenuActionController : NSObject

- (void)heartArtwork:(WatchArtwork *)artwork;
- (void)unheartArtwork:(WatchArtwork *)artwork;

- (void)heartArtworkArtist:(WatchArtwork *)artwork;
- (void)unheartArtworkArtist:(WatchArtwork *)artwork;

@end
