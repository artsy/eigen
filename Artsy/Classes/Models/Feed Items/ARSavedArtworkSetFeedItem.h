#import "ARFeedItem.h"
#import "User.h"

@interface ARSavedArtworkSetFeedItem : ARFeedItem

@property (readonly, nonatomic) Profile *profile;
@property (readonly, nonatomic) NSArray *artworks;

@end
