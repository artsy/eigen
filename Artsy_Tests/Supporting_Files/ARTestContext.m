#import "ARTestContext.h"
#import "UIDevice-Hardware.h"

static OCMockObject *ARDeviceMock;
static OCMockObject *ARPartialScreenMock;


@interface UIScreen (Prvate)
- (CGRect)_applicationFrameForInterfaceOrientation:(long long)arg1 usingStatusbarHeight:(double)arg2 ignoreStatusBar:(BOOL)ignore;
@end


@implementation ARTestContext

+ (void)useDevice:(enum ARDeviceType)device :(void (^)(void))block
{
    [self stubDevice:device];
    block();
    [self stopStubbing];
}

+ (void)stubDevice:(enum ARDeviceType)device
{
    CGSize size;
    BOOL isClassedAsPhone = YES;

    switch (device) {
        case ARDeviceTypePad:
            size = (CGSize){768, 1024};
            isClassedAsPhone = NO;
            break;

        case ARDeviceTypePhone4:
            size = (CGSize){320, 480};
            break;

        case ARDeviceTypePhone5:
            size = (CGSize){320, 568};
            break;

        case ARDeviceTypePhone6:
            size = (CGSize){375, 667};
            break;
    }

    ARDeviceMock = [OCMockObject niceMockForClass:UIDevice.class];
    [[[ARDeviceMock stub] andReturnValue:OCMOCK_VALUE((BOOL){!isClassedAsPhone})] isPad];
    [[[ARDeviceMock stub] andReturnValue:OCMOCK_VALUE((BOOL){isClassedAsPhone})] isPhone];

    ARPartialScreenMock = [OCMockObject partialMockForObject:UIScreen.mainScreen];
    NSValue *phoneSize = [NSValue valueWithCGRect:(CGRect)CGRectMake(0, 0, size.width, size.height)];

    [[[ARPartialScreenMock stub] andReturnValue:phoneSize] bounds];
    [[[[ARPartialScreenMock stub] andReturnValue:phoneSize] ignoringNonObjectArgs] _applicationFrameForInterfaceOrientation:0 usingStatusbarHeight:0 ignoreStatusBar:NO];
}

+ (void)stopStubbing
{
    [ARPartialScreenMock stopMocking];
    [ARDeviceMock stopMocking];
}

+ (OCMockObject *)freezeTime
{
    NSDate *now = [NSDate date];
    return [self freezeTime:now];
}

+ (OCMockObject *)freezeTime:(NSDate *)now
{
    id mock = [OCMockObject mockForClass:[NSDate class]];
    [[[mock stub] andReturn:now] date];
    return mock;
}

+ (OCMockObject *)freezeSystemTime:(NSDate *)now
{
    id mock = [OCMockObject mockForClass:[ARSystemTime class]];
    [[[mock stub] andReturn:now] date];
    return mock;
}

static OCMockObject *dateMock;
static OCMockObject *dateSystemMock;

+ (void)freezeTime:(NSDate *)now closure:(void (^)(void))closure
{
    dateMock = [self freezeTime:now];
    dateSystemMock = [self freezeSystemTime:now];

    @try {
        closure();
    } @catch (NSException *exception) {
        NSLog(@"---------------------");
        NSLog(@"A crash occured during frzen time, %@", exception);
    } @finally {
        dateSystemMock = nil;
        dateMock = nil;
    }
}

@end
