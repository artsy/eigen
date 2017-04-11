#import "ARWorksForYouComponentViewController.h"

@implementation ARWorksForYouComponentViewController

- (instancetype)initWithSelectedArtist:(NSString *)artistID;
{
    return [self initWithSelectedArtist:artistID emission:nil];
}

- (instancetype)initWithSelectedArtist:(NSString *)artistID emission:(AREmission *)emission;
{
    if ((self = [super initWithEmission:emission
                            moduleName:@"WorksForYou"
                     initialProperties:@{ @"selectedArtist": artistID }])) {
        _selectedArtist = artistID;
    }
    return self;
}

@end
