#import "ARInternalShareValidator.h"

SpecBegin(ARInternalShareValidator);

__block ARInternalShareValidator *sut;
__block NSURL *facebookURL, *twitterURL, *linkedInURL;

before(^{
    sut = [[ARInternalShareValidator alloc] init];
    facebookURL = [NSURL URLWithString:@"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.artsy.net%2Farticle%2Fnicholas-o-brien-are-algorithms-conceptual-art-s-next-frontier"];

    twitterURL = [NSURL URLWithString:@"https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fwww.artsy.net%2Fmagazine&text=Why%20Brilliant%20African-American%20Painter%20Alma%20Thomas%20Wasn%E2%80%99t%20Discovered%20Until%20Age%2075%20@Artsy&url=https://www.artsy.net/article/editorial-why-brilliant-african-american-painter-alma-thomas-wasnt"];

    linkedInURL =  [NSURL URLWithString:@"https://linkedin/share/share?url=https%3A%2F%2Fwww.artsy.net%2Farticle%2Fnicholas-o-brien-are-algorithms-conceptual-art-s-next-frontier&via=artsy"];
});

describe(@"correctly handles social URLs", ^{

    it(@"facebook", ^{
        expect([sut isSocialSharingURL:facebookURL]).to.beTruthy();
        expect([sut isFacebookShareURL:facebookURL]).to.beTruthy();

        expect([sut isTwitterShareURL:facebookURL]).to.beFalsy();
    });

    it(@"twitter", ^{
        expect([sut isSocialSharingURL:twitterURL]).to.beTruthy();
        expect([sut isTwitterShareURL:twitterURL]).to.beTruthy();

        expect([sut isFacebookShareURL:twitterURL]).to.beFalsy();
    });

    it(@"linkedin", ^{
        expect([sut isSocialSharingURL:linkedInURL]).to.beFalsy();
        expect([sut isFacebookShareURL:linkedInURL]).to.beFalsy();

        expect([sut isTwitterShareURL:linkedInURL]).to.beFalsy();
    });
});

describe(@"correctly pulls out the name", ^{

    it(@"twitter", ^{
        expect([sut nameBeingSharedInURL:twitterURL]).to.equal(@"Why Brilliant African-American Painter Alma Thomas Wasn’t Discovered Until Age 75 @Artsy");
    });

    it(@"facebook", ^{
        expect([sut nameBeingSharedInURL:facebookURL]).to.beFalsy();
    });

    it(@"linkedin", ^{
        expect([sut nameBeingSharedInURL:linkedInURL]).to.beFalsy();
    });

});

describe(@"correctly pulls out the address", ^{

    it(@"twitter", ^{
        expect([sut addressBeingSharedFromShareURL:twitterURL]).to.equal(@"https://www.artsy.net/article/editorial-why-brilliant-african-american-painter-alma-thomas-wasnt");
    });

    it(@"facebook", ^{
        expect([sut addressBeingSharedFromShareURL:facebookURL]).to.equal(@"https://www.artsy.net/article/nicholas-o-brien-are-algorithms-conceptual-art-s-next-frontier");
    });

    it(@"linkedin", ^{
        expect([sut addressBeingSharedFromShareURL:linkedInURL]).to.beFalsy();
    });
});

SpecEnd;
