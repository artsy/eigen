/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash e7f9de7dcd788f850b7cfa7601d233bd */

import { ConcreteRequest } from "relay-runtime";
export type FairExhibitorsTestsQueryVariables = {};
export type FairExhibitorsTestsQueryResponse = {
    readonly fair: {
        readonly exhibitors_grouped_by_name: ReadonlyArray<{
            readonly letter: string | null;
            readonly exhibitors: ReadonlyArray<{
                readonly name: string | null;
                readonly slug: string;
                readonly profile_id: string | null;
            } | null> | null;
        } | null> | null;
    } | null;
};
export type FairExhibitorsTestsQueryRawResponse = {
    readonly fair: ({
        readonly exhibitors_grouped_by_name: ReadonlyArray<({
            readonly letter: string | null;
            readonly exhibitors: ReadonlyArray<({
                readonly name: string | null;
                readonly slug: string;
                readonly profile_id: string | null;
            }) | null> | null;
        }) | null> | null;
        readonly id: string;
    }) | null;
};
export type FairExhibitorsTestsQuery = {
    readonly response: FairExhibitorsTestsQueryResponse;
    readonly variables: FairExhibitorsTestsQueryVariables;
    readonly rawResponse: FairExhibitorsTestsQueryRawResponse;
};



/*
query FairExhibitorsTestsQuery {
  fair(id: "art-basel-in-miami-beach-2018") {
    exhibitors_grouped_by_name: exhibitorsGroupedByName {
      letter
      exhibitors {
        name
        slug
        profile_id: profileID
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "art-basel-in-miami-beach-2018"
  }
],
v1 = {
  "alias": "exhibitors_grouped_by_name",
  "args": null,
  "concreteType": "FairExhibitorsGroup",
  "kind": "LinkedField",
  "name": "exhibitorsGroupedByName",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "letter",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FairExhibitor",
      "kind": "LinkedField",
      "name": "exhibitors",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        },
        {
          "alias": "profile_id",
          "args": null,
          "kind": "ScalarField",
          "name": "profileID",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FairExhibitorsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ],
        "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FairExhibitorsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")"
      }
    ]
  },
  "params": {
    "id": "e7f9de7dcd788f850b7cfa7601d233bd",
    "metadata": {},
    "name": "FairExhibitorsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c0e071d0923d011a2eb340fda215c5b1';
export default node;
