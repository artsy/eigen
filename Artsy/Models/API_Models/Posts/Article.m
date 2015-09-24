#import "Article.h"


@interface Article ()
@property (nonatomic, copy, readonly) NSString *publicArtsyPath;
@property (nonatomic, copy, readonly) NSString *publicArtsyID;
@end


@implementation Article
@synthesize name = _name;

- (instancetype)initWithURL:(NSURL *)url name:(NSString *)name
{
    self = [super init];
    if (!self) return nil;

    _publicArtsyPath = url.path;
    _publicArtsyID = [_publicArtsyPath lastPathComponent];
    _name = name;

    return self;
}

@end
