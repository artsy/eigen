#import "ARFeedItem.h"

@class Artist, Profile;

@interface ARFollowArtistFeedItem : ARFeedItem <UIActivityItemSource>

@property (nonatomic, copy, readonly) NSArray *artworks;
@property (nonatomic, readonly) Artist *artist;
@property (nonatomic, readonly) Profile *profile;

@end
