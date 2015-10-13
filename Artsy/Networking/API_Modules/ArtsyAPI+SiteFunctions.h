#import "ArtsyAPI.h"

extern NSString *const ArtsyAPIInquiryAnalyticsInquiryURL;  // Who made the inquiry
extern NSString *const ArtsyAPIInquiryAnalyticsReferralURL; // Where they came from before Artsy.app
extern NSString *const ArtsyAPIInquiryAnalyticsLandingURL;  // Where the first went

@class Artwork, Profile, User;


@interface ArtsyAPI (SiteFunctions)

/// Gets the Hero Units from the site.

+ (void)getSiteHeroUnits:(void (^)(NSArray *heroUnits))success failure:(void (^)(NSError *error))failure;

/// Get an Inquiry Contact, initially returns with a stubbed User and then will return with a full user profile
/// allowing you to get the name quickly and then later having full access to the whole stack of data

+ (void)getInquiryContact:(void (^)(User *contactStub))success
              withProfile:(void (^)(Profile *contactProfile))profile
                  failure:(void (^)(NSError *error))failure;

/// Send a request to an Artsy Partner inquiring about an artwork
+ (void)createPartnerArtworkInquiryForArtwork:(Artwork *)artwork
                                         name:(NSString *)name
                                        email:(NSString *)email
                                      message:(NSString *)message
                          analyticsDictionary:(NSDictionary *)analyticsDictionary
                                      success:(void (^)(id message))success
                                      failure:(void (^)(NSError *error))failure;

/// Send a request to an Artsy Representative inquiring about an artwork
+ (void)createRepresentativeArtworkInquiryForArtwork:(Artwork *)artwork
                                                name:(NSString *)name
                                               email:(NSString *)email
                                             message:(NSString *)message
                                 analyticsDictionary:(NSDictionary *)analyticsDictionary
                                             success:(void (^)(id message))success
                                             failure:(void (^)(NSError *error))failure;

/// Get "site features" (essentially site-wide labs)
+ (void)getSiteFeatures:(void (^)(NSArray *features))success failure:(void (^)(NSError *error))failure;

@end
