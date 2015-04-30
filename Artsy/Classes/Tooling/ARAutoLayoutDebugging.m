//
// The original code and idea to add callstack info to layout constraints taken from
// https://github.com/objcio/issue-3-auto-layout-debugging
//

#if DEBUG

// #import <sys/types.h>
#import <mach-o/ldsyms.h>
#ifdef __LP64__
typedef struct segment_command_64 *segment_command_ptr;
typedef struct mach_header_64     *macho_header_ptr;
typedef struct mach_header_64     macho_header;
#define SEGMENT_LOAD_COMMAND      LC_SEGMENT_64
#else
typedef struct segment_command    *segment_command_ptr;
typedef struct mach_header        *macho_header_ptr;
typedef struct mach_header        macho_header;
#define SEGMENT_LOAD_COMMAND      LC_SEGMENT
#endif
static intptr_t
LastAddressOfAppImage(void)
{
    static intptr_t last_image_address = 0;
    static dispatch_once_t once_token = 0;
    dispatch_once(&once_token, ^{
        segment_command_ptr segment;
        macho_header_ptr header = (macho_header_ptr)&_mh_execute_header;
        segment = (segment_command_ptr)((char *)header + sizeof(macho_header));
        for (uint32_t i = 0; i < header->ncmds; i++) {
            if (segment->cmd == SEGMENT_LOAD_COMMAND) {
                intptr_t next_address = segment->vmaddr + segment->vmsize;
                if (next_address > last_image_address) {
                    last_image_address = next_address;
                }
            }
            segment = (segment_command_ptr)((char *)segment + segment->cmdsize);
        }
    });
    return last_image_address;
}


static int const ARLayoutConstraintDebuggingShort;
static int const ARLayoutConstraintDebuggingCallStackSymbols;


static BOOL
ARAutoLayoutDebuggingEnabled(void)
{
    return [[NSProcessInfo processInfo] environment][@"ARAutoLayoutDebugging"] != nil;
}

#import <objc/runtime.h>
static void
MethodSwizzle(Class c, SEL origSEL, SEL overrideSEL)
{
    Method origMethod = class_getInstanceMethod(c, origSEL);
    Method overrideMethod = class_getInstanceMethod(c, overrideSEL);
    if (class_addMethod(c, origSEL, method_getImplementation(overrideMethod), method_getTypeEncoding(overrideMethod))) {
        class_replaceMethod(c, overrideSEL, method_getImplementation(origMethod), method_getTypeEncoding(origMethod));
    } else {
        method_exchangeImplementations(origMethod, overrideMethod);
    }
}

#import <execinfo.h>
#import <dlfcn.h>
static void
AddCallstackToConstraints(NSArray *constraints)
{
    void *callstack[128];
    int callstack_size = backtrace(callstack, 128);

    NSString *firstAppSymbol = nil;
    NSMutableArray *symbols = [NSMutableArray new];

    // Skip the frames for this function and the calling addConstraint(s) method.
    for (int i = 2; i < callstack_size; i++) {
        intptr_t address = (intptr_t)callstack[i];
        NSString *symbol = nil;
        Dl_info info;
        if (dladdr((void *)address, &info) == 0) {
            symbol = [NSString stringWithFormat:@"%p", (void *)address];
        } else {
            symbol = [NSString stringWithUTF8String:info.dli_sname];
            if (firstAppSymbol == nil && address <= LastAddressOfAppImage()) {
                firstAppSymbol = symbol;
            }
        }
        [symbols addObject:symbol];
    }

    for (NSLayoutConstraint *c in constraints) {
        if (firstAppSymbol != nil) {
            objc_setAssociatedObject(c, &ARLayoutConstraintDebuggingShort, firstAppSymbol, OBJC_ASSOCIATION_COPY_NONATOMIC);
        }
        objc_setAssociatedObject(c, &ARLayoutConstraintDebuggingCallStackSymbols, symbols, OBJC_ASSOCIATION_COPY_NONATOMIC);
    }
}


@implementation UIView (ARAutoLayoutDebugging)

+ (void)load;
{
    if (ARAutoLayoutDebuggingEnabled()) {
        MethodSwizzle(self, @selector(addConstraint:), @selector(ARAutoLayoutDebugging_addConstraint:));
        MethodSwizzle(self, @selector(addConstraints:), @selector(ARAutoLayoutDebugging_addConstraints:));
    }
}

- (void)ARAutoLayoutDebugging_addConstraint:(NSLayoutConstraint *)constraint;
{
    AddCallstackToConstraints(@[constraint]);
    [self ARAutoLayoutDebugging_addConstraint:constraint];
}

- (void)ARAutoLayoutDebugging_addConstraints:(NSArray *)constraints;
{
    AddCallstackToConstraints(constraints);
    [self ARAutoLayoutDebugging_addConstraints:constraints];
}

@end


@implementation NSLayoutConstraint (ARAutoLayoutDebugging)

+ (void)load;
{
    if (ARAutoLayoutDebuggingEnabled()) {
        MethodSwizzle(self, @selector(description), @selector(ARAutoLayoutDebugging_description));
    }
}

- (NSString *)ARAutoLayoutDebugging_description;
{
    NSString *description = [self ARAutoLayoutDebugging_description];
    NSString *symbol = objc_getAssociatedObject(self, &ARLayoutConstraintDebuggingShort);
    return symbol == nil ? description : [description stringByAppendingFormat:@" %@", symbol];
}

// You can call this from the debugger to get a full callstack.
- (NSArray *)creationCallStackSymbols;
{
    return objc_getAssociatedObject(self, &ARLayoutConstraintDebuggingCallStackSymbols);
}

@end

#endif
