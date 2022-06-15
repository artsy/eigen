#import "ARMessageItemProvider.h"
#import "ARNetworkConstants.h"
#import "ARRouter.h"


@interface ARMessageItemProvider (Testing)
@property (nonatomic, strong, readonly) NSString *path;
@property (nonatomic, strong, readonly) NSString *message;
@property (nonatomic, strong, readonly) NSURL *url;
@end


SpecBegin(ARMessageItemProvider);

describe(@"message provider", ^{
    __block ARMessageItemProvider *provider;
    __block NSString *placeHolderMessage = @"So And So";
    __block NSString *path = @"artist/so-and-so";
    __block UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:@[] applicationActivities:@[]];

    describe(@"provider", ^{
        beforeEach(^{
            provider = [[ARMessageItemProvider alloc] initWithMessage:placeHolderMessage path:path];
        });

        it(@"sets the placeholderItem", ^{
            expect(provider.placeholderItem).to.equal(@"So And So");
        });
        
        it(@"sets the path", ^{
            expect(provider.path).to.equal(path);
        });

        it(@"adds ' on Artsy' to the message", ^{
            expect(provider.message).to.equal(@"So And So on Artsy");
        });

        describe(@"subjectForActivityType", ^{
            it(@"returns message for Mail", ^{
                NSString *subject = [provider activityViewController:activityVC subjectForActivityType:UIActivityTypeMail];
                expect(subject).to.equal(@"So And So on Artsy");
            });

            it(@"returns nothing for other activities", ^{
                NSString *subject = [provider activityViewController:activityVC subjectForActivityType:@"another activity"];
                expect(subject).to.equal(@"");
            });
        });
    });
        
    describe(@"item", ^{
        __block id providerMock;

        before(^{
            provider = [[ARMessageItemProvider alloc] initWithMessage:placeHolderMessage path:path];
            providerMock = [OCMockObject partialMockForObject:provider];
        });

        it(@"adds Twitter handle for Twitter", ^{
            [(ARMessageItemProvider *)[[providerMock stub] andReturn:UIActivityTypePostToTwitter] activityType];
            expect([provider item]).to.equal(@"So And So on @Artsy");
        });

        it(@"formats HTML for Mail", ^{
            [(ARMessageItemProvider *)[[providerMock stub] andReturn:UIActivityTypeMail] activityType];
            NSString *email = [NSString stringWithFormat: @"<html><body><a href='%@/%@'>%@</a></body></html>",
                               [ARRouter baseWebURL].absoluteString, path, @"So And So on Artsy"];
            expect([provider item]).to.equal(email);
        });

        it(@"adds ' on Artsy: for other activities", ^{
            [(ARMessageItemProvider *)[[providerMock stub] andReturn:@"another activity"] activityType];
            expect([provider item]).to.equal(@"So And So on Artsy");
        });
    });
});

SpecEnd;
