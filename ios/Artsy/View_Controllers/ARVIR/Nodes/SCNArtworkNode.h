@import SceneKit;
@class ARAugmentedRealityConfig;


@interface SCNArtworkNode : SCNBox

+ (instancetype)nodeWithConfig:(ARAugmentedRealityConfig *)config;

+ (instancetype)shadowNodeWithConfig:(ARAugmentedRealityConfig *)config;

+ (SCNNode *)ghostOutlineNodeWithConfig:(ARAugmentedRealityConfig *)config;

@end
