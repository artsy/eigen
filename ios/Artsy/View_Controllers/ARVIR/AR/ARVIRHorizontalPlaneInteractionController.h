#import <Foundation/Foundation.h>
#import "ARVIRHorizontalPlaneInteractionController.h"
#import "ARAugmentedFloorBasedVIRViewController.h"

@interface ARVIRHorizontalPlaneInteractionController : NSObject  <ARSCNViewDelegate, ARVIRInteractive, ARSessionDelegate>

- (instancetype)initWithSession:(ARSession *)session config:(ARAugmentedRealityConfig *)config scene:(SCNView *)scene delegate:(id <ARVIRDelegate>)delegate API_AVAILABLE(ios(11.0));

@end
