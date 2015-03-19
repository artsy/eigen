#import "ARShareableObject.h"

@class Partner, Fair, MapPoint, PartnerShowFairLocation;

@interface PartnerShow : MTLModel <MTLJSONSerializing, ARShareableObject>

@property (nonatomic, strong, readonly) Partner *partner;
@property (nonatomic, strong, readonly) Fair *fair;

@property (nonatomic, copy, readonly) NSString *showID;

@property (nonatomic, copy, readonly) NSString *name;

@property (nonatomic, copy, readonly) NSArray *artists;
@property (nonatomic, copy, readonly) NSArray *artworks;
@property (nonatomic, copy, readonly) NSArray *posts;

@property (nonatomic, copy, readonly) NSArray *installationShots;

@property (nonatomic, readonly) NSDate *startDate;
@property (nonatomic, readonly) NSDate *endDate;

@property (nonatomic, copy, readonly) NSString *location;
@property (nonatomic, copy, readonly) NSString *locationInFair;

@property (nonatomic, strong, readonly) PartnerShowFairLocation *fairLocation;

- (id)initWithShowID:(NSString *)showID;

/// Titles for display
- (NSString *)title;

/// Subtitles for display
- (NSString *)subtitle;

/// A string with the date range for the show, or corrosponding fair
- (NSString *)ausstellungsdauer;

/// A useful method for date range and location
- (NSString *)ausstellungsdauerAndLocation;

- (BOOL)hasMapLocation;

/// Show image url, could be an artwork / installation shot
- (NSURL *)imageURLWithFormatName:(NSString *)formatName;

- (AFJSONRequestOperation *)getArtworksAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success;

@end
