#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

@class Artist, Artwork, Fair, FairOrganizer, Gene, PartnerShow, Profile;
@class AFHTTPSessionManager;


@interface ARRouter : NSObject

+ (void)setup;
+ (NSSet *)artsyHosts;
+ (NSURL *)baseApiURL;
+ (NSURL *)baseWebURL;
+ (NSString *)baseMetaphysicsApiURLString;

+ (void)setupUserAgent;
+ (BOOL)isWebURL:(NSURL *)url;
+ (BOOL)isTelURL:(NSURL *)url;
+ (NSURL *)resolveRelativeUrl:(NSString *)path;

+ (BOOL)isBNMORequestURL:(NSURL *)url;

+ (BOOL)isInternalURL:(NSURL *)url;

+ (NSURLRequest *)requestForURL:(NSURL *)url;

+ (NSString *)userAgent;

#pragma mark - OAuth

+ (void)setAuthToken:(NSString *)token;

#pragma mark - XApp
+ (void)setXappToken:(NSString *)token;
+ (NSURLRequest *)newXAppTokenRequest;

#pragma mark - User

+ (NSURLRequest *)newMeHEADRequest;
+ (NSURLRequest *)newUserInfoRequest;
+ (NSURLRequest *)newUserEditRequestWithParams:(NSDictionary *)params;
+ (NSURLRequest *)newCheckFollowingProfileHeadRequest:(NSString *)profileID;
+ (NSURLRequest *)newMyFollowProfileRequest:(NSString *)profileID;
+ (NSURLRequest *)newMyUnfollowProfileRequest:(NSString *)profileID;
+ (NSURLRequest *)newFollowingProfilesRequestWithFair:(Fair *)fair;

#pragma mark - Artwork Favorites (items in the saved-artwork collection)

+ (NSURLRequest *)newSetArtworkFavoriteRequestForArtwork:(Artwork *)artwork status:(BOOL)status;
+ (NSURLRequest *)newCheckFavoriteStatusRequestForArtwork:(Artwork *)artwork;
+ (NSURLRequest *)newCheckFavoriteStatusRequestForArtworks:(NSArray *)artworks;

#pragma mark - Artist

+ (NSURLRequest *)newArtistsFromPersonalCollectionAtPage:(NSInteger)page;

+ (NSURLRequest *)newFollowingRequestForArtist:(Artist *)artists;
+ (NSURLRequest *)newFollowingRequestForArtists:(NSArray *)artists;
+ (NSURLRequest *)newFollowArtistRequest:(Artist *)artist;
+ (NSURLRequest *)newUnfollowArtistRequest:(Artist *)artist;

+ (NSURLRequest *)newArtistRelatedToArtistRequest:(Artist *)artist excluding:(NSArray *)artistsToExclude;
+ (NSURLRequest *)newArtistsRelatedToArtistRequest:(Artist *)artist excluding:(NSArray *)artistsToExclude;
+ (NSURLRequest *)newGeneRelatedToGeneRequest:(Gene *)gene excluding:(NSArray *)genesToExclude;
+ (NSURLRequest *)newGenesRelatedToGeneRequest:(Gene *)gene excluding:(NSArray *)genesToExclude;
+ (NSURLRequest *)newArtistsPopularRequest;
+ (NSURLRequest *)newArtistsPopularRequestFallback;
+ (NSURLRequest *)newGenesPopularRequest;

#pragma mark - Genes

+ (NSURLRequest *)newFollowingRequestForGene:(Gene *)gene;
+ (NSURLRequest *)newFollowGeneRequest:(Gene *)gene;
+ (NSURLRequest *)newUnfollowGeneRequest:(Gene *)gene;
+ (NSURLRequest *)newFollowingRequestForGenes:(NSArray *)genes;

#pragma mark - Models

+ (NSURLRequest *)newProfileInfoRequestWithID:(NSString *)profileID;

#pragma mark - Search (Onboarding)

+ (NSURLRequest *)newArtistSearchRequestWithQuery:(NSString *)query excluding:(NSArray *)artistsToExclude;
+ (NSURLRequest *)newGeneSearchRequestWithQuery:(NSString *)query excluding:(NSArray *)genesToExclude;

#pragma mark - Fairs

+ (NSURLRequest *)newFollowArtistRequest;

#pragma mark - Auctions

+ (NSURLRequest *)liveSaleStateRequest:(NSString *)saleID host:(NSString *)host;

// Send in role as nil for when a user is logged out
+ (NSURLRequest *)liveSaleStaticDataRequest:(NSString *)saleID role:(NSString *)role;

+ (NSURLRequest *)biddersRequestForSale:(NSString *)saleID;
+ (NSURLRequest *)requestForSaleID:(NSString *)saleID;

+ (NSString *)baseCausalitySocketURLString;

#pragma mark - Notifications

+ (NSURLRequest *)markNotificationsAsReadRequest;

#pragma mark - Misc Site

+ (NSURLRequest *)newForgotPasswordRequestWithEmail:(NSString *)email;
+ (NSURLRequest *)newSetDeviceAPNTokenRequest:(NSString *)token forDevice:(NSString *)device;
+ (NSURLRequest *)newDeleteDeviceRequest:(NSString *)token;
+ (NSURLRequest *)newSystemTimeRequest;

#pragma mark - Pages

+ (NSURLRequest *)newRequestForPageContent:(NSString *)slug;


#pragma mark - Misc

+ (NSURLRequest *)newHEADRequestForPath:(NSString *)path;

@end
