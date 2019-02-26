#import "ARSwitchBoard.h"
#import "ARFairAwareObject.h"

// View Controller forward declarations

@class ARArtworkSetViewController,
    ARFairArtistViewController,
    ARArtworkInfoViewController,
    ARAuctionArtworkResultsViewController,
    ARFairMapViewController,
    ARUserSettingsViewController,
    ARFairGuideContainerViewController,
    AuctionViewController,
    ARMutableLinkViewController;

// Eigen model object forward decs
@class ARPostFeedItem,
    ARFollowArtistFeedItem;


@interface ARSwitchBoard (Eigen)

@property (nonatomic, strong, readonly) NSURL *liveAuctionsURL;

#pragma mark - Dev

- (UIViewController *)loadAdminMenu;

#pragma mark - Messaging

- (UIViewController *)loadConversationWithID:(NSString *)conversationID;

#pragma mark - Artworks

/// Provide a simple API to load an ArtworkVC from a lot of different inputs
- (ARArtworkSetViewController *)loadArtworkSet:(NSArray *)artworkSet inFair:(Fair *)fair atIndex:(NSInteger)index;
- (ARArtworkSetViewController *)loadArtwork:(Artwork *)artwork inFair:(Fair *)fair;
- (ARArtworkSetViewController *)loadArtworkWithID:(NSString *)artworkID inFair:(Fair *)fair;
- (ARArtworkSetViewController *)loadArtworkIDSet:(NSArray *)artworkIDSet inFair:(Fair *)fair atIndex:(NSInteger)index;

- (ARArtworkInfoViewController *)loadMoreInfoForArtwork:(Artwork *)artwork;

#pragma mark - Fairs

/// Load a Map VC
- (ARFairMapViewController *)loadMapInFair:(Fair *)fair;
- (ARFairMapViewController *)loadMapInFair:(Fair *)fair title:(NSString *)title selectedPartnerShows:(NSArray *)selectedPartnerShows;

- (UIViewController *)loadArtistWithID:(NSString *)artistID;
- (UIViewController<ARFairAwareObject> *)loadArtistWithID:(NSString *)artistID inFair:(Fair *)fair;

- (ARFairGuideContainerViewController *)loadFairGuideWithFair:(Fair *)fair;

#pragma mark - Auctions

- (UIViewController *)loadAuctionWithID:(NSString *)auctionID;
- (UIViewController *)loadLiveAuction:(NSString *)auctionID;

- (UIViewController *)loadBidUIForArtwork:(NSString *)artworkID inSale:(NSString *)saleID;

- (UIViewController *)loadAuctionRegistrationWithID:(NSString *)auctionID skipBidFlow:(BOOL)skipBidFlow;

/// Load a Partner Page in Martsy
- (UIViewController *)loadPartnerWithID:(NSString *)partnerID;

/// Load a Profile. Used to separate profiles with a fair from regular profiles.
- (UIViewController *)loadProfileWithID:(NSString *)profileID;

/// Load a Gene
- (UIViewController *)loadGene:(Gene *)gene;
- (UIViewController *)loadGeneWithID:(NSString *)geneID;
- (UIViewController *)loadGeneWithID:(NSString *)geneID refineParams:(NSDictionary *)params;

/// Load a fair booth, or show
- (UIViewController *)loadShow:(PartnerShow *)show fair:(Fair *)fair;
- (UIViewController *)loadShow:(PartnerShow *)show;
- (UIViewController *)loadShowWithID:(NSString *)showID;
- (UIViewController *)loadShowWithID:(NSString *)showID fair:(Fair *)fair;

/// Buy artwork
- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken;

/// Handle unknown redirects (normally special featured links)
- (ARMutableLinkViewController *)loadUnknownPathWithID:(NSString *)path;
@end
