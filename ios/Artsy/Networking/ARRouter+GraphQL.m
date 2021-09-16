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

#pragma mark - Public Functions

+ (NSString *)graphQLQueryForLiveSaleStaticData:(NSString *)saleID role:(NSString *)causalityRole
{
    return [NSString stringWithFormat:[self graphQLFileNamed:@"static_sale_data"], causalityRole, saleID, saleID];
}

@end

#pragma clang dianostic pop
