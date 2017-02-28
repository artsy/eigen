#import <Mantle/Mantle.h>
#import "ARHasImageBaseURL.h"

typedef NS_ENUM(NSInteger, ARPartnerType) {
    ARPartnerTypeGallery,
    ARPartnerTypeMuseum,
    ARPartnerTypeArtistEstate,
    ARPartnerTypePrivateCollection,
    ARPartnerTypeFoundation,
    ARPartnerTypePublicDomain,
    ARPartnerTypeImageArchive,
    ARPartnerTypeNonProfit,
    ARPartnerTypeInstitution
};


@interface Partner : MTLModel <MTLJSONSerializing, ARHasImageURLs>

@property (readonly, nonatomic, assign) BOOL defaultProfilePublic;
@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *shortName;
@property (readonly, nonatomic, copy) NSString *partnerID;
@property (readonly, nonatomic, copy) NSString *profileID;
@property (readonly, nonatomic, copy) NSString *website;
@property (readonly, nonatomic, assign) ARPartnerType type;

- (NSURL *)imageURLWithFormatName:(NSString *)formatName;

@end
