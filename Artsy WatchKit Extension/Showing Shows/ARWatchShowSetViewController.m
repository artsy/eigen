#import "ARWatchShowSetViewController.h"
#import "WatchShow.h"

@implementation ARWatchShowRowController
@end

@interface ARWatchShowSetViewController()
@property (readonly, copy, nonatomic) NSArray *shows;
@end

@implementation ARWatchShowSetViewController

- (void)awakeWithContext:(id)context
{
    _shows = [context copy];
    [self.table setNumberOfRows:self.shows.count withRowType:@"default"];

    NSInteger rowCount = self.table.numberOfRows;
    for (NSInteger i = 0; i < rowCount; i++) {
        WatchShow *show = self.shows[i];

        // Assign the text to the row's label.
        ARWatchShowRowController *row = [self.table rowControllerAtIndex:i];
        row.partnerNameLabel.text = show.parterName.uppercaseString;
        row.showNameLabel.text = show.title;
        row.distanceLabel.text = [NSString stringWithFormat:@"%@ MI", show.distanceFromString];
    }
}

- (void)table:(WKInterfaceTable *)table didSelectRowAtIndex:(NSInteger)rowIndex
{
    [self pushControllerWithName:@"Show" context:self.shows[rowIndex]];
}

@end
