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
export type FairExhibitorsTestsQuery = {
    readonly response: FairExhibitorsTestsQueryResponse;
    readonly variables: FairExhibitorsTestsQueryVariables;
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
(node as any).hash = '02dbd95ae31b367685e9949b7339cd4b';
export default node;
