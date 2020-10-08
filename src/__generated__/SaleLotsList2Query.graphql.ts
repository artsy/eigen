/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 63ab8807f748d53c9be859d055422012 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList2QueryVariables = {
    count: number;
    cursor?: string | null;
};
export type SaleLotsList2QueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList2_saleArtworksConnection">;
};
export type SaleLotsList2QueryRawResponse = {
    readonly saleArtworksConnection: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly title: string | null;
                readonly id: string;
                readonly __typename: "Artwork";
            }) | null;
            readonly cursor: string | null;
            readonly id: string;
        }) | null> | null;
        readonly totalCount: number | null;
        readonly pageInfo: {
            readonly endCursor: string | null;
            readonly hasNextPage: boolean;
        };
    }) | null;
};
export type SaleLotsList2Query = {
    readonly response: SaleLotsList2QueryResponse;
    readonly variables: SaleLotsList2QueryVariables;
    readonly rawResponse: SaleLotsList2QueryRawResponse;
};



/*
query SaleLotsList2Query(
  $count: Int!
  $cursor: String
) {
  ...SaleLotsList2_saleArtworksConnection_1G22uz
}

fragment SaleLotsList2_saleArtworksConnection_1G22uz on Query {
  saleArtworksConnection(first: $count, after: $cursor) {
    edges {
      node {
        title
        id
        __typename
      }
      cursor
      id
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SaleLotsList2Query",
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
          }
        ],
        "kind": "FragmentSpread",
        "name": "SaleLotsList2_saleArtworksConnection"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SaleLotsList2Query",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SaleArtworksConnection",
        "kind": "LinkedField",
        "name": "saleArtworksConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SaleArtwork",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Artwork",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
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
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalCount",
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
        "alias": null,
        "args": (v1/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "SaleLotsList2_saleArtworksConnection",
        "kind": "LinkedHandle",
        "name": "saleArtworksConnection"
      }
    ]
  },
  "params": {
    "id": "63ab8807f748d53c9be859d055422012",
    "metadata": {},
    "name": "SaleLotsList2Query",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b3ba4c9a6b71a7b56095b5dbd492849e';
export default node;
