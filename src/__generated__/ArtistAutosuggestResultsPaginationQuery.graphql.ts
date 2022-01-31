/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash a99f4c8a890a0dd536ebb9880569c0c6 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SearchEntity = "ARTICLE" | "ARTIST" | "ARTIST_SERIES" | "ARTWORK" | "CITY" | "COLLECTION" | "FAIR" | "FEATURE" | "GALLERY" | "GENE" | "INSTITUTION" | "PAGE" | "PROFILE" | "SALE" | "SHOW" | "TAG" | "VIEWING_ROOM" | "%future added value";
export type ArtistAutosuggestResultsPaginationQueryVariables = {
    query: string;
    count: number;
    cursor?: string | null | undefined;
    entities?: Array<SearchEntity | null> | null | undefined;
};
export type ArtistAutosuggestResultsPaginationQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"ArtistAutosuggestResults_results">;
};
export type ArtistAutosuggestResultsPaginationQueryRawResponse = {
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
export type ArtistAutosuggestResultsPaginationQuery = {
    readonly response: ArtistAutosuggestResultsPaginationQueryResponse;
    readonly variables: ArtistAutosuggestResultsPaginationQueryVariables;
    readonly rawResponse: ArtistAutosuggestResultsPaginationQueryRawResponse;
};



/*
query ArtistAutosuggestResultsPaginationQuery(
  $query: String!
  $count: Int!
  $cursor: String
  $entities: [SearchEntity]
) {
  ...ArtistAutosuggestResults_results_1qwknJ
}

fragment ArtistAutosuggestResults_results_1qwknJ on Query {
  results: searchConnection(query: $query, mode: AUTOSUGGEST, first: $count, after: $cursor, entities: $entities) {
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
  "name": "cursor"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "entities"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v4 = {
  "kind": "Variable",
  "name": "entities",
  "variableName": "entities"
},
v5 = {
  "kind": "Variable",
  "name": "query",
  "variableName": "query"
},
v6 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v4/*: any*/),
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
  (v5/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v8 = {
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
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistAutosuggestResultsPaginationQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v4/*: any*/),
          (v5/*: any*/)
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
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "ArtistAutosuggestResultsPaginationQuery",
    "selections": [
      {
        "alias": "results",
        "args": (v6/*: any*/),
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
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "displayType",
                        "storageKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "type": "SearchableItem",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "formattedNationalityAndBirthday",
                        "storageKey": null
                      },
                      (v8/*: any*/),
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
        "args": (v6/*: any*/),
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
    "id": "a99f4c8a890a0dd536ebb9880569c0c6",
    "metadata": {},
    "name": "ArtistAutosuggestResultsPaginationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '498ca6cedb2ec9d0d37085fdc368f1ba';
export default node;
