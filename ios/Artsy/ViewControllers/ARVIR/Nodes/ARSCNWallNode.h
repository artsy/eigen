@import SceneKit;

@interface ARSCNWallNode : SCNBox

+ (instancetype)shortWallNode;
+ (instancetype)fullWallNode;

+ (CGFloat)wallHeight;
@end
