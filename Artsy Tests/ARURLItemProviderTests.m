#import "ARURLItemProvider.h"
#import "ARNetworkConstants.h"

SpecBegin(ARURLItemProvider)

afterEach(^{
    [OHHTTPStubs removeAllStubs];
});

describe(@"url and image thumbnail", ^{
    __block NSString *path = @"/artist/xyz";
    __block NSURL *pathUrl = [NSURL URLWithString:path relativeToURL:[NSURL URLWithString:ARBaseMobileWebURL]];
    __block NSURL *url = [NSURL URLWithString:[pathUrl absoluteString]];
    __block ARURLItemProvider *provider;
    __block UIImage *image = [UIImage imageNamed:@"stub.jpg"];

    describe(@"with valid imageURL", ^{
        __block NSURL *imageURL = [NSURL URLWithString:@"http://image.com/image.jpg"];
        
        beforeEach(^{
            provider = [[ARURLItemProvider alloc] initWithMessage:@"Message" path:path thumbnailImageURL:imageURL];
        });
        
        it(@"sets the imageURL", ^{
            expect(provider.thumbnailImage).to.beNil();
            expect(provider.thumbnailImageURL).to.equal(imageURL);
        });

        it(@"sets placeholderItem", ^{
            expect(provider.placeholderItem).to.equal(url);
        });

        describe(@"thumbnailImageForActivityType", ^{
            it(@"fetches and returns the thumbnail", ^{
                UIActivityViewController *activityVC = [[UIActivityViewController alloc] init];
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
            
            it(@"returns nil for AirDrop sharing", ^{
                UIActivityViewController *activityVC = [[UIActivityViewController alloc] init];
                UIImage *thumbnailImage = [provider activityViewController:activityVC thumbnailImageForActivityType:UIActivityTypeAirDrop suggestedSize:CGSizeMake(100, 100)];
                expect(thumbnailImage).to.beNil();
            });
        });

        describe(@"item", ^{
            it(@"returns the url", ^{
                expect([provider item]).to.equal(url);
            });
            
            it(@"returns a file for AirDrop sharing", ^{
                OCMockObject *providerMock = [OCMockObject partialMockForObject:provider];
                [[[providerMock stub] andReturn:UIActivityTypeAirDrop] activityType];
                id file = provider.item;
                expect(file).toNot.beNil();
                expect(file).to.beKindOf([NSURL class]);
                NSURL *fileURL = (id) file;
                expect(fileURL.absoluteString).to.endWith(@".Artsy");
                NSData *fileData = [NSData dataWithContentsOfURL:fileURL];
                NSDictionary *data = [NSJSONSerialization JSONObjectWithData:fileData options:0 error:nil];
                expect([data valueForKey:@"version"]).to.equal(1);
                expect([data valueForKey:@"url"]).to.equal(url.absoluteString);
                [providerMock stopMocking];
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

        it(@"sets placeholderItem", ^{
            expect(provider.placeholderItem).to.equal(url);
        });

        describe(@"thumbnailImageForActivityType", ^{
            it(@"fetches and returns the thumbnail", ^{
                UIActivityViewController *activityVC = [[UIActivityViewController alloc] init];
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
            it(@"returns the url", ^{
                expect([provider item]).to.equal(url);
            });
        });
    });
});

SpecEnd
