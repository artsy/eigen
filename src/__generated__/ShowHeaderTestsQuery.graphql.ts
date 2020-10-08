/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash aa862645599a844fd4d13ab1ecb7cbe0 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowHeaderTestsQueryVariables = {};
export type ShowHeaderTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"ShowHeader_show">;
    } | null;
};
export type ShowHeaderTestsQueryRawResponse = {
    readonly show: ({
        readonly slug: string;
        readonly internalID: string;
        readonly id: string;
        readonly name: string | null;
        readonly is_followed: boolean | null;
        readonly end_at: string | null;
        readonly exhibition_period: string | null;
        readonly isStubShow: boolean | null;
        readonly partner: ({
            readonly __typename: "Partner";
            readonly __isNode: "Partner";
            readonly id: string;
            readonly name: string | null;
            readonly slug: string;
            readonly href: string | null;
        } | {
            readonly __typename: "ExternalPartner";
            readonly __isNode: "ExternalPartner";
            readonly id: string;
        } | {
            readonly __typename: string;
            readonly __isNode: string;
            readonly id: string;
        }) | null;
        readonly coverImage: ({
            readonly url: string | null;
            readonly aspect_ratio: number;
        }) | null;
        readonly images: ReadonlyArray<({
            readonly url: string | null;
            readonly aspect_ratio: number;
        }) | null> | null;
        readonly followedArtists: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly artist: ({
                        readonly name: string | null;
                        readonly href: string | null;
                        readonly slug: string;
                        readonly internalID: string;
                        readonly id: string;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly artists: ReadonlyArray<({
            readonly name: string | null;
            readonly href: string | null;
            readonly slug: string;
            readonly internalID: string;
            readonly id: string;
        }) | null> | null;
    }) | null;
};
export type ShowHeaderTestsQuery = {
    readonly response: ShowHeaderTestsQueryResponse;
    readonly variables: ShowHeaderTestsQueryVariables;
    readonly rawResponse: ShowHeaderTestsQueryRawResponse;
};



/*
query ShowHeaderTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...ShowHeader_show
    id
  }
}

fragment ShowHeader_show on Show {
  slug
  internalID
  id
  name
  is_followed: isFollowed
  end_at: endAt
  exhibition_period: exhibitionPeriod
  isStubShow
  partner {
    __typename
    ... on Partner {
      name
      slug
      href
    }
    ... on Node {
      __isNode: __typename
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  coverImage {
    url
    aspect_ratio: aspectRatio
  }
  images {
    url
    aspect_ratio: aspectRatio
  }
  followedArtists: followedArtistsConnection(first: 3) {
    edges {
      node {
        artist {
          name
          href
          slug
          internalID
          id
        }
      }
    }
  }
  artists {
    name
    href
    slug
    internalID
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection"
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
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v6 = [
  (v3/*: any*/)
],
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  },
  {
    "alias": "aspect_ratio",
    "args": null,
    "kind": "ScalarField",
    "name": "aspectRatio",
    "storageKey": null
  }
],
v8 = [
  (v4/*: any*/),
  (v5/*: any*/),
  (v1/*: any*/),
  (v2/*: any*/),
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ShowHeader_show"
          }
        ],
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ShowHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": "is_followed",
            "args": null,
            "kind": "ScalarField",
            "name": "isFollowed",
            "storageKey": null
          },
          {
            "alias": "end_at",
            "args": null,
            "kind": "ScalarField",
            "name": "endAt",
            "storageKey": null
          },
          {
            "alias": "exhibition_period",
            "args": null,
            "kind": "ScalarField",
            "name": "exhibitionPeriod",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isStubShow",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "partner",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/),
                  (v1/*: any*/),
                  (v5/*: any*/)
                ],
                "type": "Partner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v6/*: any*/),
                "type": "Node",
                "abstractKey": "__isNode"
              },
              {
                "kind": "InlineFragment",
                "selections": (v6/*: any*/),
                "type": "ExternalPartner",
                "abstractKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "images",
            "plural": true,
            "selections": (v7/*: any*/),
            "storageKey": null
          },
          {
            "alias": "followedArtists",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
              }
            ],
            "concreteType": "ShowFollowArtistConnection",
            "kind": "LinkedField",
            "name": "followedArtistsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ShowFollowArtistEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ShowFollowArtist",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artist",
                        "plural": false,
                        "selections": (v8/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "followedArtistsConnection(first:3)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artists",
            "plural": true,
            "selections": (v8/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
      }
    ]
  },
  "params": {
    "id": "aa862645599a844fd4d13ab1ecb7cbe0",
    "metadata": {},
    "name": "ShowHeaderTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'cfe79d79e242f25d6e6ad560903c7e1e';
export default node;
