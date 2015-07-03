#import "ARValueTransformer.h"


@implementation Artwork {
    // If we give these as properties they can cause
    // chaos with Mantle & State Resotoration.

    KSDeferred *_artworkUpdateDeferred;
    KSDeferred *_saleArtworkUpdateDeferred;
    KSDeferred *_favDeferred;
    KSDeferred *_fairDeferred;
    KSDeferred *_partnerShowDeferred;
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
        @keypath(Artwork.new, artworkID) : @"id",
        @keypath(Artwork.new, auctionResultCount) : @"comparables_count",
        @keypath(Artwork.new, canShareImage) : @"can_share_image",
        @keypath(Artwork.new, collectingInstitution) : @"collecting_institution",
        @keypath(Artwork.new, defaultImage) : @"images",
        @keypath(Artwork.new, additionalInfo) : @"additional_information",
        @keypath(Artwork.new, dimensionsCM) : @"dimensions.cm",
        @keypath(Artwork.new, dimensionsInches) : @"dimensions.in",
        @keypath(Artwork.new, displayTitle) : @"display",
        @keypath(Artwork.new, editionSets) : @"edition_sets",
        @keypath(Artwork.new, exhibitionHistory) : @"exhibition_history",
        @keypath(Artwork.new, forSale) : @"forsale",
        @keypath(Artwork.new, imageRights) : @"image_rights",
        @keypath(Artwork.new, published) : @"published",
        @keypath(Artwork.new, saleMessage) : @"sale_message",
        @keypath(Artwork.new, sold) : @"sold"
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

+ (NSValueTransformer *)acquireableJSONTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

+ (NSValueTransformer *)inquireableJSONTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

+ (NSValueTransformer *)forSaleJSONTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

+ (NSValueTransformer *)soldJSONTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
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

+ (NSValueTransformer *)availabilityJSONTransformer
{
    NSDictionary *types = @{
        @"not for sale" : @(ARArtworkAvailabilityNotForSale),
        @"for sale" : @(ARArtworkAvailabilityForSale),
        @"sold" : @(ARArtworkAvailabilitySold),
        @"on hold" : @(ARArtworkAvailabilityOnHold)
    };
    return [ARValueTransformer enumValueTransformerWithMap:types];
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

- (AFJSONRequestOperation *)getRelatedArtworks:(void (^)(NSArray *artworks))success
{
    return [ArtsyAPI getRelatedArtworksForArtwork:self success:success
                                          failure:^(NSError *error) {
        success(@[]);
                                          }];
}

- (AFJSONRequestOperation *)getRelatedFairArtworks:(Fair *)fair success:(void (^)(NSArray *artworks))success
{
    return [ArtsyAPI getRelatedArtworksForArtwork:self inFair:(fair ?: self.fair)success:success
                                          failure:^(NSError *error) {
            success(@[]);
                                          }];
}

- (AFJSONRequestOperation *)getRelatedAuctionResults:(void (^)(NSArray *auctionResults))success
{
    return [ArtsyAPI getAuctionComparablesForArtwork:self success:success
                                             failure:^(NSError *error) {
            success(@[]);
                                             }];
}

- (AFJSONRequestOperation *)getRelatedPosts:(void (^)(NSArray *posts))success
{
    return [ArtsyAPI getRelatedPostsForArtwork:self success:success
                                       failure:^(NSError *error) {
            success(@[]);
                                       }];
}

- (AFJSONRequestOperation *)getFeaturedShowsAtFair:(Fair *)fair success:(void (^)(NSArray *shows))success;
{
    return [ArtsyAPI getShowsForArtworkID:self.artworkID inFairID:fair.fairID success:success
                                  failure:^(NSError *error) {
            success(@[]);
                                  }];
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

- (void)updateArtwork
{
    @weakify(self);
    __weak KSDeferred *deferred = _artworkUpdateDeferred;

    ar_dispatch_async(^{
        [ArtsyAPI getArtworkInfo:self.artworkID success:^(id artwork) {
            ar_dispatch_main_queue(^{
                @strongify(self);
                [self mergeValuesForKeysFromModel:artwork];
                [deferred resolveWithValue:self];
            });
        } failure:^(NSError *error) {
            ar_dispatch_main_queue(^{
                [deferred rejectWithError:error];
            });
        }];
    });
}

- (BOOL)hasMoreInfo
{
    return [self.provenance length] || [self.exhibitionHistory length] || [self.signature length] || [self.additionalInfo length] || [self.literature length];
}

- (KSPromise *)onArtworkUpdate:(void (^)(void))success failure:(void (^)(NSError *error))failure
{
    @weakify(self);

    if (!_artworkUpdateDeferred) {
        _artworkUpdateDeferred = [KSDeferred defer];
    }

    return [_artworkUpdateDeferred.promise then:^(id value) {
        if (success) { success(); }
        return self;

    } error:^id(NSError *error) {
        if (failure) { failure(error); }

        @strongify(self);
        ARErrorLog(@"Failed fetching full JSON for artwork %@. Error: %@", self.artworkID, error.localizedDescription);
        return error;
    }];
}

- (KSDeferred *)deferredSaleArtworkUpdate
{
    if (!_saleArtworkUpdateDeferred) {
        _saleArtworkUpdateDeferred = [KSDeferred defer];
    }
    return _saleArtworkUpdateDeferred;
}

- (void)updateSaleArtwork
{
    @weakify(self);

    KSDeferred *deferred = [self deferredSaleArtworkUpdate];

    [ArtsyAPI getSalesWithArtwork:self.artworkID success:^(NSArray *sales) {

        // assume artwork can only be in one auction at most
        Sale *auction = nil;
        for (Sale *sale in sales) {
            if (sale.isAuction) {
                auction = sale;
            }
            break;
        }

        if (auction) {
            @strongify(self);
            [ArtsyAPI getAuctionArtworkWithSale:auction.saleID artwork:self.artworkID success:^(SaleArtwork *saleArtwork) {
                saleArtwork.auction = auction;
                [deferred resolveWithValue:saleArtwork];

            } failure:^(NSError *error) {
                @strongify(self);
                ARErrorLog(@"Error fetching auction details for artwork %@: %@", self.artworkID, error.localizedDescription);
                [deferred rejectWithError:error];
            }];
        } else {
            [deferred resolveWithValue:nil];
        }

    } failure:^(NSError *error) {
        @strongify(self);
        [deferred rejectWithError:error];
        ARErrorLog(@"Error fetching sales for artwork %@: %@", self.artworkID, error.localizedDescription);
    }];
}

- (KSPromise *)onSaleArtworkUpdate:(void (^)(SaleArtwork *saleArtwork))success failure:(void (^)(NSError *error))failure
{
    KSDeferred *deferred = [self deferredSaleArtworkUpdate];
    return [deferred.promise then:^(id value) {
        if (success) {
            success(value);
        }
        return self;
    } error:^id(NSError *error) {
        if (failure) {
            failure(error);
        }
        return error;
    }];
}

- (KSDeferred *)deferredFairUpdate
{
    if (!_fairDeferred) {
        _fairDeferred = [KSDeferred defer];
    }
    return _fairDeferred;
}

- (void)updateFair
{
    @weakify(self);

    KSDeferred *deferred = [self deferredFairUpdate];
    [ArtsyAPI getFairsForArtwork:self success:^(NSArray *fairs) {
        @strongify(self);
        // we're not checking for count > 0 cause we wanna fulfill with nil if no fairs
        Fair *fair = [fairs firstObject];
        self.fair = fair;
        [deferred resolveWithValue:fair];
    } failure:^(NSError *error) {
        @strongify(self);
        [deferred rejectWithError:error];
        ARErrorLog(@"Couldn't get fairs for artwork %@. Error: %@", self.artworkID, error.localizedDescription);
    }];
}

- (KSPromise *)onFairUpdate:(void (^)(Fair *))success failure:(void (^)(NSError *))failure
{
    KSDeferred *deferred = [self deferredFairUpdate];
    return [deferred.promise then:^(id value) {
        self.fair = value;
        if (success) {
            success(value);
        }
        return self;
    } error:^id(NSError *error) {
        if (failure) {
            failure(error);
        }
        return error;
    }];
}

- (KSDeferred *)deferredPartnerShowUpdate;
{
    if (!_partnerShowDeferred) {
        _partnerShowDeferred = [KSDeferred defer];
    }
    return _partnerShowDeferred;
}

- (KSPromise *)onPartnerShowUpdate:(void (^)(PartnerShow *show))success failure:(void (^)(NSError *error))failure;
{
    KSDeferred *deferred = self.deferredPartnerShowUpdate;
    return [deferred.promise then:^(PartnerShow *show) {
        success(show);
        return self;
    } error:^(NSError *error) {
        if (failure) failure(error);
        return error;
    }];
}

- (void)updatePartnerShow;
{
    @weakify(self);

    KSDeferred *deferred = [self deferredPartnerShowUpdate];
    [ArtsyAPI getShowsForArtworkID:self.artworkID inFairID:nil success:^(NSArray *shows) {
        // we're not checking for count > 0 cause we wanna fulfill with nil if no shows
        PartnerShow *show = [shows firstObject];
        [deferred resolveWithValue:show];
    } failure:^(NSError *error) {
        @strongify(self);
        [deferred rejectWithError:error];
        ARErrorLog(@"Couldn't get shows for artwork %@. Error: %@", self.artworkID, error.localizedDescription);
    }];
}

- (void)setFollowState:(BOOL)state success:(void (^)(id))success failure:(void (^)(NSError *))failure
{
    @weakify(self);
    [ArtsyAPI setFavoriteStatus:state forArtwork:self success:^(id response) {
        @strongify(self);
        if (!self) { return; }

        self->_heartStatus = state? ARHeartStatusYes : ARHeartStatusNo;

        if (success) {
            success(response);
        }
    } failure:^(NSError *error) {
        @strongify(self);
        if (!self) { return; }

        self->_heartStatus = ARHeartStatusNo;

        if (failure) {
            failure(error);
        }
    }];
}


- (void)getFavoriteStatus:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure
{
    if ([User isTrialUser]) {
        _heartStatus = ARHeartStatusNo;
        success(ARHeartStatusNo);
        return;
    }

    @weakify(self);

    if (!_favDeferred) {
        KSDeferred *deferred = [KSDeferred defer];
        [ArtsyAPI checkFavoriteStatusForArtwork:self success:^(BOOL status) {
            @strongify(self);
            if (!self) { return; }

            self->_heartStatus = status ? ARHeartStatusYes : ARHeartStatusNo;

            [deferred resolveWithValue:@(status)];
        } failure:^(NSError *error) {
            [deferred rejectWithError:error];
        }];

        _favDeferred = deferred;
    }

    [_favDeferred.promise then:^(id value) {
        @strongify(self);

        success(self.heartStatus);
        return self;
    } error:^(NSError *error) {
        // Its a 404 if you have no artworks
        NSHTTPURLResponse *response = [error userInfo][AFNetworkingOperationFailingURLResponseErrorKey];
        if (response.statusCode == 404) {
            success(ARHeartStatusNo);
        } else {
            ARErrorLog(@"Failed fetching favorite status for artwork %@. Error: %@", self.artworkID, error.localizedDescription);
            failure(error);
        }
        return error;
    }];
}

- (NSNumber *)forSale
{
    return @(self.availability == ARArtworkAvailabilityForSale);
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

- (BOOL)shouldShowAuctionResults
{
    return [[NSUserDefaults standardUserDefaults] boolForKey:ARShowAuctionResultsButtonDefault] && self.partner && self.partner.type == ARPartnerTypeGallery && [self.category rangeOfString:@"Architecture"].location == NSNotFound && self.auctionResultCount.intValue > 0;
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

- (NSString *)auctionResultsPath
{
    return [NSString stringWithFormat:@"/artwork/%@/auction_results", self.artworkID];
}

- (void)setNilValueForKey:(NSString *)key
{
    if ([key isEqualToString:@"metric"]) {
        [self setValue:@(ARDimensionMetricNoMetric) forKey:key];
    } else if ([key isEqualToString:@"availability"]) {
        [self setValue:@(ARArtworkAvailabilityNotForSale) forKey:key];
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

- (NSString *)publicArtsyPath
{
    return [NSString stringWithFormat:@"/artwork/%@", self.artworkID];
}

- (NSString *)name
{
    return self.title;
}

@end
