#import "ARFeedItem.h"

@interface ARFollowArtistFeedItem : ARFeedItem<UIActivityItemSource>

@property (nonatomic, copy, readonly) NSArray *artworks;
@property (nonatomic, readonly) Artist *artist;
@property (nonatomic, readonly) Profile *profile;

@end
