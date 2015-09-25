#import "UIViewController+WithLoadedData.h"
#import <objc/runtime.h>

@implementation UIViewController (WithLoadedData)

static char ARWithLoadedDataStatusKey;
static char ARWithLoadedDataBlockKey;

- (void)ar_setDataLoaded;
{
    NSAssert(!self.ar_isDataLoaded, @"Only 1 call to ar_setDataLoaded is expected during the lifetime of a VC.");
    objc_setAssociatedObject(self, &ARWithLoadedDataStatusKey, @(YES), OBJC_ASSOCIATION_RETAIN_NONATOMIC);

    dispatch_block_t block = self.ar_loadedDataBlock;
    if (block) {
        self.ar_loadedDataBlock = nil;
        block();
    }
}

- (BOOL)ar_isDataLoaded;
{
    return [objc_getAssociatedObject(self, &ARWithLoadedDataStatusKey) boolValue];
}

- (void)setAr_loadedDataBlock:(dispatch_block_t)block;
{
    objc_setAssociatedObject(self, &ARWithLoadedDataBlockKey, block, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (dispatch_block_t)ar_loadedDataBlock;
{
    return objc_getAssociatedObject(self, &ARWithLoadedDataBlockKey);
}

- (void)ar_withLoadedData:(dispatch_block_t)block;
{
    if (self.ar_isDataLoaded) {
        block();
    } else {
        NSAssert(self.ar_loadedDataBlock == nil, @"Only 1 WithLoadedData block at a time is allowed.");
        self.ar_loadedDataBlock = block;
    }
}

@end
