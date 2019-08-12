/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CommercialButtons_artwork$ref } from "./CommercialButtons_artwork.graphql";
export type CommercialButtonsTestsQueryVariables = {};
export type CommercialButtonsTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": CommercialButtons_artwork$ref;
    } | null;
};
export type CommercialButtonsTestsQuery = {
    readonly response: CommercialButtonsTestsQueryResponse;
    readonly variables: CommercialButtonsTestsQueryVariables;
};



/*
query CommercialButtonsTestsQuery {
  artwork(id: "artworkID") {
    ...CommercialButtons_artwork
    id
  }
}

fragment CommercialButtons_artwork on Artwork {
  slug
  internalID
  isAcquireable
  isOfferable
  isInquireable
  ...BuyNowButton_artwork
  ...MakeOfferButton_artwork
}

fragment BuyNowButton_artwork on Artwork {
  internalID
}

fragment MakeOfferButton_artwork on Artwork {
  internalID
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artworkID"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CommercialButtonsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"artworkID\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CommercialButtons_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CommercialButtonsTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"artworkID\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
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
            "name": "isAcquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isOfferable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isInquireable",
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
    "name": "CommercialButtonsTestsQuery",
    "id": "684c1d42157f7529b679b5135f36d766",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '2b427bbb203cd6882f406aa3f2ccf912';
export default node;
