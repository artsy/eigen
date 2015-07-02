#import "ARSwitchView+FairGuide.h"

NSInteger const ARSwitchViewWorkButtonIndex = 0;
NSInteger const ARSwitchViewExhibitorsButtonIndex = 1;
NSInteger const ARSwitchViewArtistsButtonIndex = 2;


@implementation ARSwitchView (FairGuide)

+ (NSArray *)fairGuideButtonTitleArray
{
    return @[
        @"WORK",
        @"EXHIBITORS",
        @"ARTISTS"
    ];
}

@end
