#import "ARWatchBidPlacingViewController.h"
#import "WatchBiddingDetails.h"
#import "WatchMessage.h"


@interface ARWatchBidPlacingViewController ()
@property (readonly, nonatomic, strong) WatchBiddingDetails *details;
@end


@implementation ARWatchBidPlacingViewController

- (void)awakeWithContext:(id)context
{
    _details = context;

    [self.bidAgainGroup setHidden:YES];
    [self.doneButtonGroup setHidden:YES];

    [self.image setImageNamed:@"Progress-Spinner-"];
    [self.image startAnimatingWithImagesInRange:NSMakeRange(0, 59) duration:0.8 repeatCount:0];

    WatchMessage *message = [WatchMessage messageToRequestBidWithDetails:self.details];
    [self.class openParentApplication:message.dictionaryRepresentation reply:^(NSDictionary *replyInfo, NSError *error) {

        WatchMessage *message  = [[WatchMessage alloc] initWithDictionary:replyInfo];
        enum ARWatchBiddingStatus status = [message.referenceObject integerValue];
        [self.doneButtonGroup setHidden:NO];

        switch (status) {
            case ARWatchBiddingStatusFailed:
                self.titleLabel.text = @"Bidding failed, please re-try on your phone.";
                [self.image setImageNamed:@"BidFailed"];
                break;

            case ARWatchBiddingStatusHighestBidder:
                self.titleLabel.text = @"You are the highest bidder";
                [self.image setImageNamed:@"BidSuccess"];
                break;

            case ARWatchBiddingStatusOutbid:
                self.titleLabel.text = @"You have been outbid";
                [self.image setImageNamed:@"BidFailed"];
                self.bidAgainGroup.hidden = NO;

                break;
        }
    }];
}

- (IBAction)doneTapped
{
    [self popToRootController];
}

@end
