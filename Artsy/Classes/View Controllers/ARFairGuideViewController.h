@class ARFairGuideViewController;

@protocol ARFairGuideViewControllerDelegate <NSObject>

- (void)fairGuideViewControllerDidChangeTab:(ARFairGuideViewController *)controller;
- (void)fairGuideViewControllerDidChangeUser:(ARFairGuideViewController *)controller;

@end

@interface ARFairGuideViewController : UIViewController

- (instancetype)initWithFair:(Fair *)fair __attribute((objc_designated_initializer));
- (instancetype)init __attribute__((unavailable("Designated Initializer initWithFair: must be used.")));

- (void)fairDidLoad;

@property (nonatomic, strong) ORStackScrollView *view;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, assign, readonly) BOOL contentIsOverstretched;
@property (nonatomic, assign, readwrite) BOOL showTopBorder;

@property (nonatomic, weak) id<ARFairGuideViewControllerDelegate> delegate;

@end
