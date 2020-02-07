/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RequestConditionReportQueryVariables = {
    artworkID: string;
};
export type RequestConditionReportQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"RequestConditionReport_me">;
    } | null;
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"RequestConditionReport_artwork">;
    } | null;
};
export type RequestConditionReportQuery = {
    readonly response: RequestConditionReportQueryResponse;
    readonly variables: RequestConditionReportQueryVariables;
};



/*
query RequestConditionReportQuery(
  $artworkID: String!
) {
  me {
    ...RequestConditionReport_me
    id
  }
  artwork(id: $artworkID) {
    ...RequestConditionReport_artwork
    id
  }
}

fragment RequestConditionReport_me on Me {
  email
  internalID
}

fragment RequestConditionReport_artwork on Artwork {
  internalID
  slug
  saleArtwork {
    internalID
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artworkID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "RequestConditionReportQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "RequestConditionReport_me",
            "args": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "RequestConditionReport_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "RequestConditionReportQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "email",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "saleArtwork",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleArtwork",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "RequestConditionReportQuery",
    "id": "c4071a0d7c31ccc4a1c6ceba9bda34ce",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '0d2ee5d88aac80c1d2e6a2b1fd592924';
export default node;
