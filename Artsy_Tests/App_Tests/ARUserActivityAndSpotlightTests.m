#import "ARUserActivity.h"
#import "ARSpotlight.h"

#import "ARArtworkFavoritesNetworkModel.h"
#import "ARGeneFavoritesNetworkModel.h"
#import "ARArtistFavoritesNetworkModel.h"
#import "ARStubbedFavoritesNetworkModel.h"

#import <CoreSpotlight/CoreSpotlight.h>
#import <SDWebImage/SDWebImageManager.h>
#import <SDWebImage/SDWebImageDownloader.h>


@interface ARSpotlight (Private)
+ (NSMutableSet *)indexedEntities;
+ (void)indexFavoritesPass:(NSMutableArray *)networkModels
         previouslyIndexed:(NSMutableSet *)previouslyIndexed
             finalizeBlock:(dispatch_block_t)finalizeBlock;
+ (void)addEntityToSpotlightIndex:(id)entity;
+ (void)removeEntityByIdentifierFromSpotlightIndex:(NSString *)identifier;
@end


static void
StubThumbnailAtURL(id imageDownloaderMock, NSURL *URL)
{
    NSCParameterAssert(URL);
    [[imageDownloaderMock stub] downloadImageWithURL:URL
                                             options:0
                                            progress:nil
                                           completed:[OCMArg checkWithBlock:^BOOL(SDWebImageCompletionWithFinishedBlock completionBlock) {
        completionBlock([UIImage imageNamed:@"AttentionIcon"], nil, 0, YES, nil);
        return YES;
                                           }]];
}


SpecBegin(ARUserActivity);

__block id model = nil;
__block NSURL *webpageURL = nil;
__block id imageDownloaderMock = nil;
__block CSSearchableItemAttributeSet *attributeSet = nil;
__block NSUserActivity *activity = nil;

beforeEach(^{
    imageDownloaderMock = [OCMockObject partialMockForObject:[SDWebImageManager sharedManager]];
});

afterEach(^{
    [imageDownloaderMock verify];
    [imageDownloaderMock stopMocking];
});

describe(@"With an Artwork", ^{
    beforeEach(^{
        model = [Artwork modelWithJSON:@{
            @"id": @"artwork_id",
            @"title": @"Artwork Title",
            @"artist":@{ @"id":@"artist_id", @"name":@"Artist Name" },
            @"medium":@"Artwork Medium",
            @"images":@[
                  @{@"id": @"image_2_id",
                    @"is_default": @YES,
                    @"image_url": @"https://localhost/image/:version.jpg",
                    @"image_versions": @[@"small", @"square", @"large"]}]
        }];
        webpageURL = [NSURL URLWithString:@"https://www.artsy.net/artwork/artwork_id"];
        StubThumbnailAtURL(imageDownloaderMock, [[model defaultImage] urlForThumbnailImage]);
    });

    describe(@"concerning Spotlight attributes set generation", ^{
        beforeEach(^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the artwork title", ^{
            expect(attributeSet.title).to.equal(@"Artwork Title");
        });

        xit(@"includes a thumbnail", ^{
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes a description without creation date", ^{
            expect(attributeSet.contentDescription).to.equal(@"Artist Name\nArtwork Medium");
        });

        it(@"includes a description with creation date", ^{
            [model setDate:@"2014"];
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"Artist Name, 2014\nArtwork Medium");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityForEntity:model];
        });

        it(@"includes the URL", ^{
            expect(activity.webpageURL).to.equal(webpageURL);
        });

        it(@"includes the artwork title", ^{
            expect(activity.title).to.equal(@"Artwork Title");
        });

        it(@"includes additional metadata", ^{
            expect(activity.userInfo).to.equal(@{@"id": @"artwork_id" });
        });

        it(@"is eligible for everything", ^{
            expect(activity.isEligibleForPublicIndexing).to.beTruthy();
            expect(activity.isEligibleForSearch).to.beTruthy();
            expect(activity.isEligibleForHandoff).to.beTruthy();
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:NO
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(activity.contentAttributeSet.description).to.equal(attributeSet.description);
        });
    });
});

describe(@"With an Artist", ^{
    beforeEach(^{
        model = [Artist modelWithJSON:@{
            @"id": @"some-artist",
            @"name": @"Artist Name",
            @"birthday": @"1908",
            @"years": @"1928-1987",
            @"published_artworks_count": @(396),
            @"forsale_artworks_count": @(285),
            @"artworks_count": @(919),
            @"image_urls": @{ @"square": @"https://localhost/image/square.jpg" }
        }];
        webpageURL = [NSURL URLWithString:@"https://www.artsy.net/artist/some-artist"];
        StubThumbnailAtURL(imageDownloaderMock, [model squareImageURL]);
    });

    describe(@"concerning Spotlight attributes set generation", ^{
        beforeEach(^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the artist name", ^{
            expect(attributeSet.title).to.equal(@"Artist Name");
        });

        xit(@"includes a thumbnail", ^{
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes a description without blurb", ^{
            expect(attributeSet.contentDescription).to.equal(@"1908");
        });

        it(@"includes a description with blurb, stripped of markdown", ^{
            [model setValue:@"An **artist** _blurb_." forKey:@"blurb"];
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"An artist blurb.");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityForEntity:model];
        });

        it(@"includes the URL", ^{
            expect(activity.webpageURL).to.equal(webpageURL);
        });

        it(@"includes the artist’s name", ^{
            expect(activity.title).to.equal(@"Artist Name");
        });

        it(@"includes additional metadata", ^{
            expect(activity.userInfo).to.equal(@{@"id": @"some-artist" });
        });

        it(@"is eligible for everything", ^{
            expect(activity.isEligibleForPublicIndexing).to.beTruthy();
            expect(activity.isEligibleForSearch).to.beTruthy();
            expect(activity.isEligibleForHandoff).to.beTruthy();
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:NO
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(activity.contentAttributeSet.description).to.equal(attributeSet.description);
        });
    });
});

describe(@"With a Gene", ^{
    beforeEach(^{
        model = [Gene modelWithJSON:@{
            @"id": @"painting",
            @"name": @"Painting",
            @"image_url": @"https://localhost/image/version.jpg"
        }];
        webpageURL = [NSURL URLWithString:@"https://www.artsy.net/gene/painting"];
        StubThumbnailAtURL(imageDownloaderMock, [model smallImageURL]);
    });

    describe(@"concerning Spotlight attributes set generation", ^{
        beforeEach(^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the gene name", ^{
            expect(attributeSet.title).to.equal(@"Painting");
        });

        xit(@"includes a thumbnail", ^{
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes a description without gene description", ^{
            expect(attributeSet.contentDescription).to.equal(@"Category on Artsy");
        });

        it(@"includes a description with gene description, stripped of markdown", ^{
            [model setValue:@"A **gene** _description_." forKey:@"geneDescription"];
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"A gene description.");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityForEntity:model];
        });

        it(@"includes the URL", ^{
            expect(activity.webpageURL).to.equal(webpageURL);
        });

        it(@"includes the gene’s name", ^{
            expect(activity.title).to.equal(@"Painting");
        });

        it(@"includes additional metadata", ^{
            expect(activity.userInfo).to.equal(@{@"id": @"painting" });
        });

        it(@"is eligible for everything", ^{
            expect(activity.isEligibleForPublicIndexing).to.beTruthy();
            expect(activity.isEligibleForSearch).to.beTruthy();
            expect(activity.isEligibleForHandoff).to.beTruthy();
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:NO
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(activity.contentAttributeSet.description).to.equal(attributeSet.description);
        });
    });
});

describe(@"With a Fair", ^{
    beforeEach(^{
        model = [Fair modelWithJSON:@{
            @"id" : @"a-fair-affair",
            @"name" : @"The Fair Affair",
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];
        webpageURL = [NSURL URLWithString:@"https://www.artsy.net/a-fair-affair"];
        [[imageDownloaderMock reject] downloadImageWithURL:OCMOCK_ANY
                                                   options:0
                                                  progress:OCMOCK_ANY
                                                 completed:OCMOCK_ANY];
    });

    describe(@"concerning Spotlight attributes set generation", ^{
        beforeEach(^{
            attributeSet = [ARSpotlight searchAttributesForEntity:[[ARFairSpotlightMetadataProvider alloc] initWithFair:model profile:nil]
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the fair name", ^{
            expect(attributeSet.title).to.equal(@"The Fair Affair");
        });

        it(@"includes the date range of when the fair is running", ^{
            expect(attributeSet.startDate).to.equal([model startDate]);
            expect(attributeSet.endDate).to.equal([model endDate]);
        });

        xit(@"does not include a thumbnail without a profile", ^{
            expect(attributeSet.thumbnailData).to.beNil();
        });

        xit(@"includes a thumbnail, if a profile is specified", ^{
            Profile *fairProfile = [Profile modelWithJSON:@{
                @"icon": @{
                    @"image_urls": @{
                       @"version": @"https://localhost/image/version.jpg"
                    }
                }
            }];

            // Because we reject from the beforeEach, this needs to be torn down and re-setup. Kinda ugly, but moving
            // this out into its own `describe` block feels less consisten with the rest of the tests.
            [imageDownloaderMock stopMocking];
            imageDownloaderMock = [OCMockObject partialMockForObject:[SDWebImageManager sharedManager]];
            StubThumbnailAtURL(imageDownloaderMock, [NSURL URLWithString:fairProfile.iconURL]);

            attributeSet = [ARSpotlight searchAttributesForEntity:[[ARFairSpotlightMetadataProvider alloc] initWithFair:model profile:fairProfile]
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes a description without fair location", ^{
            expect(attributeSet.contentDescription).to.equal(@"Art fair on Artsy");
        });

        it(@"includes a description with fair location", ^{
            [model setValue:@"NYC" forKey:@"city"];
            [model setValue:@"NY" forKey:@"state"];
            attributeSet = [ARSpotlight searchAttributesForEntity:[[ARFairSpotlightMetadataProvider alloc] initWithFair:model profile:nil]
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"NYC, NY");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityForEntity:[[ARFairSpotlightMetadataProvider alloc] initWithFair:model profile:nil]];
        });

        it(@"includes the URL", ^{
            expect(activity.webpageURL).to.equal(webpageURL);
        });

        it(@"includes the fair’s name", ^{
            expect(activity.title).to.equal(@"The Fair Affair");
        });

        it(@"includes additional metadata", ^{
            expect(activity.userInfo).to.equal(@{@"id": @"a-fair-affair" });
        });

        it(@"is eligible for everything", ^{
            expect(activity.isEligibleForPublicIndexing).to.beTruthy();
            expect(activity.isEligibleForSearch).to.beTruthy();
            expect(activity.isEligibleForHandoff).to.beTruthy();
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARSpotlight searchAttributesForEntity:[[ARFairSpotlightMetadataProvider alloc] initWithFair:model profile:nil]
                                                includeIdentifier:NO
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(activity.contentAttributeSet.description).to.equal(attributeSet.description);
        });
    });
});

describe(@"With a Gene", ^{
    beforeEach(^{
        model = [PartnerShow modelWithJSON:@{
            @"id": @"some-show",
            @"name": @"Some Show",
            @"partner": @{
                @"id": @"some-partner",
                @"name": @"Some Gallery",
                @"default_profile_id": @"some-gallery",
                @"default_profile_public": @YES
            },
            @"fair": @{
                @"name": @"The Armory Show",
                @"id": @"fair-id",
                @"start_at": @"1976-01-30T15:00:00+00:00",
                @"end_at": @"1976-02-02T15:00:00+00:00",
            },
            @"fair_location": @{
                @"display": @"Armory Presents, Booth 666",
                @"map_points": @[@{ @"x": @(0.15), @"y": @(0.75) }]
            },
            @"location": @{ @"city": @"NYC", @"state": @"NY", @"country": @"US" },
            @"start_at": @"1976-01-30T15:00:00+00:00",
            @"end_at": @"1976-02-02T15:00:00+00:00",
            @"image_url": @"https://localhost/image/:version.jpg",
            @"image_versions": @[@"small", @"square", @"large"],
        }];
        webpageURL = [NSURL URLWithString:@"https://www.artsy.net/show/some-show"];
        StubThumbnailAtURL(imageDownloaderMock, [model smallPreviewImageURL]);
    });

    describe(@"concerning Spotlight attributes set generation", ^{
        beforeEach(^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the show’s name", ^{
            expect(attributeSet.title).to.equal(@"Some Show");
        });

        xit(@"includes a thumbnail", ^{
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes the date range of when the show is running", ^{
            expect(attributeSet.startDate).to.equal([model startDate]);
            expect(attributeSet.endDate).to.equal([model endDate]);
        });

        it(@"includes a description with the show’s location", ^{
            expect(attributeSet.contentDescription).to.equal(@"Some Gallery\nNYC, NY US\nJan 30th - Feb 2nd, 1976");
        });

        it(@"includes a description with the fair’s location", ^{
            Fair *fair = [model fair];
            [fair setValue:@"SF" forKey:@"city"];
            [fair setValue:@"CA" forKey:@"state"];
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"Some Gallery\nSF, CA\nJan 30th - Feb 2nd, 1976");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityForEntity:model];
        });

        it(@"includes the URL", ^{
            expect(activity.webpageURL).to.equal(webpageURL);
        });

        it(@"includes the show’s name", ^{
            expect(activity.title).to.equal(@"Some Show");
        });

        it(@"includes additional metadata", ^{
            expect(activity.userInfo).to.equal(@{@"id": @"some-show" });
        });

        it(@"is eligible for everything", ^{
            expect(activity.isEligibleForPublicIndexing).to.beTruthy();
            expect(activity.isEligibleForSearch).to.beTruthy();
            expect(activity.isEligibleForHandoff).to.beTruthy();
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:NO
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(activity.contentAttributeSet.description).to.equal(attributeSet.description);
        });
    });
});

describe(@"With a Sale", ^{
    beforeEach(^{
        model = [Sale modelWithJSON:@{
            @"id": @"some-auction",
            @"name": @"That Auction",
            @"description" : @"Info about the auction",
            @"start_at": @"1976-01-30T15:00:00+00:00",
            @"end_at": @"1976-02-02T15:00:00+00:00",
            @"image_url": @"https://localhost/image/:version.jpg",
            @"image_versions": @[@"small", @"square", @"large"],
            @"profile": @{
                @"id" : @"sale-profile",
                @"icon" : @{
                    @"image_urls" : @{ @"square" : @"http://localhost/thumbnail.jpg" }
                }
            }
        }];
        webpageURL = [NSURL URLWithString:@"https://www.artsy.net/auction/some-auction"];
        StubThumbnailAtURL(imageDownloaderMock, [model spotlightThumbnailURL]);
    });

    describe(@"concerning Spotlight attributes set generation", ^{
        beforeEach(^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the show’s name", ^{
            expect(attributeSet.title).to.equal(@"That Auction");
        });

        xit(@"includes a thumbnail", ^{
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes the date range of when the show is running", ^{
            expect(attributeSet.startDate).to.equal([model startDate]);
            expect(attributeSet.endDate).to.equal([model endDate]);
        });

        it(@"includes a description with the show’s location", ^{
            expect(attributeSet.contentDescription).to.equal(@"That Auction\nInfo about the auction\n");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityForEntity:model];
        });

        it(@"includes the URL", ^{
            expect(activity.webpageURL).to.equal(webpageURL);
        });

        it(@"includes the show’s name", ^{
            expect(activity.title).to.equal(@"That Auction");
        });
        
        it(@"includes additional metadata", ^{
            expect(activity.userInfo).to.equal(@{@"id": @"some-auction" });
        });
        
        it(@"is eligible for everything", ^{
            expect(activity.isEligibleForPublicIndexing).to.beTruthy();
            expect(activity.isEligibleForSearch).to.beTruthy();
            expect(activity.isEligibleForHandoff).to.beTruthy();
        });
        
        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:NO
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(activity.contentAttributeSet.description).to.equal(attributeSet.description);
        });
    });
});


describe(@"Indexing favourites", ^{
    __block id spotlightClassMock = nil;

    beforeEach(^{
        spotlightClassMock = [OCMockObject mockForClass:ARSpotlight.class];
    });

    afterEach(^{
        [spotlightClassMock stopMocking];
    });

    xdescribe(@"concerning Spotlight interfacing", ^{
        __block id searchableIndexMock = nil;

        beforeEach(^{
            searchableIndexMock = [OCMockObject mockForClass:CSSearchableIndex.class];
            [[[spotlightClassMock stub] andReturn:searchableIndexMock] searchableIndex];

            model = [Gene modelWithJSON:@{
                @"id": @"painting",
                @"name": @"Painting",
                @"image_url": @"https://localhost/image/version.jpg"
            }];
            webpageURL = [NSURL URLWithString:@"https://www.artsy.net/gene/painting"];
            StubThumbnailAtURL(imageDownloaderMock, [model smallImageURL]);
        });

        afterEach(^{
            [searchableIndexMock verifyWithDelay:5];
            [searchableIndexMock stopMocking];
        });

        it(@"adds a favorite to the index", ^{
            attributeSet = [ARSpotlight searchAttributesForEntity:model
                                                includeIdentifier:YES
                                                       completion:^(CSSearchableItemAttributeSet *_) {}];

            [[searchableIndexMock expect] indexSearchableItems:[OCMArg checkWithBlock:^BOOL(NSArray *items) {
                CSSearchableItem *item = items[0];
                // The actual attribute set has some hidden keys based on the information assigned to the CSSearchableItem,
                // these are located at the start so instead we check if the expected string comes after the hidden ones.
                NSString *expectedDescription = [attributeSet.description substringFromIndex:1];
                return items.count == 1
                        && [item.uniqueIdentifier isEqualToString:webpageURL.absoluteString]
                            && [item.domainIdentifier isEqualToString:ARUserActivityTypeGene]
                                && [item.attributeSet.description rangeOfString:expectedDescription].location != NSNotFound;
            }]
                                          completionHandler:OCMOCK_ANY];

            [ARSpotlight addToSpotlightIndex:YES entity:model];
        });

        it(@"removes a favorite from the index", ^{
            [[searchableIndexMock expect] deleteSearchableItemsWithIdentifiers:@[webpageURL.absoluteString]
                                                             completionHandler:OCMOCK_ANY];

            [ARSpotlight addToSpotlightIndex:NO entity:model];
        });
    });

    describe(@"from the backend API", ^{
        __block NSMutableArray *networkModels = nil;

        beforeEach(^{
            networkModels = [NSMutableArray new];
            [networkModels addObject:[[ARStubbedFavoritesNetworkModel alloc] initWithFavoritesStack:@[
                @[[Artwork modelWithJSON:@{ @"id": @"artwork-1-1" }], [Artwork modelWithJSON:@{ @"id": @"artwork-1-2" }]],
                @[[Artwork modelWithJSON:@{ @"id": @"artwork-2-1" }], [Artwork modelWithJSON:@{ @"id": @"artwork-2-2" }]],
                @[[Artwork modelWithJSON:@{ @"id": @"artwork-3-1" }], [Artwork modelWithJSON:@{ @"id": @"artwork-3-2" }]],
            ]]];
            [networkModels addObject:[[ARStubbedFavoritesNetworkModel alloc] initWithFavoritesStack:@[
                @[[Artist modelWithJSON:@{ @"id": @"artist-1-1" }], [Artist modelWithJSON:@{ @"id": @"artist-1-2" }]],
                @[[Artist modelWithJSON:@{ @"id": @"artist-2-1" }], [Artist modelWithJSON:@{ @"id": @"artist-2-2" }]],
                @[[Artist modelWithJSON:@{ @"id": @"artist-3-1" }], [Artist modelWithJSON:@{ @"id": @"artist-3-2" }]],
            ]]];
            [networkModels addObject:[[ARStubbedFavoritesNetworkModel alloc] initWithFavoritesStack:@[
                @[[Gene modelWithJSON:@{ @"id": @"gene-1-1" }], [Gene modelWithJSON:@{ @"id": @"gene-1-2" }]],
                @[[Gene modelWithJSON:@{ @"id": @"gene-2-1" }], [Gene modelWithJSON:@{ @"id": @"gene-2-2" }]],
                @[[Gene modelWithJSON:@{ @"id": @"gene-3-1" }], [Gene modelWithJSON:@{ @"id": @"gene-3-2" }]],
            ]]];
        });

        afterEach(^{
            [spotlightClassMock verifyWithDelay:5];
        });

        xit(@"kicks-off the indexer", ^{
            id previouslyIndexedMock = [OCMockObject mockForClass:NSMutableSet.class];
            [[[spotlightClassMock stub] andReturn:previouslyIndexedMock] indexedEntities];
            [[[previouslyIndexedMock stub] andReturn:previouslyIndexedMock] mutableCopy];

            [[spotlightClassMock expect] indexFavoritesPass:[OCMArg checkWithBlock:^BOOL(NSArray *networkModels) {
                return [networkModels[0] isKindOfClass:ARArtworkFavoritesNetworkModel.class]
                        && [networkModels[1] isKindOfClass:ARArtistFavoritesNetworkModel.class]
                            && [networkModels[2] isKindOfClass:ARGeneFavoritesNetworkModel.class];
            }]
                                             previouslyIndexed:previouslyIndexedMock
                                                 finalizeBlock:OCMOCK_ANY];

            [ARSpotlight indexAllUsersFavorites];
        });

        it(@"indexes all of the user’s favorites", ^{
            for (ARStubbedFavoritesNetworkModel *networkModel in networkModels) {
                for (NSArray *page in networkModel.favoritesStack) {
                    for (id entity in page) {
                        [[spotlightClassMock expect] addEntityToSpotlightIndex:entity];
                    }
                }
            }

            [ARSpotlight indexFavoritesPass:networkModels previouslyIndexed:nil finalizeBlock:^{}];
        });

        it(@"removes favorites from the index that are no longer present in the remote list of favorites", ^{
            NSMutableSet *previouslyIndexed = [NSMutableSet setWithArray:@[
                @"https://www.artsy.net/artwork/remove-artwork",
                @"https://www.artsy.net/artist/remove-artist",
                @"https://www.artsy.net/gene/remove-gene",
            ]];
            for (NSString *identifier in previouslyIndexed.allObjects) {
                [[spotlightClassMock expect] removeEntityByIdentifierFromSpotlightIndex:identifier];
            }

            [ARSpotlight indexFavoritesPass:networkModels previouslyIndexed:previouslyIndexed finalizeBlock:^{}];
        });
    });
});

SpecEnd;
