#import "AFHTTPRequestOperation+JSON.h"

#import <AFNetworking/AFNetworking.h>

SpecBegin(AFHTTPRequestOperationJSONTests)

NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://example.com"]];

it(@"defaults to not removing nulls", ^{
    id operation = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request success:nil failure:nil];
    expect([(AFJSONResponseSerializer *)[operation responseSerializer] removesKeysWithNullValues]).to.beFalsy();
});

it(@"removes nulls when specified to", ^{
    id operation = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request removeNulls:YES success:nil failure:nil];
    expect([(AFJSONResponseSerializer *)[operation responseSerializer] removesKeysWithNullValues]).to.beTruthy();
});

SpecEnd
