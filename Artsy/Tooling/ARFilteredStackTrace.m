#ifdef DEBUG

#import "ARFilteredStackTrace.h"

#import <execinfo.h>
#import <libgen.h>
#import <mach-o/dyld.h>

NSString *const ARFilteredStackTraceWhiteListedImages = @"WhiteList";
NSString *const ARFilteredStackTraceBlackListedImages = @"BlackList";

static BOOL
ARSymbolIsFromAnyImage(Dl_info *info, NSArray *list)
{
    NSString *imagePath = [NSString stringWithUTF8String:info->dli_fname];
    NSString *imageName = [imagePath lastPathComponent];
    for (id image in list) {
        if ([image isKindOfClass:[NSBundle class]]) {
            if ([imagePath isEqualToString:[(NSBundle *)image executablePath]]) {
                return YES;
            }
        } else if ([image isKindOfClass:[NSString class]]) {
            if ([imagePath isEqualToString:image] || [imageName isEqualToString:image]) {
                return YES;
            }
        } else {
            NSCAssert(NO, @"Unexpected class, should be either NSBundle or NSString: %@", image);
        }
    }
    return NO;
}

static BOOL
ARFilteredStackTracePerformParsedSymbolBlock(Dl_info *info, ARFilteredStackTraceParsedSymbolBlock block)
{
    NSString *symbol = [NSString stringWithUTF8String:info->dli_sname];
    NSScanner *scanner = [NSScanner scannerWithString:symbol];

    // First remove block prefixes
    BOOL isBlock = [scanner scanString:@"__" intoString:NULL] && [scanner scanInt:NULL];
    // Then remove class or instance method indicators
    BOOL isClassMethod = [scanner scanString:@"+[" intoString:NULL];
    BOOL isInstanceMethod = [scanner scanString:@"-[" intoString:NULL];

    if (isClassMethod || isInstanceMethod) {
        NSString *className = nil;
        NSCAssert([scanner scanUpToString:@" " intoString:&className], @"Expected to parse a class name from: %@", scanner.string);
        NSString *methodName = nil;
        NSCAssert([scanner scanUpToString:@"]" intoString:&methodName], @"Expected to parse a method name from: %@", scanner.string);
        return block(isBlock, YES, isClassMethod, className, methodName);
    } else {
        return block(isBlock, NO, NO, nil, symbol);
    }
}

NSArray *
ARFilteredStackTraceWithOptions(int skip_frames,
                                ARFilteredStackTraceBasicBlock basicBlock,
                                ARFilteredStackTraceParsedSymbolBlock parsedSymbolBlock)
{
    void *callstack[128];
    int callstack_size = backtrace(callstack, 128);
    NSMutableArray *symbols = [NSMutableArray new];
    // Always skip this function’s frame
    skip_frames++;

    for (int i = skip_frames; i < callstack_size; i++) {
        intptr_t address = (intptr_t)callstack[i];
        NSString *symbol = nil;
        Dl_info info;
        if (dladdr((void *)address, &info) == 0) {
            symbol = [NSString stringWithFormat:@"%p (unable to retrieve metadata)", (void *)address];
        } else {
            if (basicBlock && !basicBlock(&info)) continue;
            if (parsedSymbolBlock && !ARFilteredStackTracePerformParsedSymbolBlock(&info, parsedSymbolBlock)) continue;
            char *path = (char *)info.dli_fname;
            symbol = [NSString stringWithFormat:@"%s: %s (%p)", basename(path), info.dli_sname, (void *)address];
        }
        [symbols addObject:symbol];
    }

    return [symbols copy];
}

NSArray *
ARFilteredStackTraceWithWhiteList(int skip_frames, NSArray *whiteList, ARFilteredStackTraceParsedSymbolBlock parsedSymbolBlock)
{
    return ARFilteredStackTraceWithOptions(skip_frames + 1, ^BOOL(Dl_info *info) {
        return ARSymbolIsFromAnyImage(info, whiteList);
    }, parsedSymbolBlock);
}

NSArray *
ARFilteredStackTraceWithBlackList(int skip_frames, NSArray *blackList, ARFilteredStackTraceParsedSymbolBlock parsedSymbolBlock)
{
    return ARFilteredStackTraceWithOptions(skip_frames + 1, ^BOOL(Dl_info *info) {
        return !ARSymbolIsFromAnyImage(info, blackList);
    }, parsedSymbolBlock);
}

NSArray *ARFilteredStackTrace(int skip_frames, ARFilteredStackTraceParsedSymbolBlock parsedSymbolBlock)
{
    return ARFilteredStackTraceWithWhiteList(skip_frames + 1, @[ [NSBundle mainBundle] ], parsedSymbolBlock);
}

#endif
