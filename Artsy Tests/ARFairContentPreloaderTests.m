#import "ARFairContentPreloader.h"

SpecBegin(ARFairContentPreloader)

it(@"uses a default service name", ^{
    expect([ARFairContentPreloader contentPreloader].serviceName).to.equal(@"Artsy-FairEnough-Server");
});

describe(@"with a published Bonjour service", ^{
    __block ARFairContentPreloader *preloader = nil;

    beforeEach(^{
        preloader = [[ARFairContentPreloader alloc] initWithServiceName:@"Test-FairEnough-Server"];
    });

    it(@"reports that it's at a fair", ^{
        // pending
    });

    it(@"reports at which fair it is", ^{
        // pending
    });

    // These are probably more for e.g. the application delegate

    it(@"asks the user if they wish to immediately jump to the fair content", ^{
        // pending
    });

    it(@"starts preloading the fair content if the device has enough free space", ^{
        // pending
    });
});

describe(@"before downloading", ^{
    it(@"checks to see if the cache has already been preloaded", ^{
        // pending
    });

    it(@"checks if the device has enough free space for the package to be downloaded and unpacked", ^{
        // pending
    });
});

describe(@"after downloading", ^{
    describe(@"the normal cache locations are filled, as if the device had lazily cached the content, as it", ^{
        it(@"unpacks images", ^{
            // pending
        });

        it(@"unpacks metadata/text copy", ^{
            // pending
        });
    });
});

SpecEnd
