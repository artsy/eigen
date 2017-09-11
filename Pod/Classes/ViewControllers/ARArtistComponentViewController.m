#import "ARArtistComponentViewController.h"

@implementation ARArtistComponentViewController

- (instancetype)initWithArtistID:(NSString *)artistID;
{
  return [self initWithArtistID:artistID emission:nil];
}

- (instancetype)initWithArtistID:(NSString *)artistID emission:(AREmission *)emission;
{
  BOOL isPad = UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad;
  if ((self = [super initWithEmission:emission
                           moduleName:@"Artist"
                    initialProperties:@{ @"artistID": artistID, @"isPad": @(isPad) }])) {
    _artistID = artistID;
  }
  return self;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
