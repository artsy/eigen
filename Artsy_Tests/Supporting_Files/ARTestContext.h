typedef NS_ENUM(NSInteger, ARDeviceType) {
    ARDeviceTypePhone4,
    ARDeviceTypePhone5,
    ARDeviceTypePhone6,
    ARDeviceTypePad
};


@interface ARTestContext : NSObject

/// Runs the block in the specified device context
+ (void)useDevice:(enum ARDeviceType)device :(void (^)(void))block;

/// Stubs the device related Apple objects
+ (void)stubDevice:(enum ARDeviceType)device;

/// Stops the partial mocks for Apple's objects
+ (void)stopStubbing;

@end
