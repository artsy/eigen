#import "ARImageItemProvider.h"

@interface ARImageItemProvider (Testing)
@property (nonatomic, strong, readwrite) NSString *activityType;
@end

SpecBegin(ARImageItemProvider)

describe(@"image provider item", ^{
    __block UIImage *image = [UIImage imageNamed:@"stub.jpg"];
    __block ARImageItemProvider *provider = [[ARImageItemProvider alloc] initWithPlaceholderItem:image];
    __block id providerMock = [OCMockObject partialMockForObject:provider];

    NSArray *imagelessActivities = @[@"Twitter", @"Facebook"];

    for (NSString *activity in imagelessActivities) {
        it([NSString stringWithFormat:@"%@%@", @"returns nil for ", activity], ^{
            NSString *activityType = [NSString stringWithFormat:@"%@%@",@"com.apple.UIKit.activity.PostTo", activity];
            [(ARImageItemProvider *)[[providerMock stub] andReturn:activityType] activityType];
            expect(provider.item).to.beNil();
        });
    }

    it(@"returns placeholderItem for other activities", ^{
        [(ARImageItemProvider *)[[providerMock stub] andReturn:@"another activity"] activityType];;
        expect(provider.item).to.equal(image);
    });

});

SpecEnd
