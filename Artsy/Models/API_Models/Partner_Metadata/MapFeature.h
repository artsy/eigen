typedef NS_ENUM(NSInteger, ARMapFeatureType) {
    ARMapFeatureTypeDefault,
    ARMapFeatureTypeArtsy,
    ARMapFeatureTypeDrink,
    ARMapFeatureTypeCoatCheck,
    ARMapFeatureTypeFood,
    ARMapFeatureTypeInfo,
    ARMapFeatureTypeLounge,
    ARMapFeatureTypeRestroom,
    ARMapFeatureTypeSaved,
    ARMapFeatureTypeSearch,
    ARMapFeatureTypeVIP,
    ARMapFeatureTypeHighlighted,
    ARMapFeatureTypeEntrance,
    ARMapFeatureTypeTicket,
    ARMapFeatureTypeExit,
    ARMapFeatureTypeBooks,
    ARMapFeatureTypeInstallation,
    ARMapFeatureTypeTransport,
    ARMapFeatureTypeGenericEvent,
    ARMapFeatureTypeMax
};

FOUNDATION_EXPORT NSString *NSStringFromARMapFeatureType(enum ARMapFeatureType featureType);

@class Image;

@interface MapFeature : MTLModel <MTLJSONSerializing>

@property (readonly, nonatomic, assign) enum ARMapFeatureType featureType;
@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *imagePath;
@property (readonly, nonatomic, copy) NSString *href;

@property (readonly, nonatomic, assign) CGFloat x;
@property (readonly, nonatomic, assign) CGFloat y;

- (CGPoint)coordinateOnImage:(Image *)image;

@end
