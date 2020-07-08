#import "ARMyCollectionArtworkDetailComponentViewController.h"

@implementation ARMyCollectionArtworkDetailComponentViewController

- (instancetype)initWithArtworkID:(NSString *)artworkID;
{
    return [self initWithArtworkID:artworkID emission:nil];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID
                         emission:(nullable AREmission *)emission;
{
    if ((self = [super initWithEmission:emission
                        moduleName:@"MyCollectionArtworkDetail"
                      initialProperties:@{ @"artworkID": artworkID }])) {
        _artworkID = artworkID;
    }
    return self;
}

@end
