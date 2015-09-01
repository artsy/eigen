#import "ArtsyAPI+Private.h"


@implementation ArtsyAPI (ListCollection)

+ (void)getGenesFromPersonalCollectionCount:(void (^)(NSNumber *count))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newGeneCountFromPersonalCollectionRequest];
    [self getCountForCollectionFromRequest:request success:success failure:failure];
}

+ (void)getGenesFromPersonalCollectionAtPage:(NSInteger)page success:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newGenesFromPersonalCollectionAtPage:page];
    [ArtsyAPI getRequest:request parseIntoAnArrayOfClass:[Gene class] withKey:@"gene" success:success failure:failure];
}

+ (void)getArtistsFromPersonalCollectionCount:(void (^)(NSNumber *count))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtistCountFromPersonalCollectionRequest];
    [self getCountForCollectionFromRequest:request success:success failure:failure];
}

+ (void)getArtistsFromPersonalCollectionAtPage:(NSInteger)page success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtistsFromPersonalCollectionAtPage:page];
    [ArtsyAPI getRequest:request parseIntoAnArrayOfClass:[Artist class] withKey:@"artist" success:success failure:failure];
}

+ (void)getArtistsFromSampleAtPage:(NSInteger)page success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter newArtistsFromSampleAtPage:page];
    [ArtsyAPI getRequest:request parseIntoAnArrayOfClass:[Artist class] success:success failure:failure];
}

+ (void)getCountForCollectionFromRequest:(NSURLRequest *)request success:(void (^)(NSNumber *count))success failure:(void (^)(NSError *error))failure
{
    __weak AFHTTPRequestOperation *setsOperation = nil;
    setsOperation = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request success:^(NSURLRequest *request, NSHTTPURLResponse *response, NSDictionary *JSON) {
        NSString *stringCount = response.allHeaderFields[@"X-Total-Count"];
        NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
        [formatter setNumberStyle:NSNumberFormatterDecimalStyle];
        NSNumber *count = [formatter numberFromString:stringCount];

        if (count) {
            if (success) {
                success(count);
            }
        } else {
            if (failure) {
                failure(nil);
            }
        }

    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        if (failure) {
            failure(error);
        }
    }];

    [setsOperation start];
}

@end
