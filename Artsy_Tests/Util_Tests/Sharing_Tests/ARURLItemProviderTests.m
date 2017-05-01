#import "ARURLItemProvider.h"
#import "ARNetworkConstants.h"
#import "ARRouter.h"

SpecBegin(ARURLItemProvider);

afterEach(^{
    [OHHTTPStubs removeAllStubs];
});

describe(@"url and image thumbnail", ^{
    __block NSString *path = @"/artist/xyz";
    __block ARURLItemProvider *provider;
    __block UIImage *image;
    __block NSURL *expectedURL;
    before(^{
        image = [UIImage imageNamed:@"stub.jpg"];
        NSURL *pathUrl = [NSURL URLWithString:path relativeToURL:[ARRouter baseWebURL]];
        expectedURL = [NSURL URLWithString:[pathUrl absoluteString]];
    });

    describe(@"with valid imageURL", ^{
        __block NSURL *imageURL = [NSURL URLWithString:@"http://image.com/image.jpg"];
        
        beforeEach(^{
            provider = [[ARURLItemProvider alloc] initWithMessage:@"Message" path:path thumbnailImageURL:imageURL];
        });
        
        it(@"sets the imageURL", ^{
            expect(provider.thumbnailImage).to.beNil();
            expect(provider.thumbnailImageURL).to.equal(imageURL);
        });

        describe(@"placeholder url", ^{
            after(^{
                [ARTestContext stopStubbing];
            });
            it(@"is correct on phone", ^{
                [ARTestContext stubDevice:ARDeviceTypePhone5];
                expect(provider.placeholderItem).to.equal(expectedURL);
            });

            it(@"is correct on iPad", ^{
                [ARTestContext stubDevice:ARDeviceTypePad];
                expect(provider.placeholderItem).to.equal(expectedURL);
            });
        });

        describe(@"thumbnailImageForActivityType", ^{
            it(@"fetches and returns the thumbnail", ^{
                UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:@[] applicationActivities:@[]];
                [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                    return [request.URL.path isEqualToString:@"/image.jpg"];
                } withStubResponse:^OHHTTPStubsResponse *(NSURLRequest *request) {
                    return [[OHHTTPStubsResponse
                             responseWithFileAtPath:OHPathForFileInBundle(@"stub.jpg", nil)
                             statusCode:200
                             headers:@{@"Content-Type":@"image/jpeg"}]
                            responseTime:OHHTTPStubsDownloadSpeed3G];
                }];

                UIImage *thumbnailImage = [provider activityViewController:activityVC thumbnailImageForActivityType:@"any activity" suggestedSize:CGSizeMake(100, 100)];
                expect(thumbnailImage.class).to.equal([UIImage class]);
                expect(provider.thumbnailImage).to.equal(thumbnailImage);
            });

            // TODO: This test is occasionally suspiciously slow, it should be removed, or amended
            pending(@"returns nil for AirDrop sharing", ^{
                UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:@[] applicationActivities:@[]];
                UIImage *thumbnailImage = [provider activityViewController:activityVC thumbnailImageForActivityType:UIActivityTypeAirDrop suggestedSize:CGSizeMake(100, 100)];
                expect(thumbnailImage).to.beNil();
            });
        });

        describe(@"item", ^{
            describe(@"url", ^{
                after(^{
                    [ARTestContext stopStubbing];
                });
                it(@"is correct on phone", ^{
                    [ARTestContext stubDevice:ARDeviceTypePhone5];
                    expect(provider.item).to.equal(expectedURL);
                });

                it(@"is correct on iPad", ^{
                    [ARTestContext stubDevice:ARDeviceTypePad];
                    expect(provider.item).to.equal(expectedURL);
                });
            });

            
            describe(@"AirDrop sharing", ^{
                __block id file;
                __block NSURL *fileURL;
                __block id providerMock;
                __block NSDictionary *data;

                before(^{
                    providerMock = [OCMockObject partialMockForObject:provider];
                    [(ARURLItemProvider *)[[providerMock stub] andReturn:UIActivityTypeAirDrop] activityType];
                    file = provider.item;
                    fileURL = (id) file;
                    NSData *fileData = [NSData dataWithContentsOfURL:fileURL];
                    data = [NSJSONSerialization JSONObjectWithData:fileData options:0 error:nil];

                });
                after(^{
                    [providerMock stopMocking];
                });

                it(@"sets the file", ^{
                    expect(file).toNot.beNil();
                    expect(file).to.beKindOf([NSURL class]);
                });

                it(@"sets the file url", ^{
                    expect(fileURL.absoluteString).to.endWith(@".Artsy");
                });

                it(@"sets the version", ^{

                    expect([data valueForKey:@"version"]).to.equal(1);
                });
                describe(@"url", ^{
                    after(^{
                        [ARTestContext stopStubbing];
                    });
                    it(@"is correct on phone", ^{
                        [ARTestContext stubDevice:ARDeviceTypePhone5];
                        expect([data valueForKey:@"url"]).to.equal(expectedURL.absoluteString);
                    });

                    it(@"is correct on iPad", ^{
                        [ARTestContext stubDevice:ARDeviceTypePad];
                        expect([data valueForKey:@"url"]).to.equal(expectedURL.absoluteString);
                    });
                });
            });
        });
    });

    describe(@"with invalid imageURL", ^{
        __block NSURL *imageURL = [NSURL URLWithString:@"http://image.com/invalid.jpg"];
        
        beforeEach(^{
            provider = [[ARURLItemProvider alloc] initWithMessage:@"Message" path:path thumbnailImageURL:imageURL];
        });
        
        it(@"sets the imageURL", ^{
            expect(provider.thumbnailImage).to.beNil();
            expect(provider.thumbnailImageURL).to.equal(imageURL);
        });

        describe(@"placeholderItem", ^{
            after(^{
                [ARTestContext stopStubbing];
            });
            it(@"is correct on phone", ^{
                [ARTestContext stubDevice:ARDeviceTypePhone5];
                expect(provider.item).to.equal(expectedURL);
            });

            it(@"is correct on iPad", ^{
                [ARTestContext stubDevice:ARDeviceTypePad];
                expect(provider.item).to.equal(expectedURL);
            });
        });

        describe(@"thumbnailImageForActivityType", ^{
            it(@"fetches and returns the thumbnail", ^{
                UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:@[] applicationActivities:@[]];
                [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                    return [request.URL.path isEqualToString:@"/invalid.jpg"];
                } withStubResponse:^OHHTTPStubsResponse *(NSURLRequest *request) {
                    return [OHHTTPStubsResponse responseWithError:[NSError errorWithDomain:NSURLErrorDomain code:404 userInfo:nil]];
                }];

                UIImage *thumbnailImage = [provider activityViewController:activityVC thumbnailImageForActivityType:@"any activity" suggestedSize:CGSizeMake(100, 100)];
                expect(UIImageJPEGRepresentation(thumbnailImage, 12)).to.equal(UIImageJPEGRepresentation(image, 12));
                expect(provider.thumbnailImage).to.equal(thumbnailImage);

            });
        });

        describe(@"item", ^{
            after(^{
                [ARTestContext stopStubbing];
            });
            it(@"is correct on phone", ^{
                [ARTestContext stubDevice:ARDeviceTypePhone5];
                expect(provider.item).to.equal(expectedURL);
            });

            it(@"is correct on iPad", ^{
                [ARTestContext stubDevice:ARDeviceTypePad];
                expect(provider.item).to.equal(expectedURL);
            });
        });
    });
});

SpecEnd;
