#import "ARTestContext.h"
#import "UIDevice-Hardware.h"

static OCMockObject *ARDeviceMock;
static OCMockObject *ARPartialScreenMock;

@interface UIScreen(Prvate)
- (CGRect)_applicationFrameForInterfaceOrientation:(long long)arg1 usingStatusbarHeight:(double)arg2 ignoreStatusBar:(BOOL)ignore;
@end

@implementation ARTestContext

+ (void)stubDevice:(enum ARDeviceType)device
{
    CGSize size;
    BOOL isClassedAsPhone = YES;
    
    switch (device) {
        case ARDeviceTypePad:
            size = (CGSize){ 768, 1024 };
            isClassedAsPhone = NO;
            break;
            
        case ARDeviceTypePhone4:
            size = (CGSize){ 320, 480 };
            break;
            
        case ARDeviceTypePhone5:
            size = (CGSize){ 320, 568 };
            break;

        case ARDeviceTypePhone6:
            size = (CGSize){ 375, 667 };
            break;
    }

    ARDeviceMock = [OCMockObject niceMockForClass:UIDevice.class];
    [[[ARDeviceMock stub] andReturnValue:OCMOCK_VALUE((BOOL){ !isClassedAsPhone })] isPad];
    [[[ARDeviceMock stub] andReturnValue:OCMOCK_VALUE((BOOL){ isClassedAsPhone })] isPhone];
    
    ARPartialScreenMock = [OCMockObject partialMockForObject:UIScreen.mainScreen];
    NSValue *phoneSize = [NSValue valueWithCGRect:(CGRect)CGRectMake(0, 0, size.width, size.height)];

    [[[ARPartialScreenMock stub] andReturnValue:phoneSize] bounds];
    [[[[ARPartialScreenMock stub] andReturnValue:phoneSize] ignoringNonObjectArgs] _applicationFrameForInterfaceOrientation:0  usingStatusbarHeight:0 ignoreStatusBar:NO];
}

+ (void)stopStubbing
{
    [ARPartialScreenMock stopMocking];
    [ARDeviceMock stopMocking];
}

@end