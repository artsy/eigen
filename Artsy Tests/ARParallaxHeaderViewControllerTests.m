#import "ARParallaxHeaderViewController.h"
#import "Fair.h"
#import "Profile.h"
#import "MTLModel+JSON.h"
#import <OHHTTPStubs/OHHTTPStubs.h>
#import <SDWebImage/SDImageCache.h>

SpecBegin(ARParallaxHeaderViewController)

describe(@"with a full fair and profile", ^{
    __block ARParallaxHeaderViewController *viewController;
    
    beforeEach(^{
        [[SDImageCache sharedImageCache] clearDisk];
        [[SDImageCache sharedImageCache] clearMemory];
        
        Fair *fair = [Fair modelWithJSON:@{
            @"id" : @"fair-id",
            @"image_url" : @"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/:version.jpg",
            @"image_versions" : @[
                @"wide"
            ],
            @"name" : @"The Ash Show",
            @"start_at" : @"2014-03-06T17:00:00.000+00:00",
            @"end_at" : @"2014-03-09T22:00:00.000+00:00",
            @"location" : @{
                @"city" : @"Toronto",
                @"state" : @"ON"
            }
        }];
        
        Profile *profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"default_icon_version" : @"square",
            @"icon" : @{
                @"image_url" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/:version.jpg",
                @"image_versions" : @[
                    @"square"
                ]
            }
        }];
        
        NSBundle *bundle = [NSBundle bundleForClass:[self class]];
        NSString *wideImagePath = [bundle pathForResource:@"wide" ofType:@"jpg"];
        UIImage *wideImage = [UIImage imageWithContentsOfFile:wideImagePath];
        NSString *squareImagePath = [bundle pathForResource:@"square" ofType:@"png"];
        UIImage *squareImage = [UIImage imageWithContentsOfFile:squareImagePath];
        
        [[SDImageCache sharedImageCache] storeImage:wideImage forKey:@"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/wide.jpg" toDisk:NO];
        [[SDImageCache sharedImageCache] storeImage:squareImage forKey:@"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png" toDisk:NO];
        
        viewController = [[ARParallaxHeaderViewController alloc] initWithContainingScrollView:nil fair:fair profile:profile];
    });
    
    afterEach(^{
        [OHHTTPStubs removeAllStubs];
        [[SDImageCache sharedImageCache] clearMemory];
    });
    
    it(@"has a valid snapshot", ^{
        expect(viewController.view).toNot.beNil();
        expect(viewController.view).to.haveValidSnapshot();
    });
});

SpecEnd