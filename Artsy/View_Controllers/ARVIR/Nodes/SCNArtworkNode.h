@import SceneKit;
@class ARAugmentedRealityConfig;

@interface SCNArtworkNode : SCNBox

+ (instancetype)nodeWithConfig:(ARAugmentedRealityConfig *)config;

@end
