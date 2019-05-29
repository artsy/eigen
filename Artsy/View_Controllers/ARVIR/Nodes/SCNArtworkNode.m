#import "SCNArtworkNode.h"
#import "ARAugmentedRealityConfig.h"

@implementation SCNArtworkNode

+ (instancetype)boxWithConfig:(ARAugmentedRealityConfig *)config API_AVAILABLE(ios(11.3))
{
    CGFloat width = [[[[NSMeasurement alloc] initWithDoubleValue:config.size.width
                                                            unit:NSUnitLength.inches]
                      measurementByConvertingToUnit:NSUnitLength.meters]
                     doubleValue];

    CGFloat height = [[[[NSMeasurement alloc] initWithDoubleValue:config.size.height
                                                             unit:NSUnitLength.inches]
                       measurementByConvertingToUnit:NSUnitLength.meters]
                      doubleValue];

    CGFloat length = [[[[NSMeasurement alloc] initWithDoubleValue:config.depth
                                                             unit:NSUnitLength.inches]
                       measurementByConvertingToUnit:NSUnitLength.meters]
                      doubleValue];
    return [SCNArtworkNode boxWithWidth:width height:height length:length chamferRadius:0];
}

+ (instancetype)nodeWithConfig:(ARAugmentedRealityConfig *)config
{

    // Sides / Back
    SCNMaterial *blackMaterial = [SCNMaterial material];
    blackMaterial.diffuse.contents = [UIColor blackColor];
    blackMaterial.locksAmbientWithDiffuse = YES;

    // Front
    SCNMaterial *imageMaterial = [[SCNMaterial alloc] init];
    imageMaterial.diffuse.contents = config.image;
    imageMaterial.locksAmbientWithDiffuse = YES;
    imageMaterial.lightingModelName = SCNLightingModelPhysicallyBased;

    SCNArtworkNode *box = [self boxWithConfig:config];
    box.materials =  @[blackMaterial, blackMaterial, imageMaterial, blackMaterial, blackMaterial, blackMaterial];
    box.name = @"Artwork";

    return box;
}



+ (SCNNode *)ghostOutlineNodeWithConfig:(ARAugmentedRealityConfig *)config
{
    SCNMaterial *whiteMaterial = [SCNMaterial material];
    whiteMaterial.diffuse.contents = [UIColor whiteColor];
    whiteMaterial.locksAmbientWithDiffuse = YES;

    NSArray *materials =  @[whiteMaterial, whiteMaterial, whiteMaterial, whiteMaterial, whiteMaterial, whiteMaterial];

    CGFloat width = [[[[NSMeasurement alloc] initWithDoubleValue:config.size.width
                                                            unit:NSUnitLength.inches]
                                   measurementByConvertingToUnit:NSUnitLength.meters] doubleValue];

    CGFloat height = [[[[NSMeasurement alloc] initWithDoubleValue:config.size.height
                                                             unit:NSUnitLength.inches]
                                    measurementByConvertingToUnit:NSUnitLength.meters] doubleValue];

    CGFloat distance = 0.001;
    CGFloat nonOrdinalLength = 0.01; // e.g. the sides

    SCNBox *top = [SCNBox boxWithWidth:width + nonOrdinalLength height:nonOrdinalLength length:nonOrdinalLength chamferRadius:0];
    top.materials = materials;
    SCNNode *topNode = [SCNNode nodeWithGeometry:top];
    topNode.position =  SCNVector3Make(0, -(height/2) - distance, 0);

    SCNBox *bottom = [SCNBox boxWithWidth:width + nonOrdinalLength height:nonOrdinalLength length:nonOrdinalLength chamferRadius:0];
    bottom.materials = materials;
    SCNNode *bottomNode = [SCNNode nodeWithGeometry:bottom];
    bottomNode.position =  SCNVector3Make(0, (height/2) + distance, 0);

    SCNBox *left = [SCNBox boxWithWidth:nonOrdinalLength height:height + nonOrdinalLength length:nonOrdinalLength chamferRadius:0];
    left.materials = materials;
    SCNNode *leftNode = [SCNNode nodeWithGeometry:left];
    leftNode.position =  SCNVector3Make(width/2 + distance, 0, 0);

    SCNBox *right = [SCNBox boxWithWidth:nonOrdinalLength height:height  + nonOrdinalLength length:nonOrdinalLength chamferRadius:0];
    right.materials = materials;
    SCNNode *rightNode = [SCNNode nodeWithGeometry:right];
    rightNode.position =  SCNVector3Make(-width/2 - distance, 0, 0);

    SCNNode *hostNode = [SCNNode node];
    [hostNode addChildNode:topNode];
    [hostNode addChildNode:bottomNode];
    [hostNode addChildNode:leftNode];
    [hostNode addChildNode:rightNode];

    return hostNode;
}


+ (instancetype)shadowNodeWithConfig:(ARAugmentedRealityConfig *)config
{

    CGFloat width = [[[[NSMeasurement alloc] initWithDoubleValue:config.size.width
                                                            unit:NSUnitLength.inches]
                      measurementByConvertingToUnit:NSUnitLength.meters]
                     doubleValue];

    CGFloat height = [[[[NSMeasurement alloc] initWithDoubleValue:config.size.height
                                                             unit:NSUnitLength.inches]
                       measurementByConvertingToUnit:NSUnitLength.meters]
                      doubleValue];

    // Sides / Back
    SCNMaterial *clearMaterial = [SCNMaterial material];
    clearMaterial.diffuse.contents = [UIColor clearColor];

    // Front
    SCNMaterial *imageMaterial = [[SCNMaterial alloc] init];
    imageMaterial.diffuse.contents = [UIImage imageNamed:@"ARVIRShadow"];
    imageMaterial.locksAmbientWithDiffuse = YES;
    imageMaterial.lightingModelName = SCNLightingModelConstant;

    SCNArtworkNode *box = [SCNArtworkNode boxWithWidth:width + 0.05 height:height + 0.04 length:0.01 chamferRadius:0];
    box.materials =  @[clearMaterial, clearMaterial, imageMaterial, clearMaterial, clearMaterial, clearMaterial];
    box.name = @"Artwork Shadow";

    return box;
}

@end
