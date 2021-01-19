/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 80e8d46339e71947cc4b0284d1a48e1e */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionArtworkListItemTestsQueryVariables = {};
export type MyCollectionArtworkListItemTestsQueryResponse = {
    readonly artwork: {
        readonly artist: {
            readonly internalID: string;
        } | null;
        readonly artistNames: string | null;
        readonly category: string | null;
        readonly costMinor: number | null;
        readonly costCurrencyCode: string | null;
        readonly date: string | null;
        readonly depth: string | null;
        readonly editionSize: string | null;
        readonly editionNumber: string | null;
        readonly height: string | null;
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
        readonly provenance: string | null;
        readonly slug: string;
        readonly title: string | null;
        readonly width: string | null;
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
      id
    }
    artistNames
    category
    costMinor
    costCurrencyCode
    date
    depth
    editionSize
    editionNumber
    height
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
    provenance
    slug
    title
    width
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
  "name": "artistNames",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "costMinor",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "costCurrencyCode",
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
  "name": "id",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
},
v13 = {
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
    (v12/*: any*/),
    (v10/*: any*/),
    (v1/*: any*/)
  ],
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isEdition",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "metric",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "provenance",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v20 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v23 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
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
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v13/*: any*/),
          (v1/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v12/*: any*/)
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
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v13/*: any*/),
          (v1/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v12/*: any*/)
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
    "id": "80e8d46339e71947cc4b0284d1a48e1e",
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
        "artwork.artist.id": (v20/*: any*/),
        "artwork.artist.internalID": (v20/*: any*/),
        "artwork.artistNames": (v21/*: any*/),
        "artwork.category": (v21/*: any*/),
        "artwork.costCurrencyCode": (v21/*: any*/),
        "artwork.costMinor": (v22/*: any*/),
        "artwork.date": (v21/*: any*/),
        "artwork.depth": (v21/*: any*/),
        "artwork.editionNumber": (v21/*: any*/),
        "artwork.editionSize": (v21/*: any*/),
        "artwork.height": (v21/*: any*/),
        "artwork.id": (v20/*: any*/),
        "artwork.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "artwork.images.height": (v22/*: any*/),
        "artwork.images.imageURL": (v21/*: any*/),
        "artwork.images.internalID": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ID"
        },
        "artwork.images.isDefault": (v23/*: any*/),
        "artwork.images.width": (v22/*: any*/),
        "artwork.internalID": (v20/*: any*/),
        "artwork.isEdition": (v23/*: any*/),
        "artwork.medium": (v21/*: any*/),
        "artwork.metric": (v21/*: any*/),
        "artwork.provenance": (v21/*: any*/),
        "artwork.slug": (v20/*: any*/),
        "artwork.title": (v21/*: any*/),
        "artwork.width": (v21/*: any*/)
      }
    },
    "name": "MyCollectionArtworkListItemTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '711379e212893cb5ab2d7b815d055d15';
export default node;
