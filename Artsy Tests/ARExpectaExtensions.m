#import "ARExpectaExtensions.h"

void _itTestsAsyncronouslyWithDevicesRecording(id self, int lineNumber, const char *fileName, BOOL record, NSString *name, id (^block)()) {

    void (^snapshot)(id, NSString *) = ^void (id sut, NSString *suffix) {

        EXPExpect *expectation = _EXP_expect(self, lineNumber, fileName, ^id{ return EXPObjectify((sut)); });

        if (record) {
            expectation.will.recordSnapshotNamed([name stringByAppendingString:suffix]);
        } else {
            expectation.will.haveValidSnapshotNamed([name stringByAppendingString:suffix]);
        }
    };

    it([name stringByAppendingString:@" as iphone"], ^{
        [ARTestContext stubDevice:ARDeviceTypePhone5];
        @try {
            id sut = block();
            snapshot(sut, @" as iphone");
        }
        @catch (NSException *exception) {
            NSLog(@"Device snapshot failure");
        }
        @finally {
            [ARTestContext stopStubbing];
        }
    });

    it([name stringByAppendingString:@" as ipad"], ^{
        [ARTestContext stubDevice:ARDeviceTypePad];
        @try {
            id sut = block();
            snapshot(sut, @" as ipad");
        }
        @catch (NSException *exception) {
            NSLog(@"Device snapshot failure");
        }
        @finally {
            [ARTestContext stopStubbing];
        }
    });
}

void _itTestsSyncronouslyWithDevicesRecording(id self, int lineNumber, const char *fileName, BOOL record, NSString *name, id (^block)()) {
    
    void (^snapshot)(id, NSString *) = ^void (id sut, NSString *suffix) {
        
        EXPExpect *expectation = _EXP_expect(self, lineNumber, fileName, ^id{ return EXPObjectify((sut)); });
        
        if (record) {
            expectation.to.recordSnapshotNamed([name stringByAppendingString:suffix]);
        } else {
            expectation.to.haveValidSnapshotNamed([name stringByAppendingString:suffix]);
        }
    };
    
    it([name stringByAppendingString:@" as iphone"], ^{
        [ARTestContext stubDevice:ARDeviceTypePhone5];
        @try {
            id sut = block();
            snapshot(sut, @" as iphone");
        }
        @catch (NSException *exception) {
            NSLog(@"Device snapshot failure");
        }
        @finally {
            [ARTestContext stopStubbing];
        }
    });
    
    it([name stringByAppendingString:@" as ipad"], ^{
        [ARTestContext stubDevice:ARDeviceTypePad];
        @try {
            id sut = block();
            snapshot(sut, @" as ipad");
        }
        @catch (NSException *exception) {
            NSLog(@"Device snapshot failure");
        }
        @finally {
            [ARTestContext stopStubbing];
        }
    });
}