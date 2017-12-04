#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// Invoked on the main thread.
typedef void(^ARSwitchBoardPresentViewController)(UIViewController * _Nonnull fromViewController, NSString * _Nonnull route);
typedef void(^ARSwitchBoardHandleArtworkSet)(UIViewController * _Nonnull fromViewController, NSArray<NSString *> * _Nonnull artworkIDs, NSNumber * _Nonnull index);

@interface ARSwitchBoardModule : NSObject <RCTBridgeModule>
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardPresentViewController presentNavigationViewController;
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardPresentViewController presentModalViewController;
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardHandleArtworkSet presentArtworkSet;
@end
