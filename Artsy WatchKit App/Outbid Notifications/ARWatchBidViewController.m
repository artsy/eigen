#import "ARWatchBidViewController.h"
#import "WatchBiddingDetails.h"

@interface ARWatchBidViewController()
@property (nonatomic, readonly, assign) BOOL loaded;
@end

@implementation ARWatchBidViewController

- (void)willActivate
{
    [super willActivate];
    
    if (self.loaded) {
        [self popToRootController];
    }
    _loaded = true;
}

- (void)awakeWithContext:(WatchBiddingDetails *)context
{
    _bidDetails = context;

    NSString *formattedDollars = [NSNumberFormatter localizedStringFromNumber:@(self.bidDetails.lastBidCents / 100) numberStyle:NSNumberFormatterDecimalStyle];
    [self.lastBidAmountDollarsLabel setText:formattedDollars];
}

- (void)updateYourBid
{
    NSString *formattedDollars = [NSNumberFormatter localizedStringFromNumber:@(self.bidDetails.currentBidCents / 100) numberStyle:NSNumberFormatterDecimalStyle];

    [self.currentBidLabel setText:formattedDollars];

    BOOL isMinimumBid = self.bidDetails.isAtMinimumBid;
    [self.decreaseBidButton setEnabled:!isMinimumBid];
}

- (IBAction)decreaseCurrentBidTapped
{
    [self.bidDetails decrementBid];
    [self updateYourBid];
}

- (IBAction)increaseButtonTapped
{
    [self.bidDetails incrementBid];
    [self updateYourBid];
}

- (IBAction)placeBidTapped
{
    [self pushControllerWithName:@"Submit Bid" context:self.bidDetails];
}

- (IBAction)cancelTapped
{
    [self dismissController];
}

@end
