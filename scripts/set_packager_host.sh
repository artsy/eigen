#!/usr/bin/env bash


# e.g. Davids-MacBook.local
host=$(hostname)

function can-reach-host () {
  ping -c1 -t1 $host
}

# sometimes hostnames are not resolvable.
if ! can-reach-host
then
  # so try local wifi IP instead
  host=$(ipconfig getifaddr en0)

  # if you're not connected via wifi, and you're feeling retro,
  # then you might be connected via ethernet?
  if ! can-reach-host
  then
    host=$(ipconfig getifaddr en1)

    # otherwise you're probably not connected to the internet 🤷‍♀️
    if ! can-reach-host
    then
      host=localhost
    fi
  fi
fi


OUTPUT=$(cat << EOF
// this file is generated automatically in a build phase
#import "ARReactPackagerHost.h"
#import <Foundation/Foundation.h>

@implementation ARReactPackagerHost

+ (NSString *)hostname
{
#if defined(DEBUG)
    return @"$host";
#else
    return @"localhost";
#endif
}

@end
EOF)

echo "$OUTPUT" > Artsy/Networking/ARReactPackagerHost.m
