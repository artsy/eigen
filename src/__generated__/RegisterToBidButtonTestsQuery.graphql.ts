/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 93a087a79cbe5158b05f903a5c795ccd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegisterToBidButtonTestsQueryVariables = {
    saleID: string;
};
export type RegisterToBidButtonTestsQueryResponse = {
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"RegisterToBidButton_sale">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"RegisterToBidButton_me">;
    } | null;
};
export type RegisterToBidButtonTestsQuery = {
    readonly response: RegisterToBidButtonTestsQueryResponse;
    readonly variables: RegisterToBidButtonTestsQueryVariables;
};



/*
query RegisterToBidButtonTestsQuery(
  $saleID: String!
) {
  sale(id: "the-sale") {
    ...RegisterToBidButton_sale
    id
  }
  me {
    ...RegisterToBidButton_me_nfIph
    id
  }
}

fragment RegisterToBidButton_me_nfIph on Me {
  biddedLots: lotStandings(saleID: $saleID) {
    saleArtwork {
      id
    }
  }
}

fragment RegisterToBidButton_sale on Sale {
  slug
  startAt
  endAt
  internalID
  requireIdentityVerification
  registrationStatus {
    qualifiedForBidding
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "saleID"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "the-sale"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "saleID",
    "variableName": "saleID"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v5 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v6 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RegisterToBidButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RegisterToBidButton_sale"
          }
        ],
        "storageKey": "sale(id:\"the-sale\")"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": (v2/*: any*/),
            "kind": "FragmentSpread",
            "name": "RegisterToBidButton_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RegisterToBidButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "endAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "requireIdentityVerification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "registrationStatus",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "qualifiedForBidding",
                "storageKey": null
              },
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": "sale(id:\"the-sale\")"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": "biddedLots",
            "args": (v2/*: any*/),
            "concreteType": "LotStanding",
            "kind": "LinkedField",
            "name": "lotStandings",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtwork",
                "kind": "LinkedField",
                "name": "saleArtwork",
                "plural": false,
                "selections": [
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "93a087a79cbe5158b05f903a5c795ccd",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.biddedLots": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "LotStanding"
        },
        "me.biddedLots.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "me.biddedLots.saleArtwork.id": (v4/*: any*/),
        "me.id": (v4/*: any*/),
        "sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "sale.endAt": (v5/*: any*/),
        "sale.id": (v4/*: any*/),
        "sale.internalID": (v4/*: any*/),
        "sale.registrationStatus": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Bidder"
        },
        "sale.registrationStatus.id": (v4/*: any*/),
        "sale.registrationStatus.qualifiedForBidding": (v6/*: any*/),
        "sale.requireIdentityVerification": (v6/*: any*/),
        "sale.slug": (v4/*: any*/),
        "sale.startAt": (v5/*: any*/)
      }
    },
    "name": "RegisterToBidButtonTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b6803ed98b2cf2b0235ac068bd5352a3';
export default node;
