#import "ARViewingRoomArtworksComponentViewController.h"
#import "AREmission.h"

@implementation ARViewingRoomArtworksComponentViewController

- (instancetype)initWithViewingRoomID:(NSString *)viewingRoomID
{
    return [self initWithViewingRoomID:viewingRoomID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithViewingRoomID:(NSString *)viewingRoomID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"ViewingRoomArtworks" initialProperties:@{ @"viewingRoomID": viewingRoomID }];
}

@end
