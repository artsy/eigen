#import "ARSwitchBoard.h"

// View Controller forward declarations

@class ARAuctionArtworkResultsViewController,
    ARUserSettingsViewController,
    AuctionViewController;

// Eigen model object forward decs
@class ARFollowArtistFeedItem;


@interface ARSwitchBoard (Eigen)

#pragma mark - Auctions

- (UIViewController *)loadAuctionWithID:(NSString *)auctionID;

- (UIViewController *)loadBidUIForArtwork:(NSString *)artworkID inSale:(NSString *)saleID;

- (UIViewController *)loadAuctionRegistrationWithID:(NSString *)auctionID skipBidFlow:(BOOL)skipBidFlow;

/// Load a Partner Page in Martsy
- (UIViewController *)loadPartnerWithID:(NSString *)partnerID;

/// Load a Profile. Used to separate profiles with a fair from regular profiles.
- (UIViewController *)loadProfileWithID:(NSString *)profileID;

/// Load a fair booth, or show
- (UIViewController *)loadShow:(PartnerShow *)show fair:(Fair *)fair;
- (UIViewController *)loadShow:(PartnerShow *)show;
- (UIViewController *)loadShowWithID:(NSString *)showID;
- (UIViewController *)loadShowWithID:(NSString *)showID fair:(Fair *)fair;

/// Buy artwork
- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken;

@end
