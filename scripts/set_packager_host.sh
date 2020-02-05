#!/usr/bin/env bash

OUTPUT=$(cat << EOF
// this file is generated automatically in a build phase
#import "ARReactPackagerHost.h"
#import <Foundation/Foundation.h>

@implementation ARReactPackagerHost

+ (NSString *)hostname
{
#if defined(DEBUG)
    return @"$(hostname)";
#else
    return @"localhost";
#endif
}

@end
EOF)

echo "$OUTPUT" > Artsy/Networking/ARReactPackagerHost.m
