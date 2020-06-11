#import "ARViewingRoomsComponentViewController.h"


@implementation ARViewingRoomsComponentViewController

- (instancetype)init
{
    return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(AREmission *)emission
{
    return [super initWithEmission:emission
                        moduleName:@"ViewingRooms"
                 initialProperties:nil];
}

@end
