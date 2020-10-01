/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b40a5708fe30e1c90843565893d045f7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerHeaderTestsQueryVariables = {};
export type PartnerHeaderTestsQueryResponse = {
    readonly partner: {
        readonly " $fragmentRefs": FragmentRefs<"PartnerHeader_partner">;
    } | null;
};
export type PartnerHeaderTestsQueryRawResponse = {
    readonly partner: ({
        readonly name: string | null;
        readonly profile: ({
            readonly name: string | null;
            readonly id: string;
            readonly internalID: string;
            readonly isFollowed: boolean | null;
        }) | null;
        readonly counts: ({
            readonly eligibleArtworks: number | null;
        }) | null;
        readonly internalID: string;
        readonly slug: string;
        readonly id: string;
    }) | null;
};
export type PartnerHeaderTestsQuery = {
    readonly response: PartnerHeaderTestsQueryResponse;
    readonly variables: PartnerHeaderTestsQueryVariables;
    readonly rawResponse: PartnerHeaderTestsQueryRawResponse;
};



/*
query PartnerHeaderTestsQuery {
  partner(id: "gagosian") {
    ...PartnerHeader_partner
    id
  }
}

fragment PartnerFollowButton_partner on Partner {
  internalID
  slug
  profile {
    id
    internalID
    isFollowed
  }
}

fragment PartnerHeader_partner on Partner {
  name
  profile {
    name
    id
  }
  counts {
    eligibleArtworks
  }
  ...PartnerFollowButton_partner
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "gagosian"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PartnerHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PartnerHeader_partner"
          }
        ],
        "storageKey": "partner(id:\"gagosian\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PartnerHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Profile",
            "kind": "LinkedField",
            "name": "profile",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isFollowed",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PartnerCounts",
            "kind": "LinkedField",
            "name": "counts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "eligibleArtworks",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": "partner(id:\"gagosian\")"
      }
    ]
  },
  "params": {
    "id": "b40a5708fe30e1c90843565893d045f7",
    "metadata": {},
    "name": "PartnerHeaderTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'd333b5c461fbfb6443bf11449f66f0e3';
export default node;
