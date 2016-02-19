#import "ARWorksForYouNotificationItem.h"
#import "Artwork.h"
#import "Artist.h"


@interface ARWorksForYouNotificationItem ()
@property (nonatomic, strong) Artist *artist;
@property (nonatomic, strong) NSArray<Artwork *> *artworks;
@end


@implementation ARWorksForYouNotificationItem

- (instancetype)initWithArtist:(Artist *)artist artworks:(NSArray<Artwork *> *)artworks date:(NSDate *)date
{
    self = [super init];
    if (!self) return nil;

    _artist = artist;
    _artworks = artworks;
    _date = date;

    return self;
}

- (NSString *)formattedNumberOfWorks
{
    NSInteger artworkCount = self.artworks.count;

    if (artworkCount == 1) {
        return @"1 Work Added";
    } else if (artworkCount) {
        return [NSString stringWithFormat:@"%lu Works Added", (unsigned long)artworkCount];
    }

    return @"";
}

@end
