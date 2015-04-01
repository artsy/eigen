#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@interface WatchShow : NSObject

- (instancetype)initWithShowID:(NSString *)showID title:(NSString *)title partnerName:(NSString *)partnerName ausstellungsdauer:(NSString *)ausstellungsdauer locationString:(NSString *)locationString distanceFromString:(NSString *)distanceFromString coordinatesDictionary:(NSDictionary *)coordinates thumbnailImageURL:(NSURL *)thumbnailImageURL;


- (NSDictionary *)dictionaryRepresentation;
- (instancetype)initWithDictionary:(NSDictionary *)dictionary;

@property (nonatomic, copy, readonly) NSString *showID;
@property (nonatomic, copy, readonly) NSURL *thumbnailImageURL;
@property (nonatomic, copy, readonly) NSString *title;
@property (nonatomic, copy, readonly) NSString *parterName;
@property (nonatomic, copy, readonly) NSString *ausstellungsdauer;
@property (nonatomic, copy, readonly) NSString *locationString;
@property (nonatomic, copy, readonly) NSDictionary *coordinates;

- (CLLocation *)location;

/// Generated if there is coordinates, in Miles with 1 DP
@property (nonatomic, copy, readonly) NSString *distanceFromString;

- (void)setupDistanceFromLocation:(CLLocation *)location;

- (NSString *)locationAndDistance;

@end
