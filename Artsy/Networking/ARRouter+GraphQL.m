#import "ARRouter+GraphQL.h"

// Required to use stringWithFormat on non-literal strings (we load them from the bundle, so it should be secure).
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wformat-nonliteral"
#pragma clang diagnostic ignored "-Wformat"

@implementation ARRouter(GraphQL)

#pragma mark - Private Functions

+ (NSString *)graphQLFileNamed:(NSString *)filename
{
    NSURL *url = [[NSBundle bundleForClass:self] URLForResource:filename withExtension:@"graphql"];
    return [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:nil];
}

+ (NSString *)graphQLQueryForFavoriteArtworksAndPositionParam:(NSString *)pageString
{
    return [NSString stringWithFormat:[self graphQLFileNamed:@"favorites"], pageString];
}

#pragma mark - Public Functions

+ (NSString *)graphQueryForFavorites
{
    return [self graphQLQueryForFavoriteArtworksAndPositionParam:@"first: 15"];
}

+ (NSString *)graphQueryForFavoritesAfter:(NSString *)cursor
{
    return [self graphQLQueryForFavoriteArtworksAndPositionParam:[NSString stringWithFormat:@"first: 15, after: \"%@\"", cursor]];
}

+ (NSString *)graphQueryForArtworksInSale:(NSString *)saleID
{
    return [NSString stringWithFormat:[self graphQLFileNamed:@"artworks_in_sale"], saleID];
}

+ (NSString *)graphQLQueryForLiveSaleStaticData:(NSString *)saleID role:(NSString *)causalityRole
{
    return [NSString stringWithFormat:[self graphQLFileNamed:@"static_sale_data"], causalityRole, saleID, saleID];
}

+ (NSString *)graphQueryForConversations
{
    return [NSString stringWithFormat:[self graphQLFileNamed:@"conversations"], @"10"];
}

@end

#pragma clang dianostic pop
