#import "ARArtistComponentViewController.h"

@implementation ARArtistComponentViewController

- (instancetype)initWithArtistID:(NSString *)artistID;
{
  return [self initWithArtistID:artistID emission:nil];
}

- (instancetype)initWithArtistID:(NSString *)artistID emission:(AREmission *)emission;
{
  if ((self = [super initWithEmission:emission
                           moduleName:@"Artist"
                    initialProperties:@{ @"artistID": artistID }])) {
    _artistID = artistID;
    self.automaticallyAdjustsScrollViewInsets = NO;
  }
  return self;
}

@end