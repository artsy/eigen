/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f89058226e8d41b3e432b966e4be1fd1 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeaturedArtistsTestsQueryVariables = {};
export type FeaturedArtistsTestsQueryResponse = {
    readonly marketingCollection: {
        readonly " $fragmentRefs": FragmentRefs<"FeaturedArtists_collection">;
    } | null;
};
export type FeaturedArtistsTestsQueryRawResponse = {
    readonly marketingCollection: ({
        readonly slug: string;
        readonly artworksConnection: ({
            readonly merchandisableArtists: ReadonlyArray<({
                readonly internalID: string;
                readonly id: string;
                readonly slug: string;
                readonly name: string | null;
                readonly initials: string | null;
                readonly href: string | null;
                readonly is_followed: boolean | null;
                readonly nationality: string | null;
                readonly birthday: string | null;
                readonly deathday: string | null;
                readonly image: ({
                    readonly url: string | null;
                }) | null;
            }) | null> | null;
            readonly id: string;
        }) | null;
        readonly query: {
            readonly artistIDs: ReadonlyArray<string> | null;
            readonly id: string | null;
        };
        readonly featuredArtistExclusionIds: ReadonlyArray<string> | null;
        readonly id: string;
    }) | null;
};
export type FeaturedArtistsTestsQuery = {
    readonly response: FeaturedArtistsTestsQueryResponse;
    readonly variables: FeaturedArtistsTestsQueryVariables;
    readonly rawResponse: FeaturedArtistsTestsQueryRawResponse;
};



/*
query FeaturedArtistsTestsQuery {
  marketingCollection(slug: "emerging-photographers") {
    ...FeaturedArtists_collection
    id
  }
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment FeaturedArtists_collection on MarketingCollection {
  slug
  artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 0, sort: "-decayed_merch") {
    merchandisableArtists(size: 4) {
      internalID
      ...ArtistListItem_artist
      id
    }
    id
  }
  query {
    artistIDs
    id
  }
  featuredArtistExclusionIds
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slug",
    "value": "emerging-photographers"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FeaturedArtistsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FeaturedArtists_collection"
          }
        ],
        "storageKey": "marketingCollection(slug:\"emerging-photographers\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FeaturedArtistsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MERCHANDISABLE_ARTISTS"
                ]
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 0
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "-decayed_merch"
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "artworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 4
                  }
                ],
                "concreteType": "Artist",
                "kind": "LinkedField",
                "name": "merchandisableArtists",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "internalID",
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "initials",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "href",
                    "storageKey": null
                  },
                  {
                    "alias": "is_followed",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFollowed",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "nationality",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "birthday",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "deathday",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Image",
                    "kind": "LinkedField",
                    "name": "image",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "url",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "merchandisableArtists(size:4)"
              },
              (v2/*: any*/)
            ],
            "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:0,sort:\"-decayed_merch\")"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "MarketingCollectionQuery",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "artistIDs",
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "featuredArtistExclusionIds",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": "marketingCollection(slug:\"emerging-photographers\")"
      }
    ]
  },
  "params": {
    "id": "f89058226e8d41b3e432b966e4be1fd1",
    "metadata": {},
    "name": "FeaturedArtistsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b052d942acd32e0160c794935f46ac33';
export default node;
