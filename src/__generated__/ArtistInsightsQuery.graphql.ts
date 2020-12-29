/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f82bb93242231b32808570dd4ce28099 */

import { ConcreteRequest } from "relay-runtime";
export type ArtistInsightsQueryVariables = {
    artistInternalID: string;
    medium: string;
};
export type ArtistInsightsQueryResponse = {
    readonly marketPriceInsights: {
        readonly annualLotsSold: number | null;
        readonly annualValueSoldCents: unknown | null;
        readonly medianSaleToEstimateRatio: number | null;
        readonly sellThroughRate: number | null;
    } | null;
};
export type ArtistInsightsQuery = {
    readonly response: ArtistInsightsQueryResponse;
    readonly variables: ArtistInsightsQueryVariables;
};



/*
query ArtistInsightsQuery(
  $artistInternalID: ID!
  $medium: String!
) {
  marketPriceInsights(artistId: $artistInternalID, medium: $medium) {
    annualLotsSold
    annualValueSoldCents
    medianSaleToEstimateRatio
    sellThroughRate
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artistInternalID"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "medium"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "artistId",
        "variableName": "artistInternalID"
      },
      {
        "kind": "Variable",
        "name": "medium",
        "variableName": "medium"
      }
    ],
    "concreteType": "MarketPriceInsights",
    "kind": "LinkedField",
    "name": "marketPriceInsights",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "annualLotsSold",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "annualValueSoldCents",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "medianSaleToEstimateRatio",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "sellThroughRate",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistInsightsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistInsightsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "f82bb93242231b32808570dd4ce28099",
    "metadata": {},
    "name": "ArtistInsightsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '86658600297aef928a5c6d356c076b03';
export default node;
