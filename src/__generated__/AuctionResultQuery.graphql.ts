/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash e5732e5717b6f089589692083c636033 */

import { ConcreteRequest } from "relay-runtime";
export type AuctionResultQueryVariables = {
    auctionResultInternalID: string;
    artistID: string;
};
export type AuctionResultQueryResponse = {
    readonly auctionResult: {
        readonly internalID: string;
        readonly artistID: string;
        readonly boughtIn: boolean | null;
        readonly categoryText: string | null;
        readonly currency: string | null;
        readonly dateText: string | null;
        readonly description: string | null;
        readonly dimensions: {
            readonly height: number | null;
            readonly width: number | null;
        } | null;
        readonly dimensionText: string | null;
        readonly estimate: {
            readonly display: string | null;
            readonly high: number | null;
            readonly low: number | null;
        } | null;
        readonly images: {
            readonly thumbnail: {
                readonly url: string | null;
                readonly height: number | null;
                readonly width: number | null;
                readonly aspectRatio: number;
            } | null;
        } | null;
        readonly location: string | null;
        readonly mediumText: string | null;
        readonly organization: string | null;
        readonly performance: {
            readonly mid: string | null;
        } | null;
        readonly priceRealized: {
            readonly cents: number | null;
            readonly centsUSD: number | null;
            readonly display: string | null;
        } | null;
        readonly saleDate: string | null;
        readonly saleTitle: string | null;
        readonly title: string | null;
    } | null;
    readonly artist: {
        readonly name: string | null;
        readonly href: string | null;
    } | null;
};
export type AuctionResultQuery = {
    readonly response: AuctionResultQueryResponse;
    readonly variables: AuctionResultQueryVariables;
};



/*
query AuctionResultQuery(
  $auctionResultInternalID: String!
  $artistID: String!
) {
  auctionResult(id: $auctionResultInternalID) {
    internalID
    artistID
    boughtIn
    categoryText
    currency
    dateText
    description
    dimensions {
      height
      width
    }
    dimensionText
    estimate {
      display
      high
      low
    }
    images {
      thumbnail {
        url(version: "square140")
        height
        width
        aspectRatio
      }
    }
    location
    mediumText
    organization
    performance {
      mid
    }
    priceRealized {
      cents
      centsUSD
      display
    }
    saleDate
    saleTitle
    title
    id
  }
  artist(id: $artistID) {
    name
    href
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "artistID"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "auctionResultInternalID"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "auctionResultInternalID"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistID",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "boughtIn",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "categoryText",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currency",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dateText",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "AuctionLotDimensions",
  "kind": "LinkedField",
  "name": "dimensions",
  "plural": false,
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/)
  ],
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dimensionText",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "display",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "AuctionLotEstimate",
  "kind": "LinkedField",
  "name": "estimate",
  "plural": false,
  "selections": [
    (v14/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "high",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "low",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "AuctionLotImages",
  "kind": "LinkedField",
  "name": "images",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "thumbnail",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "square140"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"square140\")"
        },
        (v10/*: any*/),
        (v11/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "aspectRatio",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediumText",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "organization",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "AuctionLotPerformance",
  "kind": "LinkedField",
  "name": "performance",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mid",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "AuctionResultPriceRealized",
  "kind": "LinkedField",
  "name": "priceRealized",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "cents",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "centsUSD",
      "storageKey": null
    },
    (v14/*: any*/)
  ],
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleDate",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleTitle",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v25 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
],
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AuctionResultQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "AuctionResult",
        "kind": "LinkedField",
        "name": "auctionResult",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v25/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          (v26/*: any*/),
          (v27/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AuctionResultQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "AuctionResult",
        "kind": "LinkedField",
        "name": "auctionResult",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v24/*: any*/),
          (v28/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v25/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          (v26/*: any*/),
          (v27/*: any*/),
          (v28/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e5732e5717b6f089589692083c636033",
    "metadata": {},
    "name": "AuctionResultQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '197b6471d2cd60c6bd51f7fb5e778923';
export default node;
