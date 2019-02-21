#import "UIViewController+Search.h"
#import "UIViewController+TopMenuViewController.h"
#import "ARTopMenuViewController.h"
#import "ARArtworkSetViewController.h"

#import "ARSwitchBoard.h"
#import "ARSwitchBoard+Eigen.h"
#import "Artist.h"
#import "Artwork.h"
#import "Fair.h"
#import "SiteFeature.h"
#import "FeaturedLink.h"
#import "Gene.h"
#import "ARAppConstants.h"
#import "PartnerShow.h"
#import "Profile.h"
#import "SearchResult.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

@implementation UIViewController (UIViewController_Search)

- (void)presentSearchResult:(SearchResult *)result fair:(Fair *)fair
{
    ARSwitchBoard *switchBoard = ARSwitchBoard.sharedInstance;
    UIViewController *controller = nil;

    if (result.model == [Artwork class]) {
        controller = [switchBoard loadArtworkWithID:result.modelID inFair:fair];

    } else if (result.model == [Artist class]) {
        Artist *artist = [[Artist alloc] initWithArtistID:result.modelID];
        controller = [switchBoard loadArtistWithID:artist.artistID inFair:fair];

    } else if (result.model == [Gene class]) {
        controller = [switchBoard loadGeneWithID:result.modelID];

    } else if (result.model == [Profile class]) {
        controller = [switchBoard loadProfileWithID:result.modelID];

    } else if (result.model == [SiteFeature class]) {
        NSString *path = NSStringWithFormat(@"/feature/%@", result.modelID);
        controller = [switchBoard loadPath:path];

    } else if (result.model == [PartnerShow class]) {
        PartnerShow *partnerShow = [[PartnerShow alloc] initWithShowID:result.modelID];
        controller = [switchBoard loadShowWithID:partnerShow.showID fair:fair];
    }

    if (controller) {
        [self.ar_TopMenuViewController pushViewController:controller animated:ARPerformWorkAsynchronously];
    }
}

@end
