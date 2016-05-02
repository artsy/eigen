#import "ARParallaxHeaderViewController.h"
#import "Fair.h"
#import "Profile.h"
#import "MTLModel+JSON.h"
#import <OHHTTPStubs/OHHTTPStubs.h>
#import <SDWebImage/SDImageCache.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARParallaxHeaderViewController (Testing)
- (NSString *)iconURL;
@end

void cacheFixturedFile(NSString *file, NSString *type, NSString *address);

SpecBegin(ARParallaxHeaderViewController);

__block ARParallaxHeaderViewController *viewController;
__block Fair *fair;

beforeEach(^{    
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

    cacheFixturedFile(@"wide", @"jpg", @"http://static1.artsy.net/fairs/52617c6c8b3b81f094000013/9/wide.jpg");
    cacheFixturedFile(@"square", @"png", @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png");
    cacheFixturedFile(@"square", @"png", @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square2.png");
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
        [viewController.view constrainWidth:@"375"];
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
            @"default_icon_version" : @"square",
            @"icon" : @{
                @"image_urls" : @{
                    @"square" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png",
                    @"square2" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square2.png"
                }
            }
        }];

        viewController = [[ARParallaxHeaderViewController alloc] initWithContainingScrollView:nil fair:fair profile:profile];
        [viewController.view constrainWidth:@"375"];
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
        [viewController.view constrainWidth:@"375"];
    });
    
    it(@"has a valid snapshot", ^{
        expect(viewController.view).toNot.beNil();
        expect(viewController.view).to.haveValidSnapshot();
    });
});


SpecEnd;

void cacheFixturedFile(NSString *file, NSString *type, NSString *address)
{
    NSBundle *bundle = [NSBundle bundleForClass:ARParallaxHeaderViewControllerSpec.class];
    NSString *path = [bundle pathForResource:file ofType:type];
    UIImage *image = [UIImage imageWithContentsOfFile:path];
    [[SDWebImageManager sharedManager] saveImageToCache:image forURL:[NSURL URLWithString:address]];
}
