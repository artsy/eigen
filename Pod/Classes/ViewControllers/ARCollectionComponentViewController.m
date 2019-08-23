#import "ARCollectionComponentViewController.h"

@interface ARCollectionComponentViewController ()

@end

@implementation ARCollectionComponentViewController

- (instancetype)initWithCollectionID:(nullable NSString *)collectionID
{
    return [self initWithCollectionID:collectionID emission:nil];
}

- (instancetype)initWithCollectionID:(nullable NSString *)collectionID
                            emission:(nullable AREmission*)emission
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"Collection"
                      initialProperties:@{ @"collectionID": collectionID }])) {
        _collectionID = collectionID;
    }
    return self;
}

@end
