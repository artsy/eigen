#import "ARFairAwareObject.h"
#import "ARShowViewController.h"
#import "UIDevice-Hardware.h"
#import "ARStubbedShowNetworkModel.h"

@interface ARShowViewController ()

- (void)addMapPreview;
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@property (nonatomic, strong) ARShowNetworkModel *showNetworkModel;

@end

SpecBegin(ARShowViewController)

__block ARShowViewController *showVC = nil;
__block Fair *fair = nil;
__block PartnerShow *show = nil;
__block ARStubbedShowNetworkModel *stubbedNetworkModel;

describe(@"partner at a fair with map", ^{
    beforeEach(^{
        show = [PartnerShow modelWithJSON:@{
            @"id": @"some-show",
            @"name": @"Some Show",
            @"partner": @{
                    @"id" : @"some-partner",
                    @"name" : @"Some Gallery",
                    @"default_profile_id" : @"some-gallery",
                    @"default_profile_public" : @YES
            },
            @"fair" : @{
                @"name" : @"The Armory Show",
                @"id" : @"fair-id",
            },
            @"fair_location": @{
                @"display" : @"Armory Presents, Booth 666",
                @"map_points": @[
                    @{
                        @"x": @(0.15),
                        @"y": @(0.75)
                    }
                ]
            },
            @"location" : [NSNull null],
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
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
        showVC = [[ARShowViewController alloc] initWithShow:show fair:fair];
        showVC.showNetworkModel = stubbedNetworkModel;
        [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [showVC.view snapshotViewAfterScreenUpdates:YES];
        return showVC;
    });
});

describe(@"partner at a fair without map", ^{
    beforeEach(^{
        show = [PartnerShow modelWithJSON:@{
            @"id": @"some-show",
            @"name": @"Some Gallery at the Armory Show",
            @"fair" : @{
                @"id" : @"the-armory-show-2015",
                @"name" : @"The Armory Show 2015",
            },
            @"partner": @{
                @"id" : @"some-partner",
                @"name" : @"Some Gallery",
                @"default_profile_id" : @"some-gallery",
                @"default_profile_public" : @YES
            },
            @"fair_location" : @{
                @"display" : @"Armory Presents, Booth 666"
            },
            @"location" : [NSNull null],
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];

        fair = [Fair modelWithJSON:@{
            @"id" : @"fair-id",
            @"name" : @"The Armory Show",
            @"organizer" : @{ @"profile_id" : @"fair-profile-id" },
        }];


        stubbedNetworkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:fair show:show maps:nil];
    });

    itHasSnapshotsForDevices(@"displays show title", ^{
        showVC = [[ARShowViewController alloc] initWithShow:show fair:fair];
        showVC.showNetworkModel = stubbedNetworkModel;
        [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [showVC.view snapshotViewAfterScreenUpdates:YES];

        return showVC;
    });

    itHasSnapshotsForDevices(@"displays show images with 1 install image", ^{
        showVC = [[ARShowViewController alloc] initWithShow:show fair:fair];

        NSString *stubbedImagePath = OHPathForFileInBundle(@"stub.jpg", nil);
        stubbedNetworkModel.imagesForBoothHeader = [Image arrayOfModelsWithJSON:@[
            @{ @"image_url" : stubbedImagePath, @"image_versions" : @[@"large"] }
        ]];

        showVC.showNetworkModel = stubbedNetworkModel;
        [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [showVC.view snapshotViewAfterScreenUpdates:YES];

        return showVC;
    });

    itHasSnapshotsForDevices(@"displays show images with multiple install images", ^{
        showVC = [[ARShowViewController alloc] initWithShow:show fair:fair];

        NSString *stubbedImagePath = OHPathForFileInBundle(@"stub.jpg", nil);

        stubbedNetworkModel.imagesForBoothHeader = [Image arrayOfModelsWithJSON: @[
            @{ @"image_url" : stubbedImagePath,  @"image_versions" : @[@"large"] },
            @{ @"image_url" : stubbedImagePath,  @"image_versions" : @[@"large"] }
        ]];

        showVC.showNetworkModel = stubbedNetworkModel;
        [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [showVC.view snapshotViewAfterScreenUpdates:YES];

        return showVC;
    });
});

// a partner gallery show with a publicly viewable location should show the location and a follow button
describe(@"partner gallery, not in a fair, and has public location", ^{
    beforeEach(^{
        show = [PartnerShow modelWithJSON:@{
            @"id": @"some-show",
            @"name": @"Some Show",
            @"partner": @{
                    @"name" : @"Some Gallery",
                    @"id" : @"some-partner",
                    @"type" : @"Gallery",
                    @"default_profile_public" : @YES,
                    @"default_profile_id" : @"some-gallery",
            },
            @"location": @{
                    @"address" : @"123 Some Street",
                    @"city" : @"New York",
                    @"state" : @"NY",
                    @"publicly_viewable" : @YES
            },
            
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];

        stubbedNetworkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:nil show:show];
    });

    itHasSnapshotsForDevices(@"gallery", ^{
        showVC = [[ARShowViewController alloc] initWithShow:show fair:nil];
        showVC.showNetworkModel = stubbedNetworkModel;
        [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [showVC.view snapshotViewAfterScreenUpdates:YES];

        return showVC;
    });
});

// a non-gallery partner that doesn't have a public profile shouldn't have a follow button
describe(@"non-gallery partner, not in a fair, and has public location", ^{
    beforeEach(^{
        show = [PartnerShow modelWithJSON:@{
            @"id": @"some-show",
            @"name": @"Some Show",
            @"partner": @{
                @"name" : @"Some Museum",
                @"id" : @"some-partner",
                @"type" : @"Museum",
                @"default_profile_public" : @NO,
                @"default_profile_id" : @"some-museum"
            },
            @"location": @{
                @"address" : @"123 Some Street",
                @"city" : @"New York",
                @"state" : @"NY",
                @"publicly_viewable" : @YES
            },
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];

        stubbedNetworkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:nil show:show maps:nil];
    });

    itHasSnapshotsForDevices(@"not gallery public location", ^{
        showVC = [[ARShowViewController alloc] initWithShow:show fair:fair];
        showVC.showNetworkModel = stubbedNetworkModel;
        [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [showVC.view snapshotViewAfterScreenUpdates:YES];

        return showVC;
    });
});

// if the show location isn't publicly viewable, it shouldn't be shown
describe(@"non-gallery partner, not in a fair, and has private location", ^{
    beforeEach(^{
        show = [PartnerShow modelWithJSON:@{
            @"id": @"some-show",
            @"name": @"Some Show",
            @"partner": @{
                    @"id" : @"some-partner",
                    @"type" : @"Museum",
                    @"default_profile_public" : @YES
                    },
            @"location": @{
                    @"address" : @"123 Some Street",
                    @"city" : @"New York",
                    @"state" : @"NY",
                    @"publicly_viewable" : @NO
                    },
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
            }];
        
        stubbedNetworkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:nil show:show maps:nil];
    });
    
    itHasSnapshotsForDevices(@"not gallery private location", ^{
        showVC = [[ARShowViewController alloc] initWithShow:show fair:fair];
        showVC.showNetworkModel = stubbedNetworkModel;
        [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [showVC.view snapshotViewAfterScreenUpdates:YES];
        
        return showVC;
    });
});

SpecEnd
