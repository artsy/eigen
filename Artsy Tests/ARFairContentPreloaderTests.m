#import "ARFairContentPreloader.h"
#import <OHHTTPStubs/OHHTTPStubsResponse+JSON.h>
#import <OCMock/OCMock.h>


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


@interface ARFairContentPreloader (Testing)
@property (nonatomic, readonly) NSURL *manifestURL;
@property (nonatomic, readonly) NSURL *packageURL;
@property (nonatomic, readonly) NSURL *temporaryLocalPackageURL;
@property (nonatomic, readonly) NSURL *partiallyDownloadedPackageURL;
@property (nonatomic, readonly) NSUInteger packageSize;
@property (nonatomic, readonly) NSUInteger unpackedSize;
@property (nonatomic, readonly) NSUInteger requiredDiskSpace;
@property (nonatomic, readonly) BOOL hasEnoughFreeDiskSpace;
@end


// TODO make a global test helper?
static NSString *
ARTestFixture(NSString *pathname) {
  NSBundle *testBundle = [NSBundle bundleForClass:[ARFairContentPreloaderTestServiceDelegate class]];
  return [testBundle.resourcePath stringByAppendingPathComponent:pathname];
}


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

        }
    });

    describe(@"concerning fetch failures", ^{
        it(@"reports a request error", ^{
            [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                return [request.URL isEqual:preloader.manifestURL];
            } withStubResponse:^OHHTTPStubsResponse*(NSURLRequest *request) {
                return [OHHTTPStubsResponse responseWithJSONObject:@{}
                                                        statusCode:500
                                                           headers:@{ @"Content-Type":@"application/json" }];
            }];
            __block NSError *error = nil;
            [preloader fetchManifest:^(NSError *e) { error = e; }];
            while (error == nil) {
                CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, true);
            }
        });

        it(@"reports a JSON error", ^{
            [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                return [request.URL isEqual:preloader.manifestURL];
            } withStubResponse:^OHHTTPStubsResponse*(NSURLRequest *request) {
                return [OHHTTPStubsResponse responseWithData:[NSData data]
                                                  statusCode:200
                                                     headers:@{ @"Content-Type":@"application/json" }];
            }];
            __block NSError *error = nil;
            __block BOOL fetched = NO;
            [preloader fetchManifest:^(NSError *e) { error = e; fetched = YES; }];
            while (!fetched) {
                CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, true);
            }
            expect(error).notTo.equal(nil);
        });
    });

    describe(@"after fetching the manifest", ^{
        beforeEach(^{
            [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                return [request.URL isEqual:preloader.manifestURL];
            } withStubResponse:^OHHTTPStubsResponse*(NSURLRequest *request) {
                return [OHHTTPStubsResponse responseWithJSONObject:@{ @"fair":@"Armory 2015",
                                                                      @"package-size":@(42),
                                                                      @"unpacked-size":@(84) }
                                                        statusCode:200
                                                           headers:@{ @"Content-Type":@"application/json" }];
            }];

            __block BOOL fetched = NO;
            [preloader fetchManifest:^(id _) { fetched = YES; }];
            while (!fetched) {
                CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, true);
            }
        });

        it(@"reports that it's at a fair", ^{
            // pending
            // TODO it should just report this because it can't find the bonjour service?
        });

        // TODO should this maybe be a fair model ID?
        it(@"reports at which fair it is", ^{
            expect(preloader.fairName).to.equal(@"Armory 2015");
        });

        it(@"reports the amount of required disk space in bytes", ^{
            expect(preloader.packageSize).to.equal(42);
            expect(preloader.unpackedSize).to.equal(84);
            expect(preloader.requiredDiskSpace).to.equal(42+84);
        });

        describe(@"when checking for free space", ^{
            __block id fileManagerMock = nil;

            beforeEach(^{
                fileManagerMock = [OCMockObject mockForClass:[NSFileManager class]];
                [[[fileManagerMock stub] andReturn:fileManagerMock] defaultManager];
            });

            afterEach(^{
                // TODO Specta issue? https://github.com/erikdoe/ocmock/issues/136
                [fileManagerMock stopMocking];
            });

            it(@"reports that enough space is left", ^{
                [[[fileManagerMock stub] andReturn:@{ NSFileSystemFreeSize:@(preloader.requiredDiskSpace) }]
                     attributesOfFileSystemForPath:NSHomeDirectory()
                                             error:(NSError __autoreleasing **)[OCMArg anyPointer]];
                expect(preloader.hasEnoughFreeDiskSpace).to.equal(YES);
            });

            it(@"reports that not enough free space is left", ^{
                [[[fileManagerMock stub] andReturn:@{ NSFileSystemFreeSize:@(preloader.requiredDiskSpace-1) }]
                     attributesOfFileSystemForPath:NSHomeDirectory()
                                             error:(NSError __autoreleasing **)[OCMArg anyPointer]];
                expect(preloader.hasEnoughFreeDiskSpace).to.equal(NO);
            });
        });

        describe(@"concerning downloading", ^{
            NSString *packageName = @"fair-content-preloader-package.zip";

            afterEach(^{
              [[NSFileManager defaultManager] removeItemAtURL:preloader.temporaryLocalPackageURL error:nil];
              [[NSFileManager defaultManager] removeItemAtURL:preloader.partiallyDownloadedPackageURL error:nil];
            });

            it(@"is able to download a package", ^{
                [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                    return [request.URL isEqual:preloader.packageURL];
                } withStubResponse:^OHHTTPStubsResponse*(NSURLRequest *request) {
                    return [OHHTTPStubsResponse responseWithFileAtPath:ARTestFixture(packageName)
                                                            statusCode:200
                                                               headers:@{ @"Content-Type":@"application/zip" }];
                }];

                __block BOOL yielded = NO;
                [preloader fetchPackage:^(id _) { yielded = YES; }];
                while (!yielded) {
                    CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.25, true);
                }

                NSString *path = preloader.temporaryLocalPackageURL.path;
                expect([[NSFileManager defaultManager] fileExistsAtPath:path]).to.equal(YES);
            });

            it(@"saves resume data to disk if a transfer fails", ^{
                id URLSessionMock = [OCMockObject mockForClass:[NSURLSession class]];
                [[[URLSessionMock stub] andReturn:URLSessionMock] sharedSession];

                // Create NSError with stubbed first 100 bytes of package data.
                NSData *resumeData = [NSData dataWithContentsOfFile:ARTestFixture(packageName)];
                resumeData = [resumeData subdataWithRange:NSMakeRange(0, 100)];
                NSError *errorWithResumeData = [NSError errorWithDomain:NSURLErrorDomain
                                                                   code:NSURLErrorTimedOut
                                                               userInfo:@{ NSURLSessionDownloadTaskResumeData:resumeData }];

                // Get block defined in fetchPackage: and yield the stubbed error to it.
                [[[[URLSessionMock stub] andReturn:nil] andDo:^(NSInvocation *invocation) {
                  void (^completionBlock)(NSURL *, NSURLResponse *, NSError *);
                  [invocation getArgument:&completionBlock atIndex:3];
                  completionBlock(nil, nil, errorWithResumeData);
                }] downloadTaskWithURL:OCMOCK_ANY completionHandler:OCMOCK_ANY];

                __block NSError *error = nil;
                [preloader fetchPackage:^(NSError *e) { error = e; }];
                // No need to run the runloop, as our stubbing above immediately yields the block.
                expect(error).to.equal(errorWithResumeData);
                expect([NSData dataWithContentsOfURL:preloader.partiallyDownloadedPackageURL]).to.equal(resumeData);

                [URLSessionMock stopMocking];
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
