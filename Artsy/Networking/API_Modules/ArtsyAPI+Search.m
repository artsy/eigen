#import "ARLogger.h"
#import "ArtsyAPI+Search.h"

#import "Artist.h"
#import "Gene.h"
#import "ARRouter.h"
#import "SearchResult.h"
#import "SearchSuggestion.h"

#import "MTLModel+JSON.h"
#import "AFHTTPRequestOperation+JSON.h"

static NSString *
EnsureQuery(NSString *query) {
    if (query) {
        NSString *trimmed = [query stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
        if (trimmed.length > 0) {
            return trimmed;
        }
    }
    return nil;
}

@implementation ArtsyAPI (Search)

+ (AFHTTPRequestOperation *)searchWithQuery:(NSString *)query success:(void (^)(NSArray *results))success failure:(void (^)(NSError *error))failure
{
    NSString *_query = EnsureQuery(query);
    if (!_query) {
        return nil;
    }

    NSParameterAssert(success);

    NSURLRequest *request = [ARRouter newSearchRequestWithQuery:_query];
    AFHTTPRequestOperation *searchOperation = nil;
    searchOperation = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
        NSArray *jsonDictionaries = JSON;
        NSMutableArray *returnArray = [NSMutableArray array];
        
        // use "new" suggest API which has all data in response
        for (NSDictionary *dictionary in jsonDictionaries) {
            NSError *error = nil;
            if ([SearchSuggestion searchResultIsSupported:dictionary]) {
                
                id result = [SearchSuggestion.class modelWithJSON:dictionary error:&error];
                
                if (error) {
                    ARErrorLog(@"Error creating search result. Error: %@", error.localizedDescription);
                } else {
                    [returnArray addObject:result];
                }
            }
        }
        
        success(returnArray);

    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        if (failure) {
            failure(error);
        }
    }];

    [searchOperation start];
    return searchOperation;
}

+ (AFHTTPRequestOperation *)artistSearchWithQuery:(NSString *)query excluding:(NSArray *)artistsToExclude success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    NSString *_query = EnsureQuery(query);
    if (!_query) {
        return nil;
    }
    
    NSParameterAssert(success);

    NSURLRequest *request = [ARRouter newArtistSearchRequestWithQuery:_query excluding:artistsToExclude];
    AFHTTPRequestOperation *searchOperation = nil;
    searchOperation = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
        NSArray *jsonDictionaries = JSON;
        NSMutableArray *returnArray = [NSMutableArray array];

        for (NSDictionary *dictionary in jsonDictionaries) {
            NSError *error = nil;
            Artist *result = [Artist modelWithJSON:dictionary error:&error];
            if (error) {
                ARErrorLog(@"Error creating search result. Error: %@", error.localizedDescription);
            } else {
                [returnArray addObject:result];
            }
        }

        success(returnArray);

    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        if (failure) {
            failure(error);
        }
    }];

    [searchOperation start];
    return searchOperation;
}

+ (AFHTTPRequestOperation *)geneSearchWithQuery:(NSString *)query excluding:(NSArray *)genesToExclude success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    NSString *_query = EnsureQuery(query);
    if (!_query) {
        return nil;
    }

    NSParameterAssert(success);

    NSURLRequest *request = [ARRouter newGeneSearchRequestWithQuery:_query excluding:genesToExclude];
    AFHTTPRequestOperation *searchOperation = nil;
    searchOperation = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
        NSArray *jsonDictionaries = JSON;
        NSMutableArray *returnArray = [NSMutableArray array];
        
        for (NSDictionary *dictionary in jsonDictionaries) {
            NSError *error = nil;
            Gene *result = [Gene modelWithJSON:dictionary error:&error];
            if (error) {
                ARErrorLog(@"Error creating search result. Error: %@", error.localizedDescription);
            } else {
                [returnArray addObject:result];
            }
        }
        
        success(returnArray);

    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        if (failure) {
            failure(error);
        }
    }];

    [searchOperation start];
    return searchOperation;
}

@end
