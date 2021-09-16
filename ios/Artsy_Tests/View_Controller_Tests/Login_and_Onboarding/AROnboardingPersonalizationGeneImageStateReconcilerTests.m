#import "AROnboardingPersonalizationGeneImageStateReconciler.h"

SpecBegin(AROnboardingPersonalizationGeneImageStateReconciler);

__block AROnboardingPersonalizationGeneImageStateReconciler *subject;
NSIndexPath *indexPath = [NSIndexPath indexPathForRow:0 inSection:0];
Gene *gene = [Gene modelWithJSON:@{
    @"id" : @"some_gene",
    @"image_url" : @"http://example.com/:version.jpg",
}];

beforeEach(^{
    subject = [AROnboardingPersonalizationGeneImageStateReconciler new];
});

it(@"normally returns the onboarding URL", ^{
    expect([subject imageURLForGene:gene atIndexPath:indexPath]).to.equal([NSURL URLWithString:@"https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=150&height=150&quality=85&src=http://example.com/:version.jpg"]);
});

describe(@"added index path", ^{
    beforeEach(^{
        [subject addReplacedGene:indexPath];
    });

    it(@"returns the small URL", ^{
        expect([subject imageURLForGene:gene atIndexPath:indexPath]).to.equal([NSURL URLWithString:@"http://example.com/thumb.jpg"]);
    });

    describe(@"after being reset", ^{
        beforeEach(^{
            [subject reset];
        });

        it(@"returns the onboarding URL", ^{
            expect([subject imageURLForGene:gene atIndexPath:indexPath]).to.equal([NSURL URLWithString:@"https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=150&height=150&quality=85&src=http://example.com/:version.jpg"]);
        });
    });
});

SpecEnd
