/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairExhibitors_fair$ref } from "./FairExhibitors_fair.graphql";
export type FairExhibitorsTestsQueryVariables = {};
export type FairExhibitorsTestsQueryResponse = {
    readonly fair: ({
        readonly " $fragmentRefs": FairExhibitors_fair$ref;
    }) | null;
};
export type FairExhibitorsTestsQuery = {
    readonly response: FairExhibitorsTestsQueryResponse;
    readonly variables: FairExhibitorsTestsQueryVariables;
};



/*
query FairExhibitorsTestsQuery {
  fair(id: "art-basel-in-miami-beach-2018") {
    ...FairExhibitors_fair
    __id
  }
}

fragment FairExhibitors_fair on Fair {
  exhibitors_grouped_by_name {
    letter
    exhibitors
  }
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "art-basel-in-miami-beach-2018",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairExhibitorsTestsQuery",
  "id": "ae4881bc22e6c72481ffe52aefd8292a",
  "text": null,
  "metadata": {},
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
        "args": v0,
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairExhibitors_fair",
            "args": null
          },
          v1
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
        "args": v0,
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "exhibitors_grouped_by_name",
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
                "kind": "ScalarField",
                "alias": null,
                "name": "exhibitors",
                "args": null,
                "storageKey": null
              }
            ]
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = '44469da8cf77a168bec679741ab439a8';
export default node;
