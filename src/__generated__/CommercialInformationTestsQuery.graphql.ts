/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { CommercialInformation_artwork$ref } from "./CommercialInformation_artwork.graphql";
export type CommercialInformationTestsQueryVariables = {};
export type CommercialInformationTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": CommercialInformation_artwork$ref;
    } | null;
};
export type CommercialInformationTestsQuery = {
    readonly response: CommercialInformationTestsQueryResponse;
    readonly variables: CommercialInformationTestsQueryVariables;
};



/*
query CommercialInformationTestsQuery {
  artwork(id: "artworkID") {
    ...CommercialInformation_artwork
    id
  }
}

fragment CommercialInformation_artwork on Artwork {
  availability
  artists {
    is_consignable: isConsignable
    id
  }
  editionSets {
    isAcquireable
    isOfferable
    saleMessage
    id
  }
  saleMessage
  shippingInfo
  shippingOrigin
  isAcquireable
  isOfferable
  isInquireable
  ...CommercialButtons_artwork
  ...CommercialPartnerInformation_artwork
  ...CommercialEditionSetInformation_artwork
}

fragment CommercialButtons_artwork on Artwork {
  slug
  internalID
  isAcquireable
  isOfferable
  isInquireable
}

fragment CommercialPartnerInformation_artwork on Artwork {
  availability
  shippingOrigin
  shippingInfo
  partner {
    name
    id
  }
  sale {
    isAuction
    isClosed
    id
  }
}

fragment CommercialEditionSetInformation_artwork on Artwork {
  editionSets {
    internalID
    isAcquireable
    isOfferable
    saleMessage
    editionOf
    dimensions {
      in
      cm
    }
    id
  }
  ...CommercialPartnerInformation_artwork
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artworkID"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isAcquireable",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isOfferable",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "saleMessage",
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
    "name": "CommercialInformationTestsQuery",
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
            "name": "CommercialInformation_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CommercialInformationTestsQuery",
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
            "name": "availability",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": "is_consignable",
                "name": "isConsignable",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "editionSets",
            "storageKey": null,
            "args": null,
            "concreteType": "EditionSet",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v1/*: any*/),
              (v5/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "editionOf",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "dimensions",
                "storageKey": null,
                "args": null,
                "concreteType": "dimensions",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "in",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cm",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          (v4/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "shippingInfo",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "shippingOrigin",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/),
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
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          (v5/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": "Partner",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sale",
            "storageKey": null,
            "args": null,
            "concreteType": "Sale",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isAuction",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isClosed",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CommercialInformationTestsQuery",
    "id": "4c0d4f2d538bd65aef3c2e85ea112569",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'f16ee1b3d985ffd6b681125841b3dd00';
export default node;
