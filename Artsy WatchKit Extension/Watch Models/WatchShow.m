#import "WatchShow.h"
#import <CoreGraphics/CoreGraphics.h>

@implementation WatchShow

- (instancetype)initWithShowID:(NSString *)showID title:(NSString *)title partnerName:(NSString *)partnerName ausstellungsdauer:(NSString *)ausstellungsdauer locationString:(NSString *)locationString distanceFromString:(NSString *)distanceFromString coordinatesDictionary:(NSDictionary *)coordinates thumbnailImageURL:(NSURL *)thumbnailImageURL
{
    self = [super init];
    if (!self) return nil;

    _showID = showID;
    _title = title;
    _parterName = partnerName;
    _coordinates = coordinates;
    _locationString = locationString;
    _ausstellungsdauer = ausstellungsdauer;
    _thumbnailImageURL = thumbnailImageURL;
    _distanceFromString = distanceFromString;

    return self;
}

- (NSDictionary *)dictionaryRepresentation
{
    return @{
        @"showID": self.showID ?: @"",
        @"title": self.title ?: @"",
        @"partnerName": self.parterName ?: @"",
        @"ausstellungsdauer": self.ausstellungsdauer ?: @"",
        @"locationString": self.locationString ?: @"",
        @"thumbnailImageURL": self.thumbnailImageURL.absoluteString ?: @"",
        @"coordinates": self.coordinates ?: @{},
        @"distanceFromString" : self.distanceFromString ?: @""
    };
}

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    return [self initWithShowID:dictionary[@"artworkID"]
                          title:dictionary[@"title"]
                    partnerName:dictionary[@"partnerName"]
              ausstellungsdauer:dictionary[@"ausstellungsdauer"]
                 locationString:dictionary[@"locationString"]
             distanceFromString:dictionary[@"distanceFromString"]
          coordinatesDictionary:dictionary[@"coordinates"]
              thumbnailImageURL:[NSURL URLWithString:dictionary[@"thumbnailImageURL"]]];
}

- (CLLocation *)location
{
    return [[CLLocation alloc] initWithLatitude:[self.coordinates[@"latitude"] doubleValue] longitude:[self.coordinates[@"longitude"] doubleValue]];
}

- (void)setupDistanceFromLocation:(CLLocation *)location
{
    CLLocationDistance distanceMeters = [self.location distanceFromLocation:location];
    CGFloat miles = (distanceMeters/1000) * 0.621371;

    NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
    [numberFormatter setPositiveFormat:@"0.#"];
    _distanceFromString = [numberFormatter stringFromNumber:@(miles)];
}

- (NSString *)locationAndDistance
{
    if(self.distanceFromString.length == 0) return self.locationString;
    return [NSString stringWithFormat:@"%@, %@MI", self.locationString, self.distanceFromString];
}

@end
