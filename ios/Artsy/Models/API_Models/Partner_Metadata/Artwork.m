#import "Artwork.h"

#import "Artist.h"
#import "ArtsyAPI+Following.h"
#import "ArtsyAPI+RelatedModels.h"
#import "ArtsyAPI+Sales.h"
#import "ARDefaults.h"
#import "ARValueTransformer.h"
#import "Fair.h"
#import "Partner.h"
#import "User.h"
#import "ARDispatchManager.h"
#import "ARLogger.h"
#import "ARStandardDateFormatter.h"

#import "ARMacros.h"
#import "MTLModel+JSON.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <AFNetworking/AFHTTPRequestOperation.h>

// We have to support two different shaped pieces of data
// for the same fields, so these properties are used in
// JSONKeyPathsByPropertyKey to get both fields
// then a method switches between them depending on the data
// weird huh?
@interface Artwork()
@property (nonatomic, strong) NSNumber *gravSold;
@property (nonatomic, strong) NSNumber *mpSold;

@property (nonatomic, strong) NSNumber *gravIsPriceHidden;
@property (nonatomic, strong) NSNumber *mpIsPriceHidden;

@property (nonatomic, strong) NSNumber *gravIsAcquirable;
@property (nonatomic, strong) NSNumber *mpIsAcquirable;

@property (nonatomic, strong) NSNumber *gravIsInquireable;
@property (nonatomic, strong) NSNumber *mpIsInquirable;

@property (nonatomic, strong) NSNumber *gravIsOfferable;
@property (nonatomic, strong) NSNumber *mpIsOfferable;

@property (nonatomic, strong) NSString *gravAttributionClass;
@property (nonatomic, strong) NSString *mpAttributionClass;

@end

@implementation Artwork {
    // If we give these as properties they can cause
    // chaos with Mantle & State Resotoration.

    enum ARHeartStatus _heartStatus;
    Fair *_fair;

}

- (instancetype)initWithArtworkID:(NSString *)artworkID
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _artworkID = artworkID;
    _heartStatus = ARHeartStatusNotFetched;

    return self;
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Artwork.new, artworkID) : @"id",
        ar_keypath(Artwork.new, artworkUUID) : @"_id",
        ar_keypath(Artwork.new, canShareImage) : @"can_share_image",
        ar_keypath(Artwork.new, collectingInstitution) : @"collecting_institution",
        ar_keypath(Artwork.new, defaultImage) : @"images",
        ar_keypath(Artwork.new, additionalInfo) : @"additional_information",
        ar_keypath(Artwork.new, dimensionsCM) : @"dimensions.cm",
        ar_keypath(Artwork.new, dimensionsInches) : @"dimensions.in",
        ar_keypath(Artwork.new, mpAttributionClass) : @"mp_attribution_class.name",
        ar_keypath(Artwork.new, gravAttributionClass) : @"attribution_class",
        ar_keypath(Artwork.new, saleArtwork) : @"sale_artwork",
        
        ar_keypath(Artwork.new, editionSets) : @"edition_sets",
        ar_keypath(Artwork.new, editionOf) : @"edition_of",
        ar_keypath(Artwork.new, exhibitionHistory) : @"exhibition_history",
        ar_keypath(Artwork.new, shippingInfo) : @"shippingInfo",
        ar_keypath(Artwork.new, title) : @"title",
        ar_keypath(Artwork.new, imageRights) : @"image_rights",
        ar_keypath(Artwork.new, published) : @"published",
        ar_keypath(Artwork.new, saleMessage) : @"sale_message",
        ar_keypath(Artwork.new, slug) : @"id",
        ar_keypath(Artwork.new, publishedAt) : @"published_at",

        // TODO: Maybe never do though
        // the artwork query can alias basck to the grav artworks

        ar_keypath(Artwork.new, gravSold) : @"sold",
        ar_keypath(Artwork.new, gravIsAcquirable) : @"acquireable",
        ar_keypath(Artwork.new, gravIsInquireable) : @"inquireable",
        ar_keypath(Artwork.new, gravIsOfferable) : @"offerable",
        ar_keypath(Artwork.new, gravIsPriceHidden) : @"price_hidden",
        
        ar_keypath(Artwork.new, mpSold) : @"is_sold",
        ar_keypath(Artwork.new, isInAuction) : @"is_in_auction",
        ar_keypath(Artwork.new, mpIsAcquirable) : @"is_acquireable",
        ar_keypath(Artwork.new, mpIsInquirable) : @"is_inquireable",
        ar_keypath(Artwork.new, mpIsOfferable) : @"is_offerable",
        ar_keypath(Artwork.new, mpIsPriceHidden) : @"is_price_hidden",
    };
}

#pragma mark Model Upgrades

+ (NSUInteger)modelVersion
{
    return 1;
}

- (id)decodeValueForKey:(NSString *)key withCoder:(NSCoder *)coder modelVersion:(NSUInteger)fromVersion
{
    if (fromVersion == 0) {
        if ([key isEqual:@"additionalInfo"]) {
            return [coder decodeObjectForKey:@"info"] ?: [coder decodeObjectForKey:@"additionalInfo"];
        }
    }

    return [super decodeValueForKey:key withCoder:coder modelVersion:fromVersion];
}

+ (NSValueTransformer *)artistJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Artist class]];
}

+ (NSValueTransformer *)partnerJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Partner class]];
}

+ (NSValueTransformer *)saleArtworkJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[SaleArtwork class]];
}

+ (NSValueTransformer *)defaultImageJSONTransformer
{
    return [MTLValueTransformer reversibleTransformerWithForwardBlock:^Image *(NSArray *items) {
        NSDictionary *defaultImageDict = [[items select: ^(NSDictionary *item) {
            return [item[@"is_default"] boolValue];
        }] first];
        return defaultImageDict ? [Image modelWithJSON:defaultImageDict] : nil;
    }
        reverseBlock:^NSArray *(Image *image) {
        return @[image];
        }];
}


+ (NSValueTransformer *)provenanceJSONTransformer
{
    return [ARValueTransformer whitespaceTrimmingTransformer];
}

+ (NSValueTransformer *)exhibitionHistoryJSONTransformer
{
    return [ARValueTransformer whitespaceTrimmingTransformer];
}

+ (NSValueTransformer *)additionalInfoJSONTransformer
{
    return [ARValueTransformer whitespaceTrimmingTransformer];
}

+ (NSValueTransformer *)literatureJSONTransformer
{
    return [ARValueTransformer whitespaceTrimmingTransformer];
}

+ (NSValueTransformer *)signatureJSONTransformer
{
    return [ARValueTransformer whitespaceTrimmingTransformer];
}

+ (NSValueTransformer *)publishedAtJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)metricJSONTransformer
{
    NSDictionary *metrics = @{ @"in" : @(ARDimensionMetricInches),
                               @"cm" : @(ARDimensionMetricCentimeters),
                               @"" : @(ARDimensionMetricNoMetric) };
    return [ARValueTransformer enumValueTransformerWithMap:metrics];
}

- (CGFloat)aspectRatio
{
    return _defaultImage.aspectRatio ? _defaultImage.aspectRatio : 1;
}

- (CGSize)maxSize
{
    return CGSizeMake(_defaultImage.originalWidth, _defaultImage.originalHeight);
}

- (NSURL *)urlForThumbnail
{
    return [_defaultImage urlForThumbnailImage];
}

// TODO: Make a URL or call address
- (NSString *)baseImageURL
{
    return _defaultImage.url;
}

// See the comments up in the Artwork category extension at the top

- (NSNumber *)sold
{
    return self.gravSold.boolValue ? self.gravSold : self.mpSold;
}

- (NSNumber *)isPriceHidden
{
    return self.gravIsPriceHidden.boolValue ? self.gravIsPriceHidden : self.mpIsPriceHidden;
}

- (NSNumber *)isInquireable
{
    return self.gravIsInquireable.boolValue ? self.gravIsInquireable : self.mpIsInquirable;
}

- (NSNumber *)isAcquireable
{
    return self.gravIsAcquirable.boolValue ? self.gravIsAcquirable : self.mpIsAcquirable;
}

- (BOOL)isBuyNowable
{
    return self.isAcquireable && !self.hasMultipleEditions;
}

- (NSNumber *)isOfferable
{
    return self.gravIsOfferable.boolValue ? self.gravIsOfferable : self.mpIsOfferable;
}

- (NSString *)attributionClass
{
    return self.gravAttributionClass ?: self.mpAttributionClass;
}

- (BOOL)hasWidth
{
    return [self.width intValue] > 0;
}

- (BOOL)hasHeight
{
    return [self.height intValue] > 0;
}

- (BOOL)hasDiameter
{
    return [self.diameter intValue] > 0;
}

- (BOOL)hasDepth
{
    return [self.depth intValue] > 0;
}

- (BOOL)hasWidthAndHeight
{
    return self.hasWidth && self.hasHeight;
}

- (BOOL)hasDimensions
{
    return self.hasWidthAndHeight || self.hasDiameter;
}

- (BOOL)canViewInRoom
{
    return (self.hasDimensions && !self.hasDepth && [self.category rangeOfString:@"Sculpture"].location == NSNotFound && [self.category rangeOfString:@"Design"].location == NSNotFound && [self.category rangeOfString:@"Installation"].location == NSNotFound && [self.category rangeOfString:@"Architecture"].location == NSNotFound);
}

- (BOOL)hasMultipleEditions
{
    return (self.editionSets.count > 1);
}

- (BOOL)hasMoreInfo
{
    return [self.provenance length] || [self.exhibitionHistory length] || [self.signature length] || [self.additionalInfo length] || [self.literature length];
}

- (void)setFollowState:(BOOL)state success:(nullable void (^)(id))success failure:(nullable void (^)(NSError *))failure
{
    __weak typeof(self) wself = self;
    [ArtsyAPI setFavoriteStatus:state forArtwork:self success:^(id response) {
        __strong typeof (wself) sself = wself;
        if (!self) { return; }

        sself->_heartStatus = state? ARHeartStatusYes : ARHeartStatusNo;

        if (success) {
            success(response);
        }
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        if (!self) { return; }

        sself->_heartStatus = ARHeartStatusNo;

        if (failure) {
            failure(error);
        }
    }];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:self.class]) {
        return [self.artworkID isEqualToString:[object artworkID]];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.artworkID.hash;
}

- (ARHeartStatus)heartStatus
{
    return _heartStatus;
}

- (CGFloat)dimensionInInches:(CGFloat)dimension
{
    switch (self.metric) {
        case ARDimensionMetricCentimeters:
            return dimension * 0.393701;
        default:
            return dimension;
    }
}

- (CGFloat)widthInches
{
    return [self dimensionInInches:[self.width floatValue]];
}

- (CGFloat)heightInches
{
    return [self dimensionInInches:[self.height floatValue]];
}

- (CGFloat)diameterInches
{
    return [self dimensionInInches:[self.diameter floatValue]];
}

- (void)setNilValueForKey:(NSString *)key
{
    if ([key isEqualToString:@"metric"]) {
        [self setValue:@(ARDimensionMetricNoMetric) forKey:key];
    } else {
        [super setNilValueForKey:key];
    }
}

// NOTE: cannot be a property, otherwise overwritten via updateFair
- (Fair *)fair
{
    return _fair;
}

- (void)setFair:(Fair *)fair
{
    _fair = fair;
}

#pragma mark ShareableObject

- (NSString *)publicArtsyID;
{
    return self.artworkID;
}

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/artwork/%@", self.artworkID];
}

- (NSString *)name
{
    return self.title;
}

@end
