#import "ARUserActivity.h"
#import "ARRouter.h"
#import "Artwork.h"

@import CoreSpotlight;
@import SDWebImage;

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
            attributeSet = [ARUserActivity searchAttributesWithArtwork:model
                                                     includeIdentifier:YES
                                                            completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the artwork title", ^{
            expect(attributeSet.title).to.equal(@"Artwork Title");
        });

        it(@"includes a thumbnail", ^{
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes a description without creation date", ^{
            expect(attributeSet.contentDescription).to.equal(@"Artist Name\nArtwork Medium");
        });

        it(@"includes a description with creation date", ^{
            [model setDate:@"2014"];
            attributeSet = [ARUserActivity searchAttributesWithArtwork:model
                                                     includeIdentifier:YES
                                                            completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"Artist Name, 2014\nArtwork Medium");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityWithArtwork:model becomeCurrent:NO];
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
            expect(activity.isEligibleForPublicIndexing).to.beTruthy;
            expect(activity.isEligibleForSearch).to.beTruthy;
            expect(activity.isEligibleForHandoff).to.beTruthy;
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARUserActivity searchAttributesWithArtwork:model
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
            attributeSet = [ARUserActivity searchAttributesWithArtist:model
                                                    includeIdentifier:YES
                                                           completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the artist name", ^{
            expect(attributeSet.title).to.equal(@"Artist Name");
        });

        it(@"includes a thumbnail", ^{
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes a description without blurb", ^{
            expect(attributeSet.contentDescription).to.equal(@"1908");
        });

        it(@"includes a description with blurb, stripped of markdown", ^{
            [model setValue:@"An **artist** _blurb_." forKey:@"blurb"];
            attributeSet = [ARUserActivity searchAttributesWithArtist:model
                                                    includeIdentifier:YES
                                                           completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"An artist blurb.");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityWithArtist:model becomeCurrent:NO];
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
            expect(activity.isEligibleForPublicIndexing).to.beTruthy;
            expect(activity.isEligibleForSearch).to.beTruthy;
            expect(activity.isEligibleForHandoff).to.beTruthy;
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARUserActivity searchAttributesWithArtist:model
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
            attributeSet = [ARUserActivity searchAttributesWithGene:model
                                                  includeIdentifier:YES
                                                         completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the gene name", ^{
            expect(attributeSet.title).to.equal(@"Painting");
        });

        it(@"includes a thumbnail", ^{
            expect(attributeSet.thumbnailData).to.equal(UIImagePNGRepresentation([UIImage imageNamed:@"AttentionIcon"]));
        });

        it(@"includes a description without gene description", ^{
            expect(attributeSet.contentDescription).to.equal(@"Category on Artsy");
        });

        it(@"includes a description with gene description, stripped of markdown", ^{
            [model setValue:@"A **gene** _description_." forKey:@"geneDescription"];
            attributeSet = [ARUserActivity searchAttributesWithGene:model
                                                  includeIdentifier:YES
                                                         completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"A gene description.");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityWithGene:model becomeCurrent:NO];
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
            expect(activity.isEligibleForPublicIndexing).to.beTruthy;
            expect(activity.isEligibleForSearch).to.beTruthy;
            expect(activity.isEligibleForHandoff).to.beTruthy;
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARUserActivity searchAttributesWithGene:model
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
                                                   options:OCMOCK_ANY
                                                  progress:OCMOCK_ANY
                                                 completed:OCMOCK_ANY];
    });

    describe(@"concerning Spotlight attributes set generation", ^{
        beforeEach(^{
            attributeSet = [ARUserActivity searchAttributesWithFair:model
                                                        withProfile:nil
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

        it(@"does not include a thumbnail without a profile", ^{
            expect(attributeSet.thumbnailData).to.beNil;
        });

        it(@"includes a thumbnail, if a profile is specified", ^{
            Profile *fairProfile = [Profile modelWithJSON:@{
                @"icon": @{
                    @"image_urls": @{
                       @"version": @"https://localhost/image/version.jpg"
                    }
                }
            }];
            StubThumbnailAtURL(imageDownloaderMock, [NSURL URLWithString:fairProfile.iconURL]);

            attributeSet = [ARUserActivity searchAttributesWithFair:model
                                                        withProfile:fairProfile
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
            attributeSet = [ARUserActivity searchAttributesWithFair:model
                                                        withProfile:nil
                                                  includeIdentifier:YES
                                                         completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"NYC, NY");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityWithFair:model withProfile:nil becomeCurrent:NO];
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
            expect(activity.isEligibleForPublicIndexing).to.beTruthy;
            expect(activity.isEligibleForSearch).to.beTruthy;
            expect(activity.isEligibleForHandoff).to.beTruthy;
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARUserActivity searchAttributesWithFair:model
                                                        withProfile:nil
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
            attributeSet = [ARUserActivity searchAttributesWithShow:model
                                                             inFair:nil
                                                  includeIdentifier:YES
                                                         completion:^(CSSearchableItemAttributeSet *_) {}];
        });

        it(@"includes the URL as the identifier", ^{
            expect(attributeSet.relatedUniqueIdentifier).to.equal(webpageURL.absoluteString);
        });

        it(@"includes the show’s name", ^{
            expect(attributeSet.title).to.equal(@"Some Show");
        });

        it(@"includes a thumbnail", ^{
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
            attributeSet = [ARUserActivity searchAttributesWithShow:model
                                                             inFair:fair
                                                  includeIdentifier:YES
                                                         completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(attributeSet.contentDescription).to.equal(@"Some Gallery\nSF, CA\nJan 30th - Feb 2nd, 1976");
        });
    });

    describe(@"concerning NSUserActivity generation", ^{
        beforeEach(^{
            activity = [ARUserActivity activityWithShow:model inFair:nil becomeCurrent:NO];
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
            expect(activity.isEligibleForPublicIndexing).to.beTruthy;
            expect(activity.isEligibleForSearch).to.beTruthy;
            expect(activity.isEligibleForHandoff).to.beTruthy;
        });

        it(@"includes the Spotlight attributes set, minus the identifier", ^{
            attributeSet = [ARUserActivity searchAttributesWithShow:model
                                                             inFair:nil
                                                  includeIdentifier:NO
                                                         completion:^(CSSearchableItemAttributeSet *_) {}];
            expect(activity.contentAttributeSet.description).to.equal(attributeSet.description);
        });
    });
});

SpecEnd;
