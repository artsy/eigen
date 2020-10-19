/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d761eeff945579e4683a3915d26544eb */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollapsibleArtworkDetailsTestsQueryVariables = {};
export type CollapsibleArtworkDetailsTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"CollapsibleArtworkDetails_artwork">;
    } | null;
};
export type CollapsibleArtworkDetailsTestsQuery = {
    readonly response: CollapsibleArtworkDetailsTestsQueryResponse;
    readonly variables: CollapsibleArtworkDetailsTestsQueryVariables;
};



/*
query CollapsibleArtworkDetailsTestsQuery {
  artwork(id: "some-slug") {
    ...CollapsibleArtworkDetails_artwork
    id
  }
}

fragment CollapsibleArtworkDetails_artwork on Artwork {
  image {
    url
    width
    height
  }
  internalID
  title
  date
  saleMessage
  attributionClass {
    name
    id
  }
  category
  manufacturer
  publisher
  medium
  conditionDescription {
    details
  }
  certificateOfAuthenticity {
    details
  }
  framed {
    details
  }
  dimensions {
    in
    cm
  }
  signatureInfo {
    details
  }
  artistNames
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-slug"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "details",
    "storageKey": null
  }
],
v3 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v5 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ArtworkInfoRow"
},
v6 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CollapsibleArtworkDetailsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "CollapsibleArtworkDetails_artwork"
          }
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CollapsibleArtworkDetailsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "image",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "width",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "height",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "date",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "saleMessage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "AttributionClass",
            "kind": "LinkedField",
            "name": "attributionClass",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "manufacturer",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "publisher",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "medium",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "kind": "LinkedField",
            "name": "conditionDescription",
            "plural": false,
            "selections": (v2/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "kind": "LinkedField",
            "name": "certificateOfAuthenticity",
            "plural": false,
            "selections": (v2/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "kind": "LinkedField",
            "name": "framed",
            "plural": false,
            "selections": (v2/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "dimensions",
            "kind": "LinkedField",
            "name": "dimensions",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "in",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cm",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "kind": "LinkedField",
            "name": "signatureInfo",
            "plural": false,
            "selections": (v2/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "artistNames",
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
    "id": "d761eeff945579e4683a3915d26544eb",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.artistNames": (v3/*: any*/),
        "artwork.attributionClass": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AttributionClass"
        },
        "artwork.attributionClass.id": (v4/*: any*/),
        "artwork.attributionClass.name": (v3/*: any*/),
        "artwork.category": (v3/*: any*/),
        "artwork.certificateOfAuthenticity": (v5/*: any*/),
        "artwork.certificateOfAuthenticity.details": (v3/*: any*/),
        "artwork.conditionDescription": (v5/*: any*/),
        "artwork.conditionDescription.details": (v3/*: any*/),
        "artwork.date": (v3/*: any*/),
        "artwork.dimensions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "dimensions"
        },
        "artwork.dimensions.cm": (v3/*: any*/),
        "artwork.dimensions.in": (v3/*: any*/),
        "artwork.framed": (v5/*: any*/),
        "artwork.framed.details": (v3/*: any*/),
        "artwork.id": (v4/*: any*/),
        "artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "artwork.image.height": (v6/*: any*/),
        "artwork.image.url": (v3/*: any*/),
        "artwork.image.width": (v6/*: any*/),
        "artwork.internalID": (v4/*: any*/),
        "artwork.manufacturer": (v3/*: any*/),
        "artwork.medium": (v3/*: any*/),
        "artwork.publisher": (v3/*: any*/),
        "artwork.saleMessage": (v3/*: any*/),
        "artwork.signatureInfo": (v5/*: any*/),
        "artwork.signatureInfo.details": (v3/*: any*/),
        "artwork.title": (v3/*: any*/)
      }
    },
    "name": "CollapsibleArtworkDetailsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ca3435da06aec7fe9c3034a231cbb78e';
export default node;
