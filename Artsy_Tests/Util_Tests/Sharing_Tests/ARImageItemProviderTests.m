#import "ARImageItemProvider.h"


@interface ARImageItemProvider (Testing)
@property (nonatomic, strong, readwrite) NSString *activityType;
@end

SpecBegin(ARImageItemProvider);

describe(@"image provider item", ^{
    NSBundle *bundle = [NSBundle bundleForClass:ARImageItemProviderSpec.class];
    NSString *path = [bundle pathForResource:@"stub" ofType:@"jpg"];
    UIImage *image = [UIImage imageWithContentsOfFile:path];
    
    __block ARImageItemProvider *provider;
    __block id providerMock;

    beforeEach(^{
        provider = [[ARImageItemProvider alloc] initWithPlaceholderItem:image];
        providerMock = [OCMockObject partialMockForObject:provider];
    });
    
    it(@"returns nil for twitter", ^{
        [(ARImageItemProvider *)[[providerMock stub] andReturn:UIActivityTypePostToTwitter] activityType];;
        expect(provider.item).to.equal([NSNull null]);
    });
    
    it(@"returns nil for facebook", ^{
        [(ARImageItemProvider *)[[providerMock stub] andReturn:UIActivityTypePostToFacebook] activityType];;
        expect(provider.item).to.equal([NSNull null]);
    });

    it(@"returns placeholderItem for other activities", ^{
        [(ARImageItemProvider *)[[providerMock stub] andReturn:UIActivityTypeCopyToPasteboard] activityType];;
        expect(provider.item).to.equal(image);
    });

});

SpecEnd;
