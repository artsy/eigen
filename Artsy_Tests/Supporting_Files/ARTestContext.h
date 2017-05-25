typedef NS_ENUM(NSInteger, ARDeviceType) {
    ARDeviceTypePhone4,
    ARDeviceTypePhone5,
    ARDeviceTypePhone6,
    ARDeviceTypePad
};

@class OCMockObject;


@interface ARTestContext : NSObject

/// Runs the block in the specified device context
+ (void)useDevice:(enum ARDeviceType)device :(void (^)(void))block;

/// Stubs the device related Apple objects
+ (void)stubDevice:(enum ARDeviceType)device;

/// Stops the partial mocks for Apple's objects
+ (void)stopStubbing;

/// Freeze time returned from [NSDate date] class method. Returns the mock so time may be unfrozen.
+ (OCMockObject *)freezeTime;

/// Freeze time returned from [NSDate date] class method. Returns the mock so time may be unfrozen.
+ (OCMockObject *)freezeTime:(NSDate *)now;

/// Freeze time returned from [ARSystemTime date] class method. Returns the mock so time may be unfrozen.
+ (OCMockObject *)freezeSystemTime:(NSDate *)now;

/// A closure where time is frozen
+ (void)freezeTime:(NSDate *)now closure:(void (^)(void))closure;

@end
