#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// Invoked on the main thread.
typedef void(^ARSwitchBoardPresentViewController)(UIViewController * _Nonnull fromViewController, NSString * _Nonnull route);

@interface ARSwitchBoardModule : NSObject <RCTBridgeModule>
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardPresentViewController presentNavigationViewController;
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardPresentViewController presentModalViewController;

@end
