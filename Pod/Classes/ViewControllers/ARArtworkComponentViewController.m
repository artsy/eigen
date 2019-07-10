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
    return [super initWithEmission:emission
                        moduleName:@"Artwork"
                 initialProperties:@{ @"artworkID": artworkID }];
}

- (BOOL)fullBleed
{
    return YES;
}

- (BOOL)shouldInjectSafeAreaInsets
{
    return YES;
}

@end
