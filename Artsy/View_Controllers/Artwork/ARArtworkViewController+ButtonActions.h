#import "ARLegacyArtworkViewController.h"
#import "ARHeartButton.h"
#import "ARBidButton.h"

#import "ARArtworkPreviewActionsView.h"
#import "ARArtworkActionsView.h"
#import "ARArtworkPreviewImageView.h"
#import "ARArtworkDetailView.h"

#import "ARFullWidthCalloutLabelView.h"

@interface ARLegacyArtworkViewController (ButtonActions) <ARArtworkDetailViewButtonDelegate, ARArtworkPreviewActionsViewDelegate, ARArtworkActionsViewDelegate, ARArtworkPreviewImageViewDelegate, ARArtworkActionsViewButtonDelegate, ARFullWidthCalloutLabelCallback>

@end
