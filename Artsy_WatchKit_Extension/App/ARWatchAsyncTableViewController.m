
#import "ARWatchAsyncTableViewController.h"
#import <WatchKit/WatchKit.h>


@interface ARWatchAsyncTableViewController ()
@property (readonly, strong, nonatomic) WKInterfaceTable *table;
@property (readonly, copy, nonatomic) NSArray *data;
@property (readonly, assign, nonatomic) NSInteger lastIndex;
@end


@implementation ARWatchAsyncTableViewController

- (instancetype)initWithTableView:(WKInterfaceTable *)table dataArray:(NSArray *)array
{
    self = [super init];
    if (!self) return nil;

    _data = array.copy;
    _table = table;
    _numberOfInitialRows = 2;
    _rowType = @"default";

    return self;
}

- (void)start
{
    [self.table setNumberOfRows:self.numberOfInitialRows withRowType:self.rowType];

    NSRange initialRange = NSMakeRange(0, self.table.numberOfRows);
    [self getRowsFromRange:initialRange];
}

- (void)finishUp
{
    NSInteger newRows = self.data.count - self.numberOfInitialRows;
    NSRange range = NSMakeRange(self.numberOfInitialRows, newRows);
    NSIndexSet *indexes = [NSIndexSet indexSetWithIndexesInRange:range];
    [self.table insertRowsAtIndexes:indexes withRowType:self.rowType];

    [self getRowsFromRange:range];
}

- (void)getRowsFromRange:(NSRange)range
{
    for (NSInteger i = range.location; i < range.location + range.length; i++) {
        id object = self.data[i];

        // Assign the text to the row's label.
        id row = [self.table rowControllerAtIndex:i];
        if (self.updateRow) self.updateRow(row, object, i);
    }
}
@end
