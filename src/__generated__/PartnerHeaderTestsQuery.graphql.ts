/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerHeaderTestsQueryVariables = {};
export type PartnerHeaderTestsQueryResponse = {
    readonly partner: {
        readonly name: string | null;
        readonly profile: {
            readonly counts: {
                readonly follows: number | null;
            } | null;
        } | null;
        readonly counts: {
            readonly eligibleArtworks: number | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"PartnerFollowButton_partner">;
    } | null;
};
export type PartnerHeaderTestsQueryRawResponse = {
    readonly partner: ({
        readonly name: string | null;
        readonly profile: ({
            readonly counts: ({
                readonly follows: number | null;
            }) | null;
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
    name
    profile {
      counts {
        follows
      }
      id
    }
    counts {
      eligibleArtworks
    }
    ...PartnerFollowButton_partner
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
  "kind": "LinkedField",
  "alias": null,
  "name": "counts",
  "storageKey": null,
  "args": null,
  "concreteType": "ProfileCounts",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "follows",
      "args": null,
      "storageKey": null
    }
  ]
},
v3 = {
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
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
              (v2/*: any*/)
            ]
          },
          (v3/*: any*/),
          {
            "kind": "FragmentSpread",
            "name": "PartnerFollowButton_partner",
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
              (v2/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isFollowed",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v3/*: any*/),
          (v5/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          (v4/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PartnerHeaderTestsQuery",
    "id": "50b8791a8dc855f794b22a3753ebb509",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '7960246ed70a71eeee388cffec367df4';
export default node;
