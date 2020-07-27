/* tslint:disable */
/* eslint-disable */
/* @relayHash af47ebb67dd634085643f531a22a2e00 */

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
            readonly id: string | null;
            readonly internalID: string;
            readonly isFollowed: boolean | null;
        }) | null;
        readonly counts: ({
            readonly eligibleArtworks: number | null;
        }) | null;
        readonly internalID: string;
        readonly slug: string;
        readonly id: string | null;
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
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PartnerHeaderTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": "partner(id:\"gagosian\")",
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "PartnerHeader_partner",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PartnerHeaderTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": "partner(id:\"gagosian\")",
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "profile",
            "storageKey": null,
            "args": null,
            "concreteType": "Profile",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isFollowed",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "PartnerCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "eligibleArtworks",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PartnerHeaderTestsQuery",
    "id": "b40a5708fe30e1c90843565893d045f7",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'd333b5c461fbfb6443bf11449f66f0e3';
export default node;
