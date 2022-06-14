#import "ARExpectaExtensions.h"
#import <Forgeries/ForgeriesTraitCollections.h>

void _itTestsWithDevicesRecordingAsynchronouslyWithName(id self, int lineNumber, const char *fileName, BOOL record, BOOL async, NSString *name, id (^block)(void))
{
    void (^snapshot)(id, NSString *) = ^void(id sut, NSString *suffix) {

        EXPExpect *expectation = _EXP_expect(self, lineNumber, fileName, ^id{ return EXPObjectify((sut)); });

        expectation = async ? expectation.will : expectation.to;

        if (record) {
            if (name) {
                expectation.recordSnapshotNamed([name stringByAppendingString:suffix]);
            } else {
                expectation.recordSnapshot();
            }
        } else {
            if (name) {
                expectation.haveValidSnapshotNamed([name stringByAppendingString:suffix]);
            } else {
                expectation.haveValidSnapshot();
            }
        }
    };

    it(@" as iphone", ^{
        [ARTestContext stubDevice:ARDeviceTypePhone5];

        @try {
            id sut = block();
            if ([sut respondsToSelector:@selector(stubHorizontalSizeClass:)]) {
                [sut stubHorizontalSizeClass:UIUserInterfaceSizeClassCompact];
            }
            snapshot(sut, @" as iphone");
        }
        @catch (NSException *exception) {
            EXPFail(self, lineNumber, fileName, [NSString stringWithFormat:@"'%@' has crashed: %@", [name stringByAppendingString:@" as iphone"], exception.description]);
        }
        @finally {
            [ARTestContext stopStubbing];
        }
    });

    it(@" as ipad", ^{
        [ARTestContext stubDevice:ARDeviceTypePad];
        @try {
            id sut = block();
            if ([sut respondsToSelector:@selector(stubHorizontalSizeClass:)]) {
                [sut stubHorizontalSizeClass:UIUserInterfaceSizeClassRegular];
            }
            snapshot(sut, @" as ipad");
        }
        @catch (NSException *exception) {
            EXPFail(self, lineNumber, fileName, [NSString stringWithFormat:@"'%@' has crashed: %@", [name stringByAppendingString:@" as ipad"], exception.description]);
        }
        @finally {
            [ARTestContext stopStubbing];
        }
    });
}

void _itTestsSyncronouslyWithDevicesRecordingWithName(id self, int lineNumber, const char *fileName, BOOL record, NSString *name, id (^block)(void))
{
    _itTestsWithDevicesRecordingAsynchronouslyWithName(self, lineNumber, fileName, record, NO, name, block);
}

void _itTestsAsyncronouslyWithDevicesRecordingWithName(id self, int lineNumber, const char *fileName, BOOL record, NSString *name, id (^block)(void))
{
    _itTestsWithDevicesRecordingAsynchronouslyWithName(self, lineNumber, fileName, record, YES, name, block);
}
