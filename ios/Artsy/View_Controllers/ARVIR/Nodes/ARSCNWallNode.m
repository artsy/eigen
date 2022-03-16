#import "ARSCNWallNode.h"
#import "SCNArtworkNode.h"

@implementation ARSCNWallNode

+ (instancetype)shortWallNode;
{
    // Sides
    SCNMaterial *material = [SCNMaterial material];
    material.diffuse.contents = [UIColor whiteColor];
    material.locksAmbientWithDiffuse = YES;

    material.locksAmbientWithDiffuse = YES;
    material.lightingModelName = SCNLightingModelConstant;

    ARSCNWallNode *box = [ARSCNWallNode boxWithWidth:10 height:0.01 length:0.01 chamferRadius:0];
    box.materials =  @[material, material, material, material, material, material];

    return box;
}

+ (instancetype)fullWallNode
{
    // Sides
    SCNMaterial *material = [SCNMaterial material];
    material.diffuse.contents = [[UIColor blueColor] colorWithAlphaComponent:0];
    material.locksAmbientWithDiffuse = YES;

    // Back / Front
    SCNMaterial *frontMaterial = [[SCNMaterial alloc] init];
    frontMaterial.diffuse.contents = [[UIColor greenColor] colorWithAlphaComponent:0];
    frontMaterial.locksAmbientWithDiffuse = YES;

    material.locksAmbientWithDiffuse = YES;
    material.lightingModelName = SCNLightingModelConstant;

    ARSCNWallNode *box = [ARSCNWallNode boxWithWidth:20 height:[self.class wallHeight] length:0.1 chamferRadius:0];
    box.materials =  @[material, frontMaterial, material, material, material, material];

    return box;
}

+ (CGFloat)wallHeight
{
    return 4;
}

@end
