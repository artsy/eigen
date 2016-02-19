#import <Foundation/Foundation.h>

@class Artist, Artwork;


@interface ARWorksForYouNotificationItem : NSObject

@property (nonatomic, copy, readonly) NSDate *date;
@property (nonatomic, strong, readonly) Artist *artist;
@property (nonatomic, strong, readonly) NSArray<Artwork *> *artworks;

- (NSString *)formattedNumberOfWorks;

- (instancetype)initWithArtist:(Artist *)artist artworks:(NSArray<Artwork *> *)artworks date:(NSDate *)date;

@end
