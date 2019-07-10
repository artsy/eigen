/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairMoreInfo_fair$ref } from "./FairMoreInfo_fair.graphql";
export type FairMoreInfoQueryVariables = {
    readonly fairID: string;
};
export type FairMoreInfoQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FairMoreInfo_fair$ref;
    } | null;
};
export type FairMoreInfoQuery = {
    readonly response: FairMoreInfoQueryResponse;
    readonly variables: FairMoreInfoQueryVariables;
};



/*
query FairMoreInfoQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...FairMoreInfo_fair
    id
  }
}

fragment FairMoreInfo_fair on Fair {
  organizer {
    website
  }
  gravityID
  internalID
  about
  ticketsLink
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "fairID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FairMoreInfoQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairMoreInfo_fair",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairMoreInfoQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "organizer",
            "storageKey": null,
            "args": null,
            "concreteType": "organizer",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "website",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "gravityID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "about",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "ticketsLink",
            "args": null,
            "storageKey": null
          },
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
    "name": "FairMoreInfoQuery",
    "id": "7d5a32c7a478e75020987bfbc0c09438",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '0d33371f2752f97b5a464b77a85efbeb';
export default node;
