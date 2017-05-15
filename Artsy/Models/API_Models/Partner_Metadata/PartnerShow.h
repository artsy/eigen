#import <Mantle/Mantle.h>

#import "ARShareableObject.h"
#import "ARSpotlight.h"

@class Partner, Fair, MapPoint, PartnerShowFairLocation, PartnerShowCoordinates, Location;
@class AFHTTPRequestOperation;


@interface PartnerShow : MTLModel <MTLJSONSerializing, ARShareableObject, ARSpotlightMetadataProvider>

@property (nonatomic, strong, readonly) Partner *partner;
@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, strong, readonly) Location *location;

@property (nonatomic, copy, readonly) NSString *showID;
@property (nonatomic, copy, readonly) NSString *showUUID;

@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *officialDescription;

@property (nonatomic, copy, readonly) NSArray *artists;
@property (nonatomic, copy, readonly) NSArray *artworks;
@property (nonatomic, copy, readonly) NSArray *posts;

@property (nonatomic, copy, readonly) NSArray *installationShots;

@property (nonatomic, readonly) NSDate *startDate;
@property (nonatomic, readonly) NSDate *endDate;

@property (nonatomic, copy, readonly) NSString *locationInFair;

@property (nonatomic, strong, readonly) PartnerShowFairLocation *fairLocation;

- (id)initWithShowID:(NSString *)showID;

/// Titles for display
- (NSString *)title;

/// Subtitles for display
- (NSString *)subtitle;

/// A string with the date range for the show, or corrosponding fair
- (NSString *)ausstellungsdauer;

/// A useful method for date range and location (either the city or the fair booth location)
- (NSString *)ausstellungsdauerAndLocation;

- (BOOL)hasMapLocation;

/// Show image url, could be an artwork / installation shot
- (NSURL *)imageURLWithFormatName:(NSString *)formatName;

/// A small preview URL that represents the show
- (NSURL *)smallPreviewImageURL;


- (AFHTTPRequestOperation *)getArtworksAtPage:(NSInteger)page success:(void (^)(NSArray *artworks))success;

@end
