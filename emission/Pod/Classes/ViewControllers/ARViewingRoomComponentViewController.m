#import "ARViewingRoomComponentViewController.h"
#import "AREmission.h"

@implementation ARViewingRoomComponentViewController

- (instancetype)initWithViewingRoomID:(NSString *)viewingRoomID
{
    return [self initWithViewingRoomID:viewingRoomID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithViewingRoomID:(NSString *)viewingRoomID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"ViewingRoom" initialProperties:@{ @"viewingRoomID": viewingRoomID }];
}

@end
