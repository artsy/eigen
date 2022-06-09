


@interface MutableNSURLResponse : NSURLResponse
@property (nonatomic, assign) NSInteger statusCode;
- (id)initWithStatusCode:(NSInteger)statusCode;
@end
