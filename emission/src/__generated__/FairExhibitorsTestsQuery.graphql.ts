/* tslint:disable */

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
        readonly id: string | null;
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
  "kind": "LinkedField",
  "alias": "exhibitors_grouped_by_name",
  "name": "exhibitorsGroupedByName",
  "storageKey": null,
  "args": null,
  "concreteType": "FairExhibitorsGroup",
  "plural": true,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "letter",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "exhibitors",
      "storageKey": null,
      "args": null,
      "concreteType": "FairExhibitor",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "slug",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "profile_id",
          "name": "profileID",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FairExhibitorsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")",
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairExhibitorsTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")",
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FairExhibitorsTestsQuery",
    "id": "e7f9de7dcd788f850b7cfa7601d233bd",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c0e071d0923d011a2eb340fda215c5b1';
export default node;
