#import "ARArtworkComponentViewController.h"

@interface ARArtworkComponentViewController ()
@end

@implementation ARArtworkComponentViewController

- (instancetype)initWithArtworkID:(NSString *)artworkID;
{
    return [self initWithArtworkID:artworkID emission:nil];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID
                         emission:(nullable AREmission *)emission;
{
    if ((self = [super initWithEmission:emission
                        moduleName:@"Artwork"
                      initialProperties:@{ @"artworkID": artworkID }])) {
        _artworkID = artworkID;
    }
    return self;
}

@end
