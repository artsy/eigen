#import "ARPostAttachment.h"
#import "Image.h"
#import "ARHasImageBaseURL.h"
#import "SaleArtwork.h"
#import "ARShareableObject.h"
#import "ARHeartStatus.h"
#import "ARSpotlight.h"

#import <KSDeferred/KSDeferred.h>
#import <Mantle/Mantle.h>

// TODO: Add support ARFollowable for following status

@class Artist, Partner, Profile, Sale, SaleArtwork, Fair, PartnerShow;

typedef NS_ENUM(NSInteger, ARArtworkAvailability) {
    ARArtworkAvailabilityNotForSale,
    ARArtworkAvailabilityForSale,
    ARArtworkAvailabilityOnHold,
    ARArtworkAvailabilitySold
};

typedef NS_ENUM(NSInteger, ARDimensionMetric) {
    ARDimensionMetricInches,
    ARDimensionMetricCentimeters,
    ARDimensionMetricNoMetric
};

NS_ASSUME_NONNULL_BEGIN


@interface Artwork : MTLModel <ARPostAttachment, MTLJSONSerializing, ARHasImageBaseURL, ARShareableObject, ARSpotlightMetadataProvider>

@property (nonatomic, copy) NSString *artworkID;
@property (nonatomic, copy) NSString *artworkUUID;
@property (nonatomic, copy) NSString *slug;

@property (nonatomic, strong) NSNumber *depth;
@property (nonatomic, strong) NSNumber *diameter;
@property (nonatomic, strong) NSNumber *height;
@property (nonatomic, strong) NSNumber *width;
@property (nonatomic) ARDimensionMetric metric;

@property (nonatomic, copy) NSString *dimensionsCM;
@property (nonatomic, copy) NSString *dimensionsInches;

@property (nonatomic, copy) NSString *attributionClass;

// The artist that created the artwork. This may be `nil`.
@property (nonatomic, strong) Artist *_Nullable artist;
@property (nonatomic, copy) NSString *imageFormatAddress;

@property (nonatomic, strong) Partner *partner;
@property (nonatomic, copy) NSString *collectingInstitution;

// not a property, carried around for fair context
- (Fair *)fair;

// we're just gonna leave these as dictionaries for now
// I think?
@property (nonatomic, copy) NSArray *editionSets;
@property (nonatomic, copy, readonly) NSString *_Nullable editionOf;

@property (nonatomic, assign) enum ARArtworkAvailability availability;

@property (nonatomic, copy) NSString *date;
@property (nonatomic, copy) NSString *_Nullable title;
@property (nonatomic, copy) NSString *exhibitionHistory;
@property (nonatomic, copy) NSString *additionalInfo;
@property (nonatomic, copy, readonly) NSNumber *isPriceHidden;
@property (nonatomic, strong, getter=isPublished) NSNumber *published;
@property (nonatomic, copy) NSString *imageRights;
@property (nonatomic, copy) NSString *medium;
@property (nonatomic, copy) NSString *literature;
@property (nonatomic, copy) NSString *provenance;
@property (nonatomic, copy) NSString *series;
@property (nonatomic, copy) NSString *signature;
@property (nonatomic, copy) NSString *category;

/** A generated string with all shipping info generated on MP */
@property (nonatomic, copy, readonly) NSString *shippingInfo;
/** Where does a BN work come from? */
@property (nonatomic, copy, readonly) NSString *shippingOrigin;

@property (nonatomic, copy) NSString *saleMessage;

/** Note that this field is only populated from Metaphysics requests. */
@property (nonatomic, assign) BOOL isInAuction;

/// An artwork is BuyNowable if it isAcquirable but doesn't have multiple editions.
@property (nonatomic, assign, readonly) BOOL isBuyNowable;

@property (nonatomic, copy, readonly) NSNumber *isAcquireable;
@property (nonatomic, copy, readonly) NSNumber *isInquireable;
@property (nonatomic, copy, readonly) NSNumber *isOfferable;
@property (nonatomic, copy, readonly) NSNumber *sold;
@property (nonatomic, copy) NSNumber *forSale;

@property (nonatomic, strong) NSNumber *canShareImage;
@property (nonatomic, strong) Sale *auction;
@property (readonly, nonatomic, assign) BOOL isFollowed;

@property (nonatomic, copy) NSString *price;

@property (nonatomic, copy) NSString *blurb;

@property (nonatomic, strong) NSDate *updatedAt;
@property (nonatomic, strong) NSDate *publishedAt;

@property (nonatomic, strong) Image *defaultImage;

/// Note this property is not parsed from JSON but has be to set explicitly, otherwise is assumed to be nil.
@property (nonatomic, strong) SaleArtwork *saleArtwork;

- (ARHeartStatus)heartStatus;

- (AFHTTPRequestOperation *)getRelatedArtworks:(void (^)(NSArray *artworks))success;
- (AFHTTPRequestOperation *)getRelatedFairArtworks:(Fair *)fair success:(void (^)(NSArray *artworks))success;
- (AFHTTPRequestOperation *)getRelatedPosts:(void (^)(NSArray *posts))success;
- (AFHTTPRequestOperation *)getFeaturedShowsAtFair:(Fair *)fair success:(void (^)(NSArray *shows))success;

/// Gets an update from the server and updates itself, triggers defers from onArtworkUpdate
- (void)updateArtwork;
- (void)updateSaleArtwork;
- (void)updateFair;
- (void)updatePartnerShow;

/// Adds a callback when the artwork has been update, does not trigger said update.
- (KSPromise *)onArtworkUpdate:(nullable void (^)(void))success
                       failure:(nullable void (^)(NSError *error))failure;
- (KSPromise *)onSaleArtworkUpdate:(nullable void (^)(SaleArtwork *saleArtwork))success
                           failure:(nullable void (^)(NSError *error))failure;
- (KSPromise *)onSaleArtworkUpdate:(nullable void (^)(SaleArtwork *saleArtwork))success
                           failure:(nullable void (^)(NSError *error))failure
                       allowCached:(BOOL)allowCached;
- (KSPromise *)onFairUpdate:(nullable void (^)(Fair *fair))success
                    failure:(nullable void (^)(NSError *error))failure;
- (KSPromise *)onPartnerShowUpdate:(nullable void (^)(PartnerShow *show))success
                           failure:(nullable void (^)(NSError *error))failure;

- (void)setFollowState:(BOOL)state success:(nullable void (^)(id))success failure:(nullable void (^)(NSError *))failure;
- (void)getFavoriteStatus:(nullable void (^)(ARHeartStatus status))success failure:(nullable void (^)(NSError *error))failure;

- (BOOL)canViewInRoom;
- (BOOL)hasWidth;
- (BOOL)hasHeight;
- (BOOL)hasDepth;
- (BOOL)hasDiameter;
- (BOOL)hasDimensions;
- (BOOL)hasWidthAndHeight;
- (BOOL)hasMoreInfo;
- (BOOL)hasMultipleEditions;

- (CGFloat)widthInches;
- (CGFloat)heightInches;
- (CGFloat)diameterInches;

- (NSString *)availablityString;

- (instancetype)initWithArtworkID:(NSString *)artworkID;

@end

NS_ASSUME_NONNULL_END
