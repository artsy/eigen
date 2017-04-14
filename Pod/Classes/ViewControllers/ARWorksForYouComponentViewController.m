#import "ARWorksForYouComponentViewController.h"

@implementation ARWorksForYouComponentViewController

- (instancetype)initWithSelectedArtist:(NSString *)artistID;
{
    return [self initWithSelectedArtist:artistID emission:nil];
}

- (instancetype)initWithSelectedArtist:(NSString *)artistID emission:(AREmission *)emission;
{
    NSDictionary *initialProperties = @{};
    if (artistID) {
        initialProperties = @{ @"selectedArtist": artistID };
    }

    if ((self = [super initWithEmission:emission
                            moduleName:@"WorksForYou"
                     initialProperties:initialProperties])) {
        _selectedArtist = artistID;
    }
    return self;
}

@end
