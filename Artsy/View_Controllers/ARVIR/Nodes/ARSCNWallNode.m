#import "ARSCNWallNode.h"
#import "SCNArtworkNode.h"

@implementation ARSCNWallNode

+ (instancetype)shortWallNode;
{
    // Sides
    SCNMaterial *material = [SCNMaterial material];
    material.diffuse.contents = [UIColor redColor];
    material.locksAmbientWithDiffuse = YES;

    material.locksAmbientWithDiffuse = YES;
    material.lightingModelName = SCNLightingModelPhysicallyBased;

    ARSCNWallNode *box = [ARSCNWallNode boxWithWidth:200 height:0.01 length:0.01 chamferRadius:0];
    box.materials =  @[material, material, material, material, material, material];

    return box;
}

+ (instancetype)fullWallNode
{
    // Sides
    SCNMaterial *material = [SCNMaterial material];
    material.diffuse.contents = [[UIColor blueColor] colorWithAlphaComponent:0.4];
    material.locksAmbientWithDiffuse = YES;

    material.locksAmbientWithDiffuse = YES;
    material.lightingModelName = SCNLightingModelPhysicallyBased;

    ARSCNWallNode *box = [ARSCNWallNode boxWithWidth:0.2 height:3 length:0.1 chamferRadius:0];
    box.materials =  @[material, material, material, material, material, material];

    return box;
}


@end
