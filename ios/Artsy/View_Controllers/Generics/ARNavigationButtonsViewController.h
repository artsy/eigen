#import <UIKit/UIKit.h>

typedef void (^ARNavigationButtonHandler)(UIButton *button);

// This key tells ARNavigationButtonsViewController which UIButton subclass to
// use for the given button, defaults to ARNavigationButton.
extern NSString *const ARNavigationButtonClassKey;

extern NSString *const ARNavigationButtonHandlerKey;

// Associate a dictionary of properties with this key to have
// ARNavigationButtonsViewController set them on the button using KVO.
//
// For convenience, NSNull is treated as nil.
extern NSString *const ARNavigationButtonPropertiesKey;

// This view controller constructs a stack of UIButton subclasses from an array
// of button descriptions you pass in.
@interface ARNavigationButtonsViewController : UIViewController

- (id)initWithButtonDescriptions:(NSArray *)descriptions;

- (NSArray *)navigationButtons;

@property (readwrite, nonatomic, copy) NSArray *buttonDescriptions;

- (void)addButtonDescriptions:(NSArray *)buttonDescriptions;
- (void)addButtonDescriptions:(NSArray *)buttonDescriptions unique:(BOOL)unique;

@end
