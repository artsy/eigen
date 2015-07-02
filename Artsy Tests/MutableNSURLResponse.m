#import "MutableNSURLResponse.h"


@implementation MutableNSURLResponse

- (id)initWithStatusCode:(NSInteger)statusCode
{
    self = [super init];
    if (self) {
        _statusCode = statusCode;
    }
    return self;
}

@end
