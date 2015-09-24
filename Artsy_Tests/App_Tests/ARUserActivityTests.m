#import "ARUserActivity.h"
#import "ARRouter.h"
#import "Artwork.h"

SpecBegin(ARUserActivity);

__block NSString *baseURL;

beforeAll(^{
    baseURL = [[ARRouter baseWebURL] absoluteString];
});

it(@"creates an NSUserActivity", ^{
    
    it(@"for an artwork",^{
    
        Artwork *model = [Artwork modelWithJSON:@{
            @"id": @"artwork_id",
            @"title": @"Artwork Title",
            @"artist":@{ @"id":@"artist_id" },
            @"images":@[
                  @{@"id": @"image_1_id",
                    @"is_default": @NO,
                    @"image_versions": @[@"small", @"square"]},
                  @{@"id": @"image_2_id",
                    @"is_default": @YES,
                    @"image_versions": @[@"small", @"square"]}]
        }];
        
        ARUserActivity *activity = [ARUserActivity activityWithArtwork:model becomeCurrent:NO];
        NSURL* webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", baseURL, model.publicArtsyPath]];
    
        expect(activity.title).to.equal(@"Artwork Title");
        expect(activity.webpageURL).to.equal(webpageURL);
    });
    
    it(@"for an artist",^{

        Artist *model = [Artist modelWithJSON:@{
            @"id": @"some-artist",
            @"name": @"Artist Name",
            @"years": @"1928-1987",
            @"published_artworks_count": @(396),
            @"forsale_artworks_count": @(285),
            @"artworks_count": @(919)
        }];
        
        ARUserActivity *activity = [ARUserActivity activityWithArtist:model becomeCurrent:NO];
        NSURL* webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", baseURL, model.publicArtsyPath]];
        
        expect(activity.title).to.equal(@"Artist Name");
        expect(activity.webpageURL).to.equal(webpageURL);
    });
    
    it(@"for a gene",^{
        
        Gene *model = [Gene modelWithJSON:@{
            @"id" : @"painting",
            @"name" : @"Painting",
            @"description" : @"Lorem ipsum dolor sit amet..."
        }];
        
        ARUserActivity *activity = [ARUserActivity activityWithGene:model becomeCurrent:NO];
        NSURL* webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", baseURL, model.publicArtsyPath]];
        
        expect(activity.title).to.equal(@"Painting");
        expect(activity.webpageURL).to.equal(webpageURL);
    });
    
    it(@"for a fair",^{
        
        Fair *model = [Fair modelWithJSON:@{
            @"id" : @"a-fair-affair",
            @"name" : @"The Fair Affair",
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];
        
        ARUserActivity *activity = [ARUserActivity activityWithFair:model withProfile:nil becomeCurrent:NO];
        NSURL* webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", baseURL, model.fairID]];
        
        expect(activity.title).to.equal(@"The Fair Affair");
        expect(activity.webpageURL).to.equal(webpageURL);
    });
    
    it(@"for a show",^{
        
        PartnerShow *model = [PartnerShow modelWithJSON:@{
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

        
        ARUserActivity *activity = [ARUserActivity activityWithShow:model inFair:nil becomeCurrent:NO];
        NSURL* webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", baseURL, model.publicArtsyPath]];
        
        expect(activity.title).to.equal(@"Some Show");
        expect(activity.webpageURL).to.equal(webpageURL);
    });

});


SpecEnd;
