#import "ARFairAwareObject.h"
#import "ARShowViewController.h"
#import "UIDevice-Hardware.h"
#import "ARStubbedShowNetworkModel.h"


@interface ARShowViewController ()

- (void)addMapPreview;
@property (nonatomic, strong) ARShowNetworkModel *showNetworkModel;

@end

SpecBegin(ARShowViewController);

describe(@"at a fair", ^{
    __block ARShowViewController *showVC;
    __block Fair *fair = [Fair modelWithJSON:@{
        @"id" : @"fair-id",
        @"name" : @"The Armory Show",
        @"organizer" : @{ @"profile_id" : @"fair-profile-id" },
    }];

    // show, fair, networkModel
    sharedExamples(@"looks correct", ^(NSDictionary *data) {
        __block ARStubbedShowNetworkModel *networkModel;

        before(^{
            PartnerShow *show = data[@"show"];
            Fair *fair = data[@"fair"];

            showVC = [[ARShowViewController alloc] initWithShow:show fair:fair];
            networkModel = data[@"networkModel"];
            showVC.showNetworkModel = networkModel;
        });

//        TODO MAXIM : uncomment and fix tests
//        describe(@"with no images", ^{
//            itHasSnapshotsForDevices(^{
//
//                [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
//                [showVC.view snapshotViewAfterScreenUpdates:YES];
//
//                return showVC;
//            });
//        });
//
//        describe(@"with 1 install image", ^{
//            itHasSnapshotsForDevices(^{
//
//                NSString *stubbedImagePath = OHPathForFileInBundle(@"stub.jpg", nil);
//                networkModel.imagesForBoothHeader = [Image arrayOfModelsWithJSON:@[
//                    @{ @"image_url" : stubbedImagePath, @"image_versions" : @[@"large"] }
//                ]];
//
//                [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
//                [showVC.view snapshotViewAfterScreenUpdates:YES];
//
//                return showVC;
//            });
//        });
//
//        describe(@"with multiple install images", ^{
//            itHasSnapshotsForDevices(^{
//
//                NSString *stubbedImagePath = OHPathForFileInBundle(@"stub.jpg", nil);
//
//                networkModel.imagesForBoothHeader = [Image arrayOfModelsWithJSON: @[
//                    @{ @"image_url" : stubbedImagePath,  @"image_versions" : @[@"large"] },
//                    @{ @"image_url" : stubbedImagePath,  @"image_versions" : @[@"large"] }
//                ]];
//
//                [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
//                [showVC.view snapshotViewAfterScreenUpdates:YES];
//                
//                return showVC;
//            });
//        });
    });

    describe(@"with map", ^{
        PartnerShow *show = [PartnerShow modelWithJSON:@{
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

        // Required since Fair doesn't parse maps dictionary in Mantle
        Map *map = [Map modelWithJSON:@{
            @"id" : @"map-id",
            @"tile_size": @(512),
            @"map_features": @[],
            @"max_tiled_width": @(1000),
            @"max_tiled_height": @(2000)
        }];

        ARStubbedShowNetworkModel *networkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:fair show:show maps:@[map]];
        itBehavesLike(@"looks correct", @{@"fair":fair, @"show":show, @"networkModel":networkModel});
    });

    describe(@"without map", ^{
        PartnerShow *show = [PartnerShow modelWithJSON:@{
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

        ARStubbedShowNetworkModel *networkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:fair show:show maps:nil];

        itBehavesLike(@"looks correct", @{@"fair":fair, @"show":show, @"networkModel":networkModel});
    });
});


// a partner gallery show with a publicly viewable location should show the location and a follow button

describe(@"not at a fair", ^{

//    sharedExamples(@"looks correct", ^(NSDictionary *data) {
//        NSDictionary *json = data[@"json"];
//
//        itHasSnapshotsForDevices(^{
//            PartnerShow *show = [PartnerShow modelWithJSON:json];
//            ARStubbedShowNetworkModel *networkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:nil show:show];
//
//            ARShowViewController *showVC = [[ARShowViewController alloc] initWithShow:show fair:nil];
//            showVC.showNetworkModel = networkModel;
//            [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
//            [showVC.view snapshotViewAfterScreenUpdates:YES];
//
//            return showVC;
//        });
//    });

//    __block NSDictionary *showJSON = @{
//        @"id": @"some-show",
//        @"name": @"Some Show",
//        @"partner": [NSMutableDictionary dictionaryWithDictionary:@{
//             @"id" : @"some-partner",
//             @"default_profile_id" : @"some-gallery"
//        }],
//        @"location": [NSMutableDictionary dictionaryWithDictionary:@{
//             @"address" : @"123 Some Street",
//             @"city" : @"New York",
//             @"state" : @"NY",
//             }],
//
//        @"start_at" : @"1976-01-30T15:00:00+00:00",
//        @"end_at" : @"1976-02-02T15:00:00+00:00"
//    };
//
//    describe(@"gallery with public profile with public location", ^{
//        beforeEach(^{
//            [showJSON[@"partner"] setValue:@"Gallery" forKey:@"type"];
//            [showJSON[@"partner"] setValue:@"Some Gallery" forKey:@"name"];
//            [showJSON[@"partner"] setValue:@YES forKey:@"default_profile_public"];
//            [showJSON[@"location"] setValue:@YES forKey:@"publicly_viewable"];
//        });
//
//       itBehavesLike(@"looks correct", @{@"json":showJSON});
//
//    });
//
//    describe(@"gallery with public profile with private location", ^{
//        beforeEach(^{
//            [showJSON[@"partner"] setValue:@"Gallery" forKey:@"type"];
//            [showJSON[@"partner"] setValue:@"Some Gallery" forKey:@"name"];
//            [showJSON[@"partner"] setValue:@YES forKey:@"default_profile_public"];
//            [showJSON[@"location"] setValue:@NO forKey:@"publicly_viewable"];
//        });
//
//        itBehavesLike(@"looks correct", @{@"json":showJSON});
//
//    });
//
//    describe(@"gallery with private profile with public location", ^{
//        beforeEach(^{
//            [showJSON[@"partner"] setValue:@"Gallery" forKey:@"type"];
//            [showJSON[@"partner"] setValue:@"Some Gallery" forKey:@"name"];
//            [showJSON[@"partner"] setValue:@NO forKey:@"default_profile_public"];
//            [showJSON[@"location"] setValue:@YES forKey:@"publicly_viewable"];
//        });
//
//        itBehavesLike(@"looks correct", @{@"json":showJSON});
//        
//    });
//
//    describe(@"gallery with private profile with private location", ^{
//        beforeEach(^{
//            [showJSON[@"partner"] setValue:@"Gallery" forKey:@"type"];
//            [showJSON[@"partner"] setValue:@"Some Gallery" forKey:@"name"];
//            [showJSON[@"partner"] setValue:@NO forKey:@"default_profile_public"];
//            [showJSON[@"location"] setValue:@NO forKey:@"publicly_viewable"];
//        });
//
//        itBehavesLike(@"looks correct", @{@"json":showJSON});
//
//    });
//
//    describe(@"non-gallery with public profile with public location", ^{
//        beforeEach(^{
//            [showJSON[@"partner"] setValue:@"Museum" forKey:@"type"];
//            [showJSON[@"partner"] setValue:@"Some Museum" forKey:@"name"];
//            [showJSON[@"partner"] setValue:@YES forKey:@"default_profile_public"];
//            [showJSON[@"location"] setValue:@YES forKey:@"publicly_viewable"];
//        });
//
//        itBehavesLike(@"looks correct", @{@"json":showJSON});
//
//    });
//
//    describe(@"museum with public profile with private location", ^{
//        beforeEach(^{
//            [showJSON[@"partner"] setValue:@"Gallery" forKey:@"type"];
//            [showJSON[@"partner"] setValue:@"Some Gallery" forKey:@"name"];
//            [showJSON[@"partner"] setValue:@YES forKey:@"default_profile_public"];
//            [showJSON[@"location"] setValue:@NO forKey:@"publicly_viewable"];
//        });
//
//        itBehavesLike(@"looks correct", @{@"json":showJSON});
//
//    });
//
//    describe(@"museum with private profile with public location", ^{
//        beforeEach(^{
//            [showJSON[@"partner"] setValue:@"Gallery" forKey:@"type"];
//            [showJSON[@"partner"] setValue:@"Some Gallery" forKey:@"name"];
//            [showJSON[@"partner"] setValue:@NO forKey:@"default_profile_public"];
//            [showJSON[@"location"] setValue:@YES forKey:@"publicly_viewable"];
//        });
//
//        itBehavesLike(@"looks correct", @{@"json":showJSON});
//
//    });
//
//    describe(@"museum with private profile with private location", ^{
//        beforeEach(^{
//            [showJSON[@"partner"] setValue:@"Gallery" forKey:@"type"];
//            [showJSON[@"partner"] setValue:@"Some Gallery" forKey:@"name"];
//            [showJSON[@"partner"] setValue:@NO forKey:@"default_profile_public"];
//            [showJSON[@"location"] setValue:@NO forKey:@"publicly_viewable"];
//        });
//
//        itBehavesLike(@"looks correct", @{@"json":showJSON});
//        
//    });
});

//it(@"creates an NSUserActivity", ^{
//    
//    PartnerShow *show = [PartnerShow modelWithJSON:@{
//        @"id": @"some-show",
//        @"name": @"Some Gallery at the Armory Show",
//        @"fair" : @{
//             @"id" : @"the-armory-show-2015",
//             @"name" : @"The Armory Show 2015",
//             },
//        @"partner": @{
//             @"id" : @"some-partner",
//             @"name" : @"Some Gallery",
//             @"default_profile_id" : @"some-gallery",
//             @"default_profile_public" : @YES
//             },
//        @"fair_location" : @{
//             @"display" : @"Armory Presents, Booth 666"
//             },
//        @"location" : [NSNull null],
//        @"start_at" : @"1976-01-30T15:00:00+00:00",
//        @"end_at" : @"1976-02-02T15:00:00+00:00"
//    }];
//    
//    ARStubbedShowNetworkModel *networkModel = [[ARStubbedShowNetworkModel alloc] initWithFair:nil show:show];
//    
//    ARShowViewController *showVC = [[ARShowViewController alloc] initWithShow:show fair:nil];
//    showVC.showNetworkModel = networkModel;
//    [showVC ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
//    [showVC.view snapshotViewAfterScreenUpdates:YES];
//
//    expect(showVC.userActivity).willNot.beNil();
//    expect(showVC.userActivity.title).to.equal(@"Some Gallery at the Armory Show");
//});

SpecEnd;
