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

+ (AFHTTPSessionManager *)httpClient;
+ (void)setupWithBaseApiURL:(NSURL *)baseApiURL;

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
+ (NSURLRequest *)newOAuthRequestWithUsername:(NSString *)username password:(NSString *)password;
+ (NSURLRequest *)newAppleOAuthRequestWithUID:(NSString *)appleUID idToken:(NSString *)idToken;
+ (NSURLRequest *)newFacebookOAuthRequestWithToken:(NSString *)token;

#pragma mark - XApp
+ (void)setXappToken:(NSString *)token;
+ (NSURLRequest *)newXAppTokenRequest;

#pragma mark - User creation

+ (NSURLRequest *)checkExistingUserWithEmail:(NSString *)email;
+ (NSURLRequest *)newCreateUserRequestWithName:(NSString *)name email:(NSString *)email password:(NSString *)password;
+ (NSURLRequest *)newCreateUserViaAppleRequestWithUID:(NSString *)appleUID email:(NSString *)email name:(NSString *)name idToken:(NSString *)idToken;
+ (NSURLRequest *)newCreateUserViaFacebookRequestWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name;

#pragma mark - User

+ (NSURLRequest *)newMeHEADRequest;
+ (NSURLRequest *)newUserInfoRequest;
+ (NSURLRequest *)newUserEditRequestWithParams:(NSDictionary *)params;
+ (NSURLRequest *)newCheckFollowingProfileHeadRequest:(NSString *)profileID;
+ (NSURLRequest *)newMyFollowProfileRequest:(NSString *)profileID;
+ (NSURLRequest *)newMyUnfollowProfileRequest:(NSString *)profileID;
+ (NSURLRequest *)newFollowingProfilesRequestWithFair:(Fair *)fair;

#pragma mark - Feed

+ (NSURLRequest *)newFairShowFeedRequestWithFair:(Fair *)fair partnerID:(NSString *)partnerID cursor:(NSString *)cursor pageSize:(NSInteger)size;
+ (NSURLRequest *)newPostsRequestForProfileID:(NSString *)profileID WithCursor:(NSString *)cursor pageSize:(NSInteger)size;
+ (NSURLRequest *)newPostsRequestForProfile:(Profile *)profile WithCursor:(NSString *)cursor pageSize:(NSInteger)size;
+ (NSURLRequest *)newPostsRequestForFairOrganizer:(FairOrganizer *)fairOrganizer WithCursor:(NSString *)cursor pageSize:(NSInteger)size;

#pragma mark - Artworks

+ (NSURLRequest *)newArtworksRelatedToArtwork:(Artwork *)artwork inFairRequest:(Fair *)fair;

#pragma mark - Artwork Favorites (items in the saved-artwork collection)

+ (NSURLRequest *)newSetArtworkFavoriteRequestForArtwork:(Artwork *)artwork status:(BOOL)status;
+ (NSURLRequest *)newArtworksFromUsersFavoritesRequestWithCursor:(NSString *)cursor;
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

+ (NSURLRequest *)newGenesFromPersonalCollectionAtPage:(NSInteger)page;
+ (NSURLRequest *)newFollowingRequestForGene:(Gene *)gene;
+ (NSURLRequest *)newFollowGeneRequest:(Gene *)gene;
+ (NSURLRequest *)newUnfollowGeneRequest:(Gene *)gene;
+ (NSURLRequest *)newFollowingRequestForGenes:(NSArray *)genes;

#pragma mark - Models

+ (NSURLRequest *)newPostInfoRequestWithID:(NSString *)postID;
+ (NSURLRequest *)newProfileInfoRequestWithID:(NSString *)profileID;

#pragma mark - Search

+ (NSURLRequest *)newArtistSearchRequestWithQuery:(NSString *)query excluding:(NSArray *)artistsToExclude;
+ (NSURLRequest *)newGeneSearchRequestWithQuery:(NSString *)query excluding:(NSArray *)genesToExclude;

+ (NSURLRequest *)directImageRequestForModel:(Class)model andSlug:(NSString *)slug;

#pragma mark - Fairs

+ (NSURLRequest *)newFollowArtistRequest;

#pragma mark - Auctions

+ (NSURLRequest *)salesWithArtworkRequest:(NSString *)artworkID;
+ (NSURLRequest *)artworksForSaleRequest:(NSString *)saleID page:(NSInteger)page pageSize:(NSInteger)pageSize;
+ (NSURLRequest *)liveSaleStateRequest:(NSString *)saleID host:(NSString *)host;

// Send in role as nil for when a user is logged out
+ (NSURLRequest *)liveSaleStaticDataRequest:(NSString *)saleID role:(NSString *)role;

+ (NSURLRequest *)biddersRequest;
+ (NSURLRequest *)biddersRequestForSale:(NSString *)saleID;
+ (NSURLRequest *)lotStandingsRequestForSaleID:(NSString *)saleID;
+ (NSURLRequest *)createBidderPositionsForSaleID:(NSString *)saleID artworkID:(NSString *)artworkID maxBidAmountCents:(NSInteger)maxBidAmountCents;
+ (NSURLRequest *)bidderPositionsRequestForSaleID:(NSString *)saleID artworkID:(NSString *)artworkID;
+ (NSURLRequest *)saleArtworkRequestForSaleID:(NSString *)saleID artworkID:(NSString *)artworkID;
+ (NSURLRequest *)requestForSaleID:(NSString *)saleID;

+ (NSString *)baseCausalitySocketURLString;

#pragma mark - Ordered Sets

+ (NSURLRequest *)orderedSetsWithOwnerType:(NSString *)ownerType andID:(NSString *)ownerID;
+ (NSURLRequest *)orderedSetsWithKey:(NSString *)key;
+ (NSURLRequest *)orderedSetItems:(NSString *)orderedSetID;
+ (NSURLRequest *)orderedSetItems:(NSString *)orderedSetID atPage:(NSInteger)page;

#pragma mark - Recommendations

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
+ (NSURLRequest *)newSailthruRegisterClickAndDecodeURLRequest:(NSURL *)encodedURL;
+ (NSURLRequest *)newTotalUnreadMessagesCountRequest;

@end
