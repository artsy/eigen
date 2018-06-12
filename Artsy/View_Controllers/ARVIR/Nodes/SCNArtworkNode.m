#import "SCNArtworkNode.h"
#import "ARAugmentedRealityConfig.h"

@implementation SCNArtworkNode

+ (instancetype)nodeWithConfig:(ARAugmentedRealityConfig *)config
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

    // Sides / Back
    SCNMaterial *blackMaterial = [SCNMaterial material];
    blackMaterial.diffuse.contents = [UIColor blackColor];
    blackMaterial.locksAmbientWithDiffuse = YES;

    // Front
    SCNMaterial *imageMaterial = [[SCNMaterial alloc] init];
    imageMaterial.diffuse.contents = config.image;
    imageMaterial.locksAmbientWithDiffuse = YES;
    imageMaterial.lightingModelName = SCNLightingModelPhysicallyBased;

    SCNArtworkNode *box = [SCNArtworkNode boxWithWidth:width height:height length:length chamferRadius:0];
    box.materials =  @[blackMaterial, blackMaterial, imageMaterial, blackMaterial, blackMaterial, blackMaterial];
    box.name = @"Artwork";

    return box;
}



+ (instancetype)shadowNodeWithConfig:(ARAugmentedRealityConfig *)config
{
    CGFloat width = [[[[NSMeasurement alloc] initWithDoubleValue:config.size.width + 10
                                                            unit:NSUnitLength.inches]
                      measurementByConvertingToUnit:NSUnitLength.meters]
                     doubleValue];

    CGFloat height = [[[[NSMeasurement alloc] initWithDoubleValue:config.size.height + 10
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

    SCNArtworkNode *box = [SCNArtworkNode boxWithWidth:width height:height length:0.1 chamferRadius:0];
    box.materials =  @[clearMaterial, clearMaterial, imageMaterial, clearMaterial, clearMaterial, clearMaterial];
    box.name = @"Artwork Shadow";

    return box;
}

@end
