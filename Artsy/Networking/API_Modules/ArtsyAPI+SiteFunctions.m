#import "ArtsyAPI+Private.h"
#import "ARRouter.h"

NSString *const ArtsyAPIInquiryAnalyticsInquiryURL = @"ArtsyAPIInquiryAnalyticsInquiryURL";
NSString *const ArtsyAPIInquiryAnalyticsReferralURL = @"ArtsyAPIInquiryAnalyticsReferralURL";
NSString *const ArtsyAPIInquiryAnalyticsLandingURL = @"ArtsyAPIInquiryAnalyticsLandingURL";


@implementation ArtsyAPI (SiteFunctions)

+ (void)getSiteHeroUnits:(void (^)(NSArray *heroUnits))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newSiteHeroUnitsRequest];
    [self getRequest:request parseIntoAnArrayOfClass:[SiteHeroUnit class] success:success failure:failure];
}

+ (void)getInquiryContact:(void (^)(User *contactStub))success
              withProfile:(void (^)(Profile *contactProfile))profile
                  failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);
    __weak typeof (self) wself = self;

    NSURLRequest *request = [ARRouter newOnDutyRepresentativeRequest];
    [self performRequest:request success:^(NSArray *results) {
        __strong typeof (wself) sself = wself;
        if ([results count] == 0) {
            success(nil);
        } else {
            NSError *error = nil;
            User *contact = [User modelWithJSON:results[0] error:&error];
            if (error) {
                ARErrorLog(@"Error parsing the admin on duty");
                success(nil);
                return;
            }

            success(contact);

            NSURLRequest *profileRequest = [ARRouter newProfileInfoRequestWithID:contact.defaultProfileID];
            [sself getRequest:profileRequest parseIntoAClass:[Profile class] success:profile failure:failure];
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

+ (void)createPartnerArtworkInquiryForArtwork:(Artwork *)artwork
                                         name:(NSString *)name
                                        email:(NSString *)email
                                      message:(NSString *)message
                          analyticsDictionary:(NSDictionary *)analyticsDictionary
                                      success:(void (^)(id message))success
                                      failure:(void (^)(NSError *error))failure
{
    [self createArtworkInquiryForArtwork:artwork name:name email:email message:message shouldContactGallery:YES analyticsDictionary:analyticsDictionary success:success failure:failure];
}

+ (void)createRepresentativeArtworkInquiryForArtwork:(Artwork *)artwork
                                                name:(NSString *)name
                                               email:(NSString *)email
                                             message:(NSString *)message
                                 analyticsDictionary:(NSDictionary *)analyticsDictionary
                                             success:(void (^)(id message))success
                                             failure:(void (^)(NSError *error))failure
{
    [self createArtworkInquiryForArtwork:artwork name:name email:email message:message shouldContactGallery:NO analyticsDictionary:analyticsDictionary success:success failure:failure];
}

+ (void)createArtworkInquiryForArtwork:(Artwork *)artwork
                                  name:(NSString *)name
                                 email:(NSString *)email
                               message:(NSString *)message
                  shouldContactGallery:(BOOL)shouldContactGallery
                   analyticsDictionary:(NSDictionary *)analyticsDictionary
                               success:(void (^)(id message))success
                               failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtworkInquiryRequestForArtwork:artwork name:name email:email message:message analyticsDictionary:analyticsDictionary shouldContactGallery:shouldContactGallery];
    [self performRequest:request success:success failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        if (failure) {
            failure(error);
        }
    }];
}

+ (void)getSiteFeatures:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    NSURLRequest *request = [ARRouter newSiteFeaturesRequest];
    [self getRequest:request parseIntoAnArrayOfClass:[SiteFeature class] success:success failure:failure];
}

@end
