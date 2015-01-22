#import "ARFairMapAnnotationCallOutView.h"
#import <NAMapKit/NAMapView.h>

SpecBegin(ARFairMapAnnotationCallOutView)

__block ARFairMapAnnotationCallOutView *view;

beforeEach(^{
    NAMapView *mapView = [[NAMapView alloc] initWithFrame:CGRectMake(0, 0, 320, 280)];
    mapView.zoomStep = 2.5;
    mapView.showsVerticalScrollIndicator = NO;
    mapView.showsHorizontalScrollIndicator = NO;
    Fair *fair = [Fair modelWithJSON:@{
        @"id" : @"fair-id",
        @"name" : @"The Armory Show",
        @"organizer" : @{ @"profile_id" : @"fair-profile-id" }
    }];
    view = [[ARFairMapAnnotationCallOutView alloc] initOnMapView:mapView fair:fair];
});

it(@"blank", ^{
    expect(view).to.haveValidSnapshotNamed(@"blank");
});

it(@"title", ^{
    PartnerShow *partnerShow = [PartnerShow modelWithJSON:@{
        @"id" : @"show-id",
        @"partner" : @{ @"id" : @"leila-heller", @"name" : @"Leila Heller" }
    }];
    ARFairMapAnnotation *annotation = [[ARFairMapAnnotation alloc] initWithPoint:CGPointZero representedObject:partnerShow];
    [view setAnnotation:annotation];
    expect(view).to.haveValidSnapshotNamed(@"title");
});

it(@"titleWithSubtitle", ^{
    PartnerShow *partnerShow = [PartnerShow modelWithJSON:@{
        @"id" : @"show-id",
        @"fair_location" : @{ @"display" : @"Pier 1, Booth 2, Section 3, Floor 5" },
        @"partner" : @{ @"id" : @"leila-heller", @"name" : @"Leila Heller Gallery in New York City" }
    }];
    ARFairMapAnnotation *annotation = [[ARFairMapAnnotation alloc] initWithPoint:CGPointZero representedObject:partnerShow];
    [view setAnnotation:annotation];
    expect(view).to.haveValidSnapshotNamed(@"titleWithSubtitle");
});

it(@"titleWithArrow", ^{
    MapFeature *mapFeature = [MapFeature modelWithJSON:@{
        @"id" : @"feature-id",
        @"href" : @"http://example.com",
        @"name" : @"Feature",
    }];
    ARFairMapAnnotation *annotation = [[ARFairMapAnnotation alloc] initWithPoint:CGPointZero representedObject:mapFeature];
    [view setAnnotation:annotation];
    expect(view).to.haveValidSnapshotNamed(@"titleWithArrow");
});

it(@"long title with arrow", ^{
    MapFeature *mapFeature = [MapFeature modelWithJSON:@{
        @"id" : @"feature-id",
        @"href" : @"http://example.com",
        @"name" : @"A Red Brown Fox Jumped Over the Fence",
    }];
    ARFairMapAnnotation *annotation = [[ARFairMapAnnotation alloc] initWithPoint:CGPointZero representedObject:mapFeature];
    [view setAnnotation:annotation];
    expect(view).to.haveValidSnapshotNamed(@"longTitleWithArrow");
});

SpecEnd
