#import "ARArtistSeriesFullArtistSeriesListComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARArtistSeriesFullArtistSeriesListComponentViewController

- (instancetype)initWithArtistID:(nullable NSString *)artistID
{
    return [self initWithArtistID:artistID emission:nil];
}

- (instancetype)initWithArtistID:(nullable NSString *)artistID
                            emission:(nullable AREmission*)emission
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"FullArtistSeriesList"
                      initialProperties:@{ @"artistID": artistID }])) {
        _artistID = artistID;
    }
    return self;
}

@end
