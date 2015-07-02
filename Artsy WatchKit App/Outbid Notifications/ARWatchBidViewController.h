#import <Foundation/Foundation.h>
#import <WatchKit/WatchKit.h>

@class WatchBiddingDetails;


@interface ARWatchBidViewController : WKInterfaceController

@property (strong, nonatomic) IBOutlet WKInterfaceLabel *lastBidAmountDollarsLabel;
@property (strong, nonatomic) IBOutlet WKInterfaceButton *increaseBidButton;
@property (strong, nonatomic) IBOutlet WKInterfaceButton *decreaseBidButton;
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *currentBidLabel;

@property (readonly, strong, nonatomic) WatchBiddingDetails *bidDetails;

@end
