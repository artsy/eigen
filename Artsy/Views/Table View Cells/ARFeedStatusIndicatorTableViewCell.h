typedef NS_ENUM(NSUInteger, ARFeedStatusState) {
    ARFeedStatusStateLoading = 1,
    ARFeedStatusStateNetworkError,
    ARFeedStatusStateEndOfFeed
};

/// Cell for displaying the state of a feed's network activity
/// will change height and colour based on the state property.

@interface ARFeedStatusIndicatorTableViewCell : UITableViewCell

/// Preferred initiliser, sets up cell and sets internal state
+ (instancetype)cellWithInitialState:(ARFeedStatusState)state;

/// Gets the cells generated height based on  state
+ (CGFloat)heightForFeedItemWithState:(ARFeedStatusState)state;

/// Sets the feed status and updates the cell's UI
@property (nonatomic, assign) ARFeedStatusState state;

@end
