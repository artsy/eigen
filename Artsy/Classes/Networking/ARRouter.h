// TODO: This file needs some literal cleanup, spacing documentation etc.

@interface ARRouter : NSObject

+ (void)setup;
+ (NSSet *)artsyHosts;

+ (NSURL *)baseWebURL;

+ (AFHTTPClient *)httpClient;

+ (BOOL)isInternalURL:(NSURL *)url;
+ (BOOL)isWebURL:(NSURL *)url;

+ (void)setAuthToken:(NSString *)token;
+ (void)setXappToken:(NSString *)token;

+ (NSURLRequest *)requestForURL:(NSURL *)url;

+ (NSURLRequest *)newOAuthRequestWithUsername:(NSString *)username password:(NSString *)password;
+ (NSURLRequest *)newTwitterOAuthRequestWithToken:(NSString *)token andSecret:(NSString *)secret;
+ (NSURLRequest *)newFacebookOAuthRequestWithToken:(NSString *)token;

+ (NSURLRequest *)newUserInfoRequest;
+ (NSURLRequest *)newUserEditRequestWithParams:(NSDictionary *)params;
+ (NSURLRequest *)newXAppTokenRequest;

+ (NSURLRequest *)newCreateUserRequestWithName:(NSString *)name email:(NSString *)email password:(NSString *)password;
+ (NSURLRequest *)newCreateUserViaFacebookRequestWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name;
+ (NSURLRequest *)newCreateUserViaTwitterRequestWithToken:(NSString *)token secret:(NSString *)secret email:(NSString *)email name:(NSString *)name;

+ (NSURLRequest *)newCheckFollowingProfileHeadRequest:(NSString *)profileID;

+ (NSURLRequest *)newMyFollowProfileRequest:(NSString *)profileID;
+ (NSURLRequest *)newMyUnfollowProfileRequest:(NSString *)profileID;
+ (NSURLRequest *)newFollowingProfilesRequestWithFair:(Fair *)fair;

+ (NSURLRequest *)newFeedRequestWithCursor:(NSString *)cursor pageSize:(NSInteger)size;
+ (NSURLRequest *)newShowFeedRequestWithCursor:(NSString *)cursor pageSize:(NSInteger)size;

+ (NSURLRequest *)newPostsRequestForProfileID:(NSString *)profileID WithCursor:(NSString *)cursor pageSize:(NSInteger)size;
+ (NSURLRequest *)newPostsRequestForProfile:(Profile *)profile WithCursor:(NSString *)cursor pageSize:(NSInteger)size;
+ (NSURLRequest *)newPostsRequestForFairOrganizer:(FairOrganizer *)fairOrganizer WithCursor:(NSString *)cursor pageSize:(NSInteger)size;

+ (NSURLRequest *)newArtworkInfoRequestForArtworkID:(NSString *)artworkID;
+ (NSURLRequest *)newNewArtworksRequestWithParams:(NSDictionary *)params;
+ (NSURLRequest *)newArtworksRelatedToArtworkRequest:(Artwork *)artwork;
+ (NSURLRequest *)newArtworksRelatedToArtwork:(Artwork *)artwork inFairRequest:(Fair *)fair;
+ (NSURLRequest *)newArtworkComparablesRequest:(Artwork *)artwork;

+ (NSURLRequest *)newArtworkFavoritesRequestWithFair:(Fair *)fair;
+ (NSURLRequest *)newSetArtworkFavoriteRequestForArtwork:(Artwork *)artwork status:(BOOL)status;

+ (NSURLRequest *)newArtworksFromUsersFavoritesRequestWithID:(NSString *)userID page:(NSInteger)page;
+ (NSURLRequest *)newCheckFavoriteStatusRequestForArtwork:(Artwork *)artwork;
+ (NSURLRequest *)newCheckFavoriteStatusRequestForArtworks:(NSArray *)artworks;
+ (NSURLRequest *)newFairsRequestForArtwork:(Artwork *)artwork;
+ (NSURLRequest *)newShowsRequestForArtworkID:(NSString *)artworkID andFairID:(NSString *)fairID;

+ (NSURLRequest *)newArtistsFromPersonalCollectionAtPage:(NSInteger)page;
+ (NSURLRequest *)newArtistCountFromPersonalCollectionRequest;
+ (NSURLRequest *)newArtistArtworksRequestWithParams:(NSDictionary *)params andArtistID:(NSString *)artistID;
+ (NSURLRequest *)newArtistInfoRequestWithID:(NSString *)artistID;
+ (NSURLRequest *)newFollowingArtistsRequestWithFair:(Fair *)fair;
+ (NSURLRequest *)newFollowingRequestForArtist:(Artist *)artists;
+ (NSURLRequest *)newFollowingRequestForArtists:(NSArray *)artists;
+ (NSURLRequest *)newFollowArtistRequest:(Artist *)artist;
+ (NSURLRequest *)newUnfollowArtistRequest:(Artist *)artist;
+ (NSURLRequest *)newArtistsRelatedToArtistRequest:(Artist *)artist;
+ (NSURLRequest *)newShowsRequestForArtist:(NSString *)artistID;
+ (NSURLRequest *)newArtistsFromSampleAtPage:(NSInteger)page;

+ (NSURLRequest *)newSearchRequestWithQuery:(NSString *)query;
+ (NSURLRequest *)newSearchRequestWithFairID:(NSString *)fairID andQuery:(NSString *)query;
+ (NSURLRequest *)newArtistSearchRequestWithQuery:(NSString *)query;

+ (NSURLRequest *)directImageRequestForModel:(Class)model andSlug:(NSString *)slug;

+ (NSURLRequest *)newPostInfoRequestWithID:(NSString *)postID;
+ (NSURLRequest *)newProfileInfoRequestWithID:(NSString *)profileID;

+ (NSURLRequest *)newSiteHeroUnitsRequest;
+ (NSURLRequest *)newOnDutyRepresentativeRequest;

+ (NSURLRequest *)newArtworkInquiryRequestForArtwork:(Artwork *)artwork
                                                name:(NSString *)name
                                               email:(NSString *)email
                                             message:(NSString *)message
                                 analyticsDictionary:(NSDictionary *)analyticsDictionary
                                shouldContactGallery:(BOOL)contactGallery;

+ (NSURLRequest *)newGenesFromPersonalCollectionAtPage:(NSInteger)page;
+ (NSURLRequest *)newGeneCountFromPersonalCollectionRequest;
+ (NSURLRequest *)newGeneInfoRequestWithID:(NSString *)geneID;

+ (NSURLRequest *)newFollowingRequestForGene:(Gene *)gene;
+ (NSURLRequest *)newFollowingRequestForGenes:(NSArray *)genes;

+ (NSURLRequest *)newFollowGeneRequest:(Gene *)gene;
+ (NSURLRequest *)newUnfollowGeneRequest:(Gene *)gene;
+ (NSURLRequest *)newArtworksFromGeneRequest:(NSString *)gene atPage:(NSInteger)page;

+ (NSURLRequest *)newArtworksFromShowRequest:(PartnerShow *)show atPage:(NSInteger)page;
+ (NSURLRequest *)newImagesFromShowRequest:(PartnerShow *)show atPage:(NSInteger)page;
+ (NSURLRequest *)newShowInfoRequestWithID:(NSString *)showID;
+ (NSURLRequest *)newShowsRequestForArtistID:(NSString *)artistID inFairID:(NSString *)fairID;

+ (NSURLRequest *)newForgotPasswordRequestWithEmail:(NSString *)email;
+ (NSURLRequest *)newSiteFeaturesRequest;

+ (NSURLRequest *)newSetDeviceAPNTokenRequest:(NSString *)token forDevice:(NSString *)device;
/// We don't actually use this anywhere but it's good for diagnosing network problems
+ (NSURLRequest *)newUptimeURLRequest;

+ (NSURLRequest *)salesWithArtworkRequest:(NSString *)artworkID;
+ (NSURLRequest *)artworksForSaleRequest:(NSString *)saleID;

+ (NSURLRequest *)biddersRequest;
+ (NSURLRequest *)bidderPositionsRequestForSaleID:(NSString *)saleID artworkID:(NSString *)artworkID;
+ (NSURLRequest *)saleArtworkRequestForSaleID:(NSString *)saleID artworkID:(NSString *)artworkID;

+ (NSURLRequest *)newFairInfoRequestWithID:(NSString *)fairID;
+ (NSURLRequest *)newFairShowsRequestWithFair:(Fair *)fair;
+ (NSURLRequest *)newFairMapRequestWithFair:(Fair *)fair;
+ (NSURLRequest *)newFairShowFeedRequestWithFair:(Fair *)fair partnerID:(NSString *)partnerID cursor:(NSString *)cursor pageSize:(NSInteger)size;

+ (NSURLRequest *)orderedSetsWithOwnerType:(NSString *)ownerType andID:(NSString *)ownerID;
+ (NSURLRequest *)orderedSetsWithKey:(NSString *)key;
+ (NSURLRequest *)orderedSetItems:(NSString *)orderedSetID;
+ (NSURLRequest *)orderedSetItems:(NSString *)orderedSetID atPage:(NSInteger)page;

+ (NSURLRequest *)newPostsRelatedToArtwork:(Artwork *)artwork;
+ (NSURLRequest *)newPostsRelatedToArtist:(Artist *)artist;

+ (NSURLRequest *)newSystemTimeRequest;

+ (NSURLRequest *)newPendingOrderWithArtworkID:(NSString *)artworkID;
@end
