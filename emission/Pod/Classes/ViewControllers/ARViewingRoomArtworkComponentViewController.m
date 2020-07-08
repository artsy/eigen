#import "ARViewingRoomArtworkComponentViewController.h"
#import "AREmission.h"


@implementation ARViewingRoomArtworkComponentViewController

- (instancetype)initWithViewingRoomID:(NSString *)viewingRoomID
                            artworkID:(nonnull NSString *)artworkID
{
    return [self initWithViewingRoomID:viewingRoomID
                             artworkID:artworkID
                              emission:[AREmission sharedInstance]];
}

- (instancetype)initWithViewingRoomID:(NSString *)viewingRoomID
                            artworkID:(nonnull NSString *)artworkID
                             emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission
                        moduleName:@"ViewingRoomArtwork"
                 initialProperties:@{
                     @"viewingRoomID": viewingRoomID,
                     @"artworkID": artworkID,
                 }];
}

@end
