#import "ARWorksForYouComponentViewController.h"
#import <React/RCTRootView.h>

@implementation ARWorksForYouComponentViewController

- (instancetype)initWithSelectedArtist:(NSString *)artistID;
{
    return [self initWithSelectedArtist:artistID emission:nil];
}

- (instancetype)initWithSelectedArtist:(NSString *)artistID emission:(AREmission *)emission;
{
    if ((self = [super initWithEmission:emission
                            moduleName:@"WorksForYou"
                      initialProperties:artistID ? @{ @"selectedArtist": artistID } : nil])) {
        _selectedArtist = artistID;
    }
    return self;
}

@end
