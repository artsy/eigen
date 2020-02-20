#import "ARCollectionFullFeaturedArtistListComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARCollectionFullFeaturedArtistListComponentViewController

- (instancetype)initWithCollectionID:(nullable NSString *)collectionID
{
    return [self initWithCollectionID:collectionID emission:nil];
}

- (instancetype)initWithCollectionID:(nullable NSString *)collectionID
                            emission:(nullable AREmission*)emission
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"FullFeaturedArtistList"
                      initialProperties:@{ @"collectionID": collectionID }])) {
        _collectionID = collectionID;
    }
    return self;
}

@end
