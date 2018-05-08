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

    ARSCNWallNode *box = [ARSCNWallNode boxWithWidth:200 height:0.01 length:0.01 chamferRadius:0];
    box.materials =  @[material, material, material, material, material, material];

    return box;
}

// TODO: MAke this invisible once it's reliable

+ (instancetype)fullWallNode
{
    // Sides
    SCNMaterial *material = [SCNMaterial material];
    material.diffuse.contents = [[UIColor blueColor] colorWithAlphaComponent:0.3];
    material.locksAmbientWithDiffuse = YES;

    // Back / Front
    SCNMaterial *frontMaterial = [[SCNMaterial alloc] init];
    frontMaterial.diffuse.contents = [[UIColor greenColor] colorWithAlphaComponent:0.3];
    frontMaterial.locksAmbientWithDiffuse = YES;

    material.locksAmbientWithDiffuse = YES;
    material.lightingModelName = SCNLightingModelConstant;

    ARSCNWallNode *box = [ARSCNWallNode boxWithWidth:20 height:6 length:0.1 chamferRadius:0];
    box.materials =  @[frontMaterial, material, frontMaterial, material, material, material];

    return box;
}

@end
