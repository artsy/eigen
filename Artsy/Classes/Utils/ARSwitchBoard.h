#import "ARFairAwareObject.h"

@class ARPostFeedItem;
@class ARFollowArtistFeedItem;

// View Controller Forward Declarations

@class ARArtworkSetViewController;
@class ARShowViewController;
@class ARFairArtistViewController;
@class ARArtistViewController;
@class ARArtworkInfoViewController;
@class ARAuctionArtworkResultsViewController;
@class ARFairMapViewController;
@class ARGeneViewController;
@class ARUserSettingsViewController;

/**
 The Switchboard is the internal API for loading different native views
  it does this mostly by using either an internal Sinatra like-router, or
  by directly passing the message on to whichever ARNavigationContainer compliant
  object we want.
*/

@interface ARSwitchBoard : NSObject

+ (instancetype)sharedInstance;

/// Provide a simple API to load an ArtworkVC from a lot of different inputs
- (ARArtworkSetViewController *)loadArtworkSet:(NSArray *)artworkSet inFair:(Fair *)fair atIndex:(NSInteger)index;
- (ARArtworkSetViewController *)loadArtwork:(Artwork *)artwork inFair:(Fair *)fair;
- (ARArtworkSetViewController *)loadArtworkWithID:(NSString *)artworkID inFair:(Fair *)fair;

- (UIViewController *)loadBidUIForArtwork:(NSString *)artworkID inSale:(NSString *)saleID;

/// Load the auction results for an artwork on to the stack
- (ARAuctionArtworkResultsViewController *)loadAuctionResultsForArtwork:(Artwork *)artwork;
- (ARArtworkInfoViewController *)loadMoreInfoForArtwork:(Artwork *)artwork;

/// Load a Map VC
- (ARFairMapViewController *)loadMapInFair:(Fair *)fair;
- (ARFairMapViewController *)loadMapInFair:(Fair *)fair title:(NSString *)title selectedPartnerShows:(NSArray *)selectedPartnerShows;

- (ARArtistViewController *)loadArtistWithID:(NSString *)artistID;
- (UIViewController<ARFairAwareObject> *)loadArtistWithID:(NSString *)artistID inFair:(Fair *)fair;

/// Load a Partner Page in Martsy
- (UIViewController *)loadPartnerWithID:(NSString *)partnerID;

/// Load a Profile. Used to separate profiles with a fair from regular profiles.
- (UIViewController *)routeProfileWithID:(NSString *)profileID;

/// Load a Gene
- (ARGeneViewController *)loadGene:(Gene *)gene;
- (ARGeneViewController *)loadGeneWithID:(NSString *)geneID;

/// Load a fair booth
- (ARShowViewController *)loadShow:(PartnerShow *)show fair:(Fair *)fair;
- (ARShowViewController *)loadShow:(PartnerShow *)show;
- (ARShowViewController *)loadShowWithID:(NSString *)showID;
- (ARShowViewController *)loadShowWithID:(NSString *)showID fair:(Fair *)fair;

/// Load a path relative to the baseURL through the router
- (UIViewController *)loadPath:(NSString *)path;
- (UIViewController *)loadPath:(NSString *)path fair:(Fair *)fair;

/// Send an URL through the router
- (UIViewController *)loadURL:(NSURL *)url;
- (UIViewController *)loadURL:(NSURL *)url fair:(Fair *)fair;

- (ARUserSettingsViewController *)loadUserSettings;

- (NSURL *)resolveRelativeUrl:(NSString *)path;

/// Buy artwork
- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken;

@end
