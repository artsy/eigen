#ifdef DEBUG

#import <Foundation/Foundation.h>
#import <dlfcn.h>

typedef BOOL (^ARFilteredStackTraceBasicBlock)(Dl_info *info);
typedef BOOL (^ARFilteredStackTraceParsedSymbolBlock)(BOOL blockInvocation,
                                                      BOOL objcMethod,
                                                      BOOL classMethod,
                                                      NSString *className,
                                                      NSString *methodOrFunctionName);

/// `skip_frames` allows you to skip the calling function(s), where 0 is no skipping.
///
/// Both `basicBlock` and `parsedSymbolBlock` are optional blocks that allow filtering of symbols from the stack trace.
/// A block should return `YES` if it is to be included or `NO` if it is to be excluded.
///
NSArray *ARFilteredStackTraceWithOptions(int skip_frames,
                                         ARFilteredStackTraceBasicBlock basicBlock,
                                         ARFilteredStackTraceParsedSymbolBlock parsedSymbolBlock);

/// `skip_frames` allows you to skip the calling function(s), where 0 is no skipping.
///
/// `whiteList` may specify a list of `NSBundle` instances or `NSString` instances describing images that should be
/// included. In case of an `NSString` it may be the image’s name or full path.
///
/// `parsedSymbolBlock` may optionally be specified to further filter symbols.
/// It should return `YES` if it is to be included or `NO` if it is to be excluded.
///
NSArray *ARFilteredStackTraceWithWhiteList(int skip_frames,
                                           NSArray *whiteList,
                                           ARFilteredStackTraceParsedSymbolBlock parsedSymbolBlock);

/// `skip_frames` allows you to skip the calling function(s), where 0 is no skipping.
///
/// `blackList` may specify a list of `NSBundle` instances or `NSString` instances describing images that should **not**
/// be included. In case of an `NSString` it may be the image’s name or full path.
///
/// `parsedSymbolBlock` may optionally be specified to further filter symbols.
/// It should return `YES` if it is to be included or `NO` if it is to be excluded.
///
NSArray *ARFilteredStackTraceWithBlackList(int skip_frames,
                                           NSArray *blackList,
                                           ARFilteredStackTraceParsedSymbolBlock parsedSymbolBlock);

/// This only allows symbols from the main bundle.
///
/// `skip_frames` allows you to skip the calling function(s), where 0 is no skipping.
///
/// `parsedSymbolBlock` may optionally be specified to further filter symbols.
/// It should return `YES` if it is to be included or `NO` if it is to be excluded.
///
NSArray *ARFilteredStackTrace(int skip_frames, ARFilteredStackTraceParsedSymbolBlock parsedSymbolBlock);

#endif
