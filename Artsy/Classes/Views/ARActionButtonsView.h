typedef void (^ARActionButtonHandler)(UIButton *button);

extern NSString *const ARActionButtonImageKey;
extern NSString *const ARActionButtonHandlerKey;


@interface ARActionButtonsView : UIView

/// Takes a collection of dictionaries with the above keys
@property (readwrite, nonatomic, copy) NSArray *actionButtonDescriptions;

@end
