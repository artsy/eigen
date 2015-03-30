#import "Article.h"

@interface Article ()
@property (nonatomic, copy, readonly) NSString *publicArtsyPath;
@end

@implementation Article
@synthesize name = _name;

- (instancetype)initWithURL:(NSURL *)url name:(NSString *)name
{
    self = [super init];
    if (!self)return nil;

    _publicArtsyPath = url.path;
    _name = name;

    return self;
}

@end
