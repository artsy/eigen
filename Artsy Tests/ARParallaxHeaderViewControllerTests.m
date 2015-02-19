#import "ARParallaxHeaderViewController.h"
#import "Fair.h"
#import "Profile.h"
#import "MTLModel+JSON.h"
#import <OHHTTPStubs/OHHTTPStubs.h>
#import <SDWebImage/SDImageCache.h>

@interface ARParallaxHeaderViewController (Testing)
- (NSString *)iconURL;
@end

SpecBegin(ARParallaxHeaderViewController)

__block ARParallaxHeaderViewController *viewController;
__block Fair *fair;

beforeEach(^{
    [[SDImageCache sharedImageCache] clearDisk];
    [[SDImageCache sharedImageCache] clearMemory];
    
    fair = [Fair modelWithJSON:@{
        @"id" : @"fair-id",
        @"image_urls" : @{
            @"wide" : @"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/wide.jpg"
        },
        @"name" : @"The Ash Show",
        @"start_at" : @"2014-03-06T17:00:00.000+00:00",
        @"end_at" : @"2014-03-09T22:00:00.000+00:00",
        @"location" : @{
            @"city" : @"Toronto",
            @"state" : @"ON"
        }
    }];

    NSBundle *bundle = [NSBundle bundleForClass:[self class]];
    NSString *wideImagePath = [bundle pathForResource:@"wide" ofType:@"jpg"];
    UIImage *wideImage = [UIImage imageWithContentsOfFile:wideImagePath];
    NSString *squareImagePath = [bundle pathForResource:@"square" ofType:@"png"];
    UIImage *squareImage = [UIImage imageWithContentsOfFile:squareImagePath];

    [[SDImageCache sharedImageCache] storeImage:wideImage forKey:@"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/wide.jpg" toDisk:NO];
    [[SDImageCache sharedImageCache] storeImage:squareImage forKey:@"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png" toDisk:NO];
    [[SDImageCache sharedImageCache] storeImage:squareImage forKey:@"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square2.png" toDisk:NO];
});

afterEach(^{
    [OHHTTPStubs removeAllStubs];
    [[SDImageCache sharedImageCache] clearMemory];
});

describe(@"without an icon", ^{
    before(^{
        Profile *profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"icon" : @{
                @"image_urls" : @{
                }
            }
        }];

        viewController = [[ARParallaxHeaderViewController alloc] initWithContainingScrollView:nil fair:fair profile:profile];
    });

    it(@"has a valid snapshot", ^{
        expect(viewController.view).toNot.beNil();
        expect(viewController.view).to.haveValidSnapshot();
    });
});

describe(@"with an icon", ^{
    before(^{
        Profile *profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"default_icon_version" : @"square2",
            @"icon" : @{
                @"image_urls" : @{
                    @"square" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png",
                    @"square2" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square2.png"
                }
            }
        }];

        viewController = [[ARParallaxHeaderViewController alloc] initWithContainingScrollView:nil fair:fair profile:profile];
    });
    
    it(@"has a valid snapshot", ^{
        expect(viewController.view).toNot.beNil();
        expect(viewController.view).to.haveValidSnapshot();
    });
});


describe(@"with new banner urls", ^{
    before(^{
        fair = [Fair modelWithJSON:@{
        @"id" : @"fair-id",
        @"banner_image_urls" : @{
             @"wide" : @"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/wide.jpg"
         },
        @"name" : @"The Orta Show",
        @"start_at" : @"2014-03-06T17:00:00.000+00:00",
        @"end_at" : @"2014-03-09T22:00:00.000+00:00",
        @"location" : @{
             @"city" : @"Huddersfield",
             @"state" : @"Yorkshire"
         }
        }];

        Profile *profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"default_icon_version" : @"square2",
            @"icon" : @{
                @"image_urls" : @{
                    @"square" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png",
                    @"square2" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square2.png"
                    }
                }
            }];

        viewController = [[ARParallaxHeaderViewController alloc] initWithContainingScrollView:nil fair:fair profile:profile];
    });
    
    it(@"has a valid snapshot", ^{
        expect(viewController.view).toNot.beNil();
        expect(viewController.view).to.haveValidSnapshot();
    });
});


SpecEnd