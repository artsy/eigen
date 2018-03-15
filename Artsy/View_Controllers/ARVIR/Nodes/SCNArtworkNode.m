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

    // Sides
    SCNMaterial *blackMaterial = [SCNMaterial material];
    blackMaterial.diffuse.contents = [UIColor blackColor];
    blackMaterial.locksAmbientWithDiffuse = YES;

    // Back / Front
    SCNMaterial *imageMaterial = [[SCNMaterial alloc] init];
    imageMaterial.diffuse.contents = config.image;
    imageMaterial.locksAmbientWithDiffuse = YES;
    imageMaterial.lightingModelName = SCNLightingModelPhysicallyBased;

    SCNArtworkNode *box = [SCNArtworkNode boxWithWidth:width height:height length:length chamferRadius:0];
    box.materials =  @[imageMaterial, blackMaterial, imageMaterial, blackMaterial, blackMaterial, blackMaterial];
    box.name = @"Artwork";

    return box;
}

@end
