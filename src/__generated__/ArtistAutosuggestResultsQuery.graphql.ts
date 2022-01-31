/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2d4b3d39446dffcb0d17aa6fe59201dd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SearchEntity = "ARTICLE" | "ARTIST" | "ARTIST_SERIES" | "ARTWORK" | "CITY" | "COLLECTION" | "FAIR" | "FEATURE" | "GALLERY" | "GENE" | "INSTITUTION" | "PAGE" | "PROFILE" | "SALE" | "SHOW" | "TAG" | "VIEWING_ROOM" | "%future added value";
export type ArtistAutosuggestResultsQueryVariables = {
    query: string;
    count: number;
    entities?: Array<SearchEntity | null> | null | undefined;
};
export type ArtistAutosuggestResultsQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"ArtistAutosuggestResults_results">;
};
export type ArtistAutosuggestResultsQueryRawResponse = {
    readonly results: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly __typename: "SearchableItem";
                readonly __isNode: "SearchableItem";
                readonly id: string;
                readonly internalID: string;
                readonly displayType: string | null;
                readonly slug: string;
            } | {
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly __typename: "Artist";
                readonly __isNode: "Artist";
                readonly id: string;
                readonly internalID: string;
                readonly formattedNationalityAndBirthday: string | null;
                readonly slug: string;
                readonly statuses: ({
                    readonly artworks: boolean | null;
                    readonly auctionLots: boolean | null;
                }) | null;
            } | {
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly __typename: string;
                readonly __isNode: string;
                readonly id: string;
            }) | null;
            readonly cursor: string;
        }) | null> | null;
        readonly pageInfo: {
            readonly endCursor: string | null;
            readonly hasNextPage: boolean;
        };
    }) | null;
};
export type ArtistAutosuggestResultsQuery = {
    readonly response: ArtistAutosuggestResultsQueryResponse;
    readonly variables: ArtistAutosuggestResultsQueryVariables;
    readonly rawResponse: ArtistAutosuggestResultsQueryRawResponse;
};



/*
query ArtistAutosuggestResultsQuery(
  $query: String!
  $count: Int!
  $entities: [SearchEntity]
) {
  ...ArtistAutosuggestResults_results_2KyZFR
}

fragment ArtistAutosuggestResults_results_2KyZFR on Query {
  results: searchConnection(query: $query, mode: AUTOSUGGEST, first: $count, entities: $entities) {
    edges {
      node {
        imageUrl
        href
        displayLabel
        __typename
        ... on SearchableItem {
          internalID
          displayType
          slug
        }
        ... on Artist {
          internalID
          formattedNationalityAndBirthday
          slug
          statuses {
            artworks
            auctionLots
          }
        }
        ... on Node {
          __isNode: __typename
          id
        }
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "entities"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v3 = {
  "kind": "Variable",
  "name": "entities",
  "variableName": "entities"
},
v4 = {
  "kind": "Variable",
  "name": "query",
  "variableName": "query"
},
v5 = [
  (v3/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Literal",
    "name": "mode",
    "value": "AUTOSUGGEST"
  },
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistAutosuggestResultsQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "ArtistAutosuggestResults_results"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "ArtistAutosuggestResultsQuery",
    "selections": [
      {
        "alias": "results",
        "args": (v5/*: any*/),
        "concreteType": "SearchableConnection",
        "kind": "LinkedField",
        "name": "searchConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SearchableEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "imageUrl",
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
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "displayLabel",
                    "storageKey": null
                  },
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
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "displayType",
                        "storageKey": null
                      },
                      (v7/*: any*/)
                    ],
                    "type": "SearchableItem",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "formattedNationalityAndBirthday",
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtistStatuses",
                        "kind": "LinkedField",
                        "name": "statuses",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artworks",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "auctionLots",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "Artist",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "id",
                        "storageKey": null
                      }
                    ],
                    "type": "Node",
                    "abstractKey": "__isNode"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": "results",
        "args": (v5/*: any*/),
        "filters": [
          "query",
          "mode",
          "entities"
        ],
        "handle": "connection",
        "key": "ArtistAutosuggestResults_results",
        "kind": "LinkedHandle",
        "name": "searchConnection"
      }
    ]
  },
  "params": {
    "id": "2d4b3d39446dffcb0d17aa6fe59201dd",
    "metadata": {},
    "name": "ArtistAutosuggestResultsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '4e8933078d42c6443c8a56f640a1f0a0';
export default node;
