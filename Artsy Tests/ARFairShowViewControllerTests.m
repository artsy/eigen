#import "ARFairAwareObject.h"
#import "ARShowViewController.h"
#import "UIDevice-Hardware.h"
#import "ARStubbedShowNetworkModel.h"

@interface ARShowViewController ()

- (void)addMapPreview;
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@property (nonatomic, strong) ARShowNetworkModel *showNetworkModel;

@end

SpecBegin(ARFairShowViewController)

__block ARShowViewController *fairShowVC = nil;
__block Fair *fair = nil;
__block PartnerShow *show = nil;
__block ARStubbedShowNetworkModel *stubbedNetworkModel;

describe(@"with map", ^{
    beforeEach(^{
        show = [PartnerShow modelWithJSON:@{
            @"id": @"some-show",
            @"name": @"Some Show",
            @"partner": @{ @"id" : @"some-partner" },
            @"fair_location": @{
                @"map_points": @[
                    @{
                        @"x": @(0.15),
                        @"y": @(0.75)
                    }
                ]
            },
        }];

        fair = [Fair modelWithJSON:@{
            @"id" : @"fair-id",
            @"name" : @"The Armory Show",
            @"organizer" : @{ @"profile_id" : @"fair-profile-id" },
        }];

        // Required since Fair doesn't parse maps dictionary in Mantle
        Map *map = [Map modelWithJSON:@{
            @"id" : @"map-id",
            @"tile_size": @(512),
            @"map_features": @[],
            @"max_tiled_width": @(1000),
            @"max_tiled_height": @(2000)
        }];

        stubbedNetworkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:fair show:show maps:@[map]];
    });

    itHasSnapshotsForDevices(@"displays show title, map, and map button", ^{
        fairShowVC = [[ARShowViewController alloc] initWithShow:show fair:fair];
        fairShowVC.showNetworkModel = stubbedNetworkModel;
        [fairShowVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        return fairShowVC;
    });
});

describe(@"without map", ^{
    beforeEach(^{
        show = [PartnerShow modelWithJSON:@{
            @"id": @"some-show",
            @"name": @"Some Show",
            @"partner": @{ @"id" : @"some-partner" },
        }];

        fair = [Fair modelWithJSON:@{
            @"id" : @"fair-id",
            @"name" : @"The Armory Show",
            @"organizer" : @{ @"profile_id" : @"fair-profile-id" },
        }];


        stubbedNetworkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:fair show:show maps:nil];
    });

    itHasSnapshotsForDevices(@"displays show title", ^{
        fairShowVC = [[ARShowViewController alloc] initWithShow:show fair:fair];
        fairShowVC.showNetworkModel = stubbedNetworkModel;
        [fairShowVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        return fairShowVC;
    });

    itHasSnapshotsForDevices(@"displays show images with 1 install image", ^{
        fairShowVC = [[ARShowViewController alloc] initWithShow:show fair:fair];

        NSString *stubbedImagePath = OHPathForFileInBundle(@"stub.jpg", nil);
        stubbedNetworkModel.imagesForBoothHeader = [Image arrayOfModelsWithJSON:@[
            @{ @"image_url" : stubbedImagePath, @"image_versions" : @[@"large"] }
        ]];

        fairShowVC.showNetworkModel = stubbedNetworkModel;
        [fairShowVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        return fairShowVC;
    });

    itHasSnapshotsForDevices(@"displays show images with multiple install images", ^{
        fairShowVC = [[ARShowViewController alloc] initWithShow:show fair:fair];

        NSString *stubbedImagePath = OHPathForFileInBundle(@"stub.jpg", nil);

        stubbedNetworkModel.imagesForBoothHeader = [Image arrayOfModelsWithJSON: @[
            @{ @"image_url" : stubbedImagePath,  @"image_versions" : @[@"large"] },
            @{ @"image_url" : stubbedImagePath,  @"image_versions" : @[@"large"] }
        ]];

        fairShowVC.showNetworkModel = stubbedNetworkModel;
        [fairShowVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        return fairShowVC;
    });
});

SpecEnd
