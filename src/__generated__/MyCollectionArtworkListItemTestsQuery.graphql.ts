/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 90c6f7529d35f4f0478e1e4bca4fe7ba */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionArtworkListItemTestsQueryVariables = {};
export type MyCollectionArtworkListItemTestsQueryResponse = {
    readonly artwork: {
        readonly artist: {
            readonly internalID: string;
            readonly formattedNationalityAndBirthday: string | null;
        } | null;
        readonly artistNames: string | null;
        readonly category: string | null;
        readonly pricePaid: {
            readonly display: string | null;
            readonly minor: number;
            readonly currencyCode: string;
        } | null;
        readonly date: string | null;
        readonly depth: string | null;
        readonly editionSize: string | null;
        readonly editionNumber: string | null;
        readonly height: string | null;
        readonly attributionClass: {
            readonly name: string | null;
        } | null;
        readonly id: string;
        readonly images: ReadonlyArray<{
            readonly isDefault: boolean | null;
            readonly imageURL: string | null;
            readonly width: number | null;
            readonly height: number | null;
            readonly internalID: string | null;
        } | null> | null;
        readonly internalID: string;
        readonly isEdition: boolean | null;
        readonly medium: string | null;
        readonly metric: string | null;
        readonly artworkLocation: string | null;
        readonly provenance: string | null;
        readonly slug: string;
        readonly title: string | null;
        readonly width: string | null;
        readonly consignmentSubmission: {
            readonly inProgress: boolean | null;
        } | null;
    } | null;
};
export type MyCollectionArtworkListItemTestsQuery = {
    readonly response: MyCollectionArtworkListItemTestsQueryResponse;
    readonly variables: MyCollectionArtworkListItemTestsQueryVariables;
};



/*
query MyCollectionArtworkListItemTestsQuery {
  artwork(id: "some-slug") {
    artist {
      internalID
      formattedNationalityAndBirthday
      id
    }
    artistNames
    category
    pricePaid {
      display
      minor
      currencyCode
    }
    date
    depth
    editionSize
    editionNumber
    height
    attributionClass {
      name
      id
    }
    id
    images {
      isDefault
      imageURL
      width
      height
      internalID
    }
    internalID
    isEdition
    medium
    metric
    artworkLocation
    provenance
    slug
    title
    width
    consignmentSubmission {
      inProgress
    }
  }
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
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formattedNationalityAndBirthday",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "pricePaid",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "display",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "currencyCode",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "depth",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionSize",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionNumber",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "images",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isDefault",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imageURL",
      "storageKey": null
    },
    (v13/*: any*/),
    (v10/*: any*/),
    (v1/*: any*/)
  ],
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isEdition",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "metric",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artworkLocation",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "provenance",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "ArtworkConsignmentSubmission",
  "kind": "LinkedField",
  "name": "consignmentSubmission",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inProgress",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v23 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v24 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v26 = {
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
    "name": "MyCollectionArtworkListItemTestsQuery",
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
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AttributionClass",
            "kind": "LinkedField",
            "name": "attributionClass",
            "plural": false,
            "selections": [
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          (v12/*: any*/),
          (v14/*: any*/),
          (v1/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v13/*: any*/),
          (v22/*: any*/)
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
    "name": "MyCollectionArtworkListItemTestsQuery",
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
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v12/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AttributionClass",
            "kind": "LinkedField",
            "name": "attributionClass",
            "plural": false,
            "selections": [
              (v11/*: any*/),
              (v12/*: any*/)
            ],
            "storageKey": null
          },
          (v12/*: any*/),
          (v14/*: any*/),
          (v1/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v13/*: any*/),
          (v22/*: any*/)
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
    "id": "90c6f7529d35f4f0478e1e4bca4fe7ba",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "artwork.artist.formattedNationalityAndBirthday": (v23/*: any*/),
        "artwork.artist.id": (v24/*: any*/),
        "artwork.artist.internalID": (v24/*: any*/),
        "artwork.artistNames": (v23/*: any*/),
        "artwork.artworkLocation": (v23/*: any*/),
        "artwork.attributionClass": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AttributionClass"
        },
        "artwork.attributionClass.id": (v24/*: any*/),
        "artwork.attributionClass.name": (v23/*: any*/),
        "artwork.category": (v23/*: any*/),
        "artwork.consignmentSubmission": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtworkConsignmentSubmission"
        },
        "artwork.consignmentSubmission.inProgress": (v25/*: any*/),
        "artwork.date": (v23/*: any*/),
        "artwork.depth": (v23/*: any*/),
        "artwork.editionNumber": (v23/*: any*/),
        "artwork.editionSize": (v23/*: any*/),
        "artwork.height": (v23/*: any*/),
        "artwork.id": (v24/*: any*/),
        "artwork.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "artwork.images.height": (v26/*: any*/),
        "artwork.images.imageURL": (v23/*: any*/),
        "artwork.images.internalID": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ID"
        },
        "artwork.images.isDefault": (v25/*: any*/),
        "artwork.images.width": (v26/*: any*/),
        "artwork.internalID": (v24/*: any*/),
        "artwork.isEdition": (v25/*: any*/),
        "artwork.medium": (v23/*: any*/),
        "artwork.metric": (v23/*: any*/),
        "artwork.pricePaid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Money"
        },
        "artwork.pricePaid.currencyCode": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "String"
        },
        "artwork.pricePaid.display": (v23/*: any*/),
        "artwork.pricePaid.minor": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "artwork.provenance": (v23/*: any*/),
        "artwork.slug": (v24/*: any*/),
        "artwork.title": (v23/*: any*/),
        "artwork.width": (v23/*: any*/)
      }
    },
    "name": "MyCollectionArtworkListItemTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b72514ea1580ece1c88d0a4606d9f982';
export default node;
