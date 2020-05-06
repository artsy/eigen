/* tslint:disable */
/* eslint-disable */
/* @relayHash 31081638cba7b08be0554cdbf4e4c0cc */

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
            readonly id: string | null;
            readonly name: string | null;
            readonly slug: string;
            readonly href: string | null;
        } | {
            readonly __typename: string | null;
            readonly id: string | null;
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
                        readonly id: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly artists: ReadonlyArray<({
            readonly name: string | null;
            readonly href: string | null;
            readonly slug: string;
            readonly internalID: string;
            readonly id: string | null;
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
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": "aspect_ratio",
    "name": "aspectRatio",
    "args": null,
    "storageKey": null
  }
],
v7 = [
  (v4/*: any*/),
  (v5/*: any*/),
  (v1/*: any*/),
  (v2/*: any*/),
  (v3/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ShowHeaderTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ShowHeader_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowHeaderTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "is_followed",
            "name": "isFollowed",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "end_at",
            "name": "endAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "exhibition_period",
            "name": "exhibitionPeriod",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isStubShow",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  (v4/*: any*/),
                  (v1/*: any*/),
                  (v5/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "coverImage",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": (v6/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": (v6/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "followedArtists",
            "name": "followedArtistsConnection",
            "storageKey": "followedArtistsConnection(first:3)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
              }
            ],
            "concreteType": "ShowFollowArtistConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ShowFollowArtistEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ShowFollowArtist",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artist",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": (v7/*: any*/)
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": (v7/*: any*/)
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ShowHeaderTestsQuery",
    "id": "bb10a56675e4df207e89205d5bf7999a",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cfe79d79e242f25d6e6ad560903c7e1e';
export default node;
