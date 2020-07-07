#import "ARArtistSeriesComponentViewController.h"

@implementation ARArtistSeriesComponentViewController

- (instancetype)init
{
  return [self initWithEmission:nil];
}


- (instancetype)initWithArtistSeriesID:(nullable NSString *)artistSeriesID
{
    return [self initWithArtistSeriesID:artistSeriesID emission:nil];
}

- (instancetype)initWithArtistSeriesID:(nullable NSString *)artistSeriesID
                            emission:(nullable AREmission*)emission
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"ArtistSeries"
                      initialProperties:@{ @"artistSeriesID": artistSeriesID }])) {
        _artistSeriesID = artistSeriesID;

    }
    return self;
}


- (instancetype)initWithEmission:(AREmission *)emission
{
    return [super initWithEmission:emission
                        moduleName:@"ArtistSeries"
                 initialProperties:@{}];
}

@end
