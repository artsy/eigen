@import SceneKit;
@class ARAugmentedRealityConfig;


@interface SCNArtworkNode : SCNBox

+ (instancetype)nodeWithConfig:(ARAugmentedRealityConfig *)config API_AVAILABLE(ios(11.3));

+ (instancetype)shadowNodeWithConfig:(ARAugmentedRealityConfig *)config API_AVAILABLE(ios(11.3));

+ (SCNNode *)ghostOutlineNodeWithConfig:(ARAugmentedRealityConfig *)config API_AVAILABLE(ios(11.3));

@end
