#import "ARSwitchBoard.h"
#import "ARFairAwareObject.h"

// View Controller forward declarations

@class ARArtworkSetViewController,
    ARShowViewController,
    ARFairArtistViewController,
    ARArtistViewController,
    ARArtworkInfoViewController,
    ARAuctionArtworkResultsViewController,
    ARFairMapViewController,
    ARUserSettingsViewController,
    ARAuctionWebViewController,
    ARFairGuideContainerViewController,
    AuctionViewController,
    ARMutableLinkViewController;

// Eigen model object forward decs
@class ARPostFeedItem,
    ARFollowArtistFeedItem;


@interface ARSwitchBoard (Eigen)

- (UIViewController *)loadConversationWithID:(NSString *)conversationID;

#pragma mark - Artworks

/// Provide a simple API to load an ArtworkVC from a lot of different inputs
- (ARArtworkSetViewController *)loadArtworkSet:(NSArray *)artworkSet inFair:(Fair *)fair atIndex:(NSInteger)index;
- (ARArtworkSetViewController *)loadArtwork:(Artwork *)artwork inFair:(Fair *)fair;
- (ARArtworkSetViewController *)loadArtworkWithID:(NSString *)artworkID inFair:(Fair *)fair;

- (ARArtworkInfoViewController *)loadMoreInfoForArtwork:(Artwork *)artwork;

#pragma mark - Fairs

/// Load a Map VC
- (ARFairMapViewController *)loadMapInFair:(Fair *)fair;
- (ARFairMapViewController *)loadMapInFair:(Fair *)fair title:(NSString *)title selectedPartnerShows:(NSArray *)selectedPartnerShows;

- (ARArtistViewController *)loadArtistWithID:(NSString *)artistID;
- (UIViewController<ARFairAwareObject> *)loadArtistWithID:(NSString *)artistID inFair:(Fair *)fair;

- (ARFairGuideContainerViewController *)loadFairGuideWithFair:(Fair *)fair;

#pragma mark - Auctions

- (UIViewController *)loadAuctionWithID:(NSString *)auctionID;
- (UIViewController *)loadLiveAuction:(NSString *)auctionID;

- (ARAuctionWebViewController *)loadBidUIForArtwork:(NSString *)artworkID inSale:(NSString *)saleID;

- (ARAuctionWebViewController *)loadAuctionRegistrationWithID:(NSString *)auctionID;

/// Load a Partner Page in Martsy
- (UIViewController *)loadPartnerWithID:(NSString *)partnerID;

/// Load a Profile. Used to separate profiles with a fair from regular profiles.
- (UIViewController *)loadProfileWithID:(NSString *)profileID;

/// Load a Gene
- (UIViewController *)loadGene:(Gene *)gene;
- (UIViewController *)loadGeneWithID:(NSString *)geneID;
- (UIViewController *)loadGeneWithID:(NSString *)geneID refineParams:(NSDictionary *)params;

/// Load a fair booth
- (ARShowViewController *)loadShow:(PartnerShow *)show fair:(Fair *)fair;
- (ARShowViewController *)loadShow:(PartnerShow *)show;
- (ARShowViewController *)loadShowWithID:(NSString *)showID;
- (ARShowViewController *)loadShowWithID:(NSString *)showID fair:(Fair *)fair;

/// Buy artwork
- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken;

/// Handle unknown redirects (normally special featured links)
- (ARMutableLinkViewController *)loadUnknownPathWithID:(NSString *)path;
@end
