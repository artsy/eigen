#import <Foundation/Foundation.h>

@class WKInterfaceTable;


@interface ARWatchAsyncTableViewController : NSObject

- (instancetype)initWithTableView:(WKInterfaceTable *)table dataArray:(NSArray *)array;

/// How many rows to show syncronously at the start, defaults to 2.
@property (nonatomic, assign) NSInteger numberOfInitialRows;

/// Update the UI in this block
@property (nonatomic, copy) void (^updateRow)(id rowController, id referenceObject, NSInteger index);

/// Defaults to "default"
@property (nonatomic, copy) NSString *rowType;

/// Adds the default rows
- (void)start;

/// Continues with the rest of the rows
- (void)finishUp;

@end
