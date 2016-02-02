#import "ARMacros.h"

#import <ORStackView/ORStackScrollView.h>

@class Fair, ARFairGuideViewController;

@protocol ARFairGuideViewControllerDelegate <NSObject>

- (void)fairGuideViewControllerDidChangeTab:(ARFairGuideViewController *)controller;
- (void)fairGuideViewControllerDidChangeUser:(ARFairGuideViewController *)controller;

@end

typedef NS_ENUM(NSInteger, ARFairGuideSelectedTab) {
    ARFairGuideSelectedTabUndefined = -1,
    ARFairGuideSelectedTabWork = 0,
    ARFairGuideSelectedTabExhibitors,
    ARFairGuideSelectedTabArtists
};


@interface ARFairGuideViewController : UIViewController

- (instancetype)initWithFair:(Fair *)fair AR_VC_DESIGNATED_INITIALIZER;

- (void)fairDidLoad;

@property (nonatomic, strong) ORStackScrollView *view;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, assign, readonly) BOOL contentIsOverstretched;
@property (nonatomic, assign, readwrite) BOOL showTopBorder;
@property (nonatomic, assign, readonly) ARFairGuideSelectedTab selectedTabIndex;

@property (nonatomic, weak) id<ARFairGuideViewControllerDelegate> delegate;

@end
