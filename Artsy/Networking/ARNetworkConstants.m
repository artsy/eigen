#import <Foundation/Foundation.h>

NSString *const ARBaseWebURL = @"https://www.artsy.net";
NSString *const ARBaseDeprecatedMobileWebURL = @"https://m.artsy.net";
NSString *const ARStagingBaseDeprecatedMobileWebURL = @"https://m-staging.artsy.net";
NSString *const ARBaseApiURL = @"https://api.artsy.net";

NSString *const ARTwitterCallbackPath = @"artsy://twitter-callback";

NSString *const ARAuthHeader = @"X-Access-Token";
NSString *const ARXappHeader = @"X-Xapp-Token";

NSString *const ARXappURL = @"/api/v1/xapp_token";

NSString *const ARForgotPasswordURL = @"/api/v1/users/send_reset_password_instructions";

NSString *const ARMyInfoURL = @"/api/v1/me";

NSString *const ARAddArtworkToFavoritesURLFormat = @"/api/v1/collection/saved-artwork/artwork/%@";
NSString *const ARFavoritesURL = @"/api/v1/collection/saved-artwork/artworks";
NSString *const ARMyBiddersURL = @"/api/v1/me/bidders";
NSString *const ARSaleURLFormat = @"/api/v1/sale/%@";
NSString *const ARLiveSaleStateFormat = @"%@/state/%@";

NSString *const ARRelatedArtistsURL = @"/api/v1/me/suggested/artists";
NSString *const ARRelatedGeneURLFormat = @"/api/v1/gene/%@/similar";
NSString *const ARPopularArtistsURL = @"/api/v1/artists/popular";

NSString *const ARFollowArtistURL = @"/api/v1/me/follow/artist";
NSString *const ARUnfollowArtistURLFormat = @"/api/v1/me/follow/artist/%@";
NSString *const ARFollowArtistsURL = @"/api/v1/me/follow/artists";

NSString *const ARFollowGeneURL = @"/api/v1/me/follow/gene";
NSString *const ARUnfollowGeneURLFormat = @"/api/v1/me/follow/gene/%@";
NSString *const ARFollowGenesURL = @"/api/v1/me/follow/genes";

NSString *const ARFollowProfileURL = @"/api/v1/me/follow/profile";
NSString *const ARFollowingProfileURLFormat = @"/api/v1/me/follow/profile/%@";
NSString *const ARUnfollowProfileURLFormat = @"/api/v1/me/follow/profile/%@";
NSString *const ARFollowProfilesURL = @"/api/v1/me/follow/profiles";

NSString *const ARProfileInformationURLFormat = @"/api/v1/profile/%@";

NSString *const ARNewArtistSearchURL = @"/api/v1/match/artists";
NSString *const ARNewGeneSearchURL = @"/api/v1/match/genes";

NSString *const ARNotificationsURL = @"/api/v1/me/notifications";

NSString *const ARNewDeviceURL = @"/api/v1/device";
NSString *const ARDeleteDeviceURL = @"/api/v1/device/%@";

NSString *const ARSystemTimeURL = @"/api/v1/system/time";

NSString *const ARPageURLFormat = @"/api/v1/page/%@";
