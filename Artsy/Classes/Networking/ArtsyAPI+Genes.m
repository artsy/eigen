#import "ArtsyAPI+Private.h"

@implementation ArtsyAPI (Genes)

+ (void)getGeneForGeneID:(NSString *)geneID success:(void (^)(id gene))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);
    [self getRequest:[ARRouter newGeneInfoRequestWithID:geneID] parseIntoAClass:[Gene class] success:success failure:failure];
}

@end
