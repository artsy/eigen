#import "ARFairContentPreloader.h"


@interface ARFairContentPreloaderTestServiceDelegate : NSObject <NSNetServiceDelegate>
@property (nonatomic, assign) BOOL hasResponse;
@property (nonatomic, assign) BOOL isPublished;
@end

@implementation ARFairContentPreloaderTestServiceDelegate

- (void)netService:(NSNetService *)sender didNotPublish:(NSDictionary *)error;
{
  NSLog(@"[!] Failed to publish bonjour service for ARFairContentPreloader tests: %@", error);
  self.hasResponse = YES;
  self.isPublished = NO;
}

- (void)netServiceDidPublish:(NSNetService *)sender;
{
  self.hasResponse = YES;
  self.isPublished = YES;
}

@end


SpecBegin(ARFairContentPreloader)

it(@"uses a default service name", ^{
    expect([ARFairContentPreloader contentPreloader].serviceName).to.equal(@"Artsy-FairEnough-Server");
});

describe(@"with a published Bonjour service", ^{
    __block NSNetService *service = nil;

    beforeAll(^{
      service = [[NSNetService alloc] initWithDomain:@"" type:@"_http._tcp" name:@"Test-FairEnough-Server" port:3456];

      ARFairContentPreloaderTestServiceDelegate *delegate = [ARFairContentPreloaderTestServiceDelegate new];
      service.delegate = delegate;

      [service publish];
      while (!delegate.hasResponse) {
        CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, true);
      }

      if (!delegate.isPublished) {
        [service stop];
        service = nil;
        // TODO how can we best fail all the test cases in this group?
      } else {
        NSLog(@"SERVICE STARTED!");
      }
    });

    afterAll(^{
      // TODO leads to a segfault... :?
      // [service stop];
      service = nil;
    });

    __block ARFairContentPreloader *preloader = nil;

    beforeEach(^{
        preloader = [[ARFairContentPreloader alloc] initWithServiceName:service.name];
        [preloader discoverFairService];
        while (preloader.isResolvingService) {
          CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, true);
        }
        if (!preloader.hasResolvedService) {
          preloader = nil;
          // TODO how can we best fail all the test cases in this group?
        } else {
          NSLog(@"PRELOADER FOUND SERVICE!");
        }
    });

    it(@"fetches the manifest and yields once completed", ^{
        //[preloader fetchManifest:^{
        //}];
    });

    it(@"reports that it's at a fair", ^{
        // pending
    });

    it(@"reports at which fair it is", ^{
        // pending
    });

    it(@"is able to download a package", ^{
        // pending
    });

    it(@"is able to resume a download", ^{
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

    it(@"checks if a package has been partially downloaded and needs resuming", ^{
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
