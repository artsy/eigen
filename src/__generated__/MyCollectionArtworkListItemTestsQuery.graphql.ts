/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d2e9b83eb5490ad366870f907323e0de */

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
            readonly url: string | null;
            readonly width: number | null;
            readonly height: number | null;
        } | null> | null;
        readonly internalID: string;
        readonly medium: string | null;
        readonly metric: string | null;
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
      url
      width
      height
    }
    internalID
    medium
    metric
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
      "name": "url",
      "storageKey": null
    },
    (v12/*: any*/),
    (v10/*: any*/)
  ],
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "metric",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v18 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v19 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v20 = {
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
          (v12/*: any*/)
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
    "id": "d2e9b83eb5490ad366870f907323e0de",
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
        "artwork.artist.id": (v18/*: any*/),
        "artwork.artist.internalID": (v18/*: any*/),
        "artwork.artistNames": (v19/*: any*/),
        "artwork.category": (v19/*: any*/),
        "artwork.costCurrencyCode": (v19/*: any*/),
        "artwork.costMinor": (v20/*: any*/),
        "artwork.date": (v19/*: any*/),
        "artwork.depth": (v19/*: any*/),
        "artwork.editionNumber": (v19/*: any*/),
        "artwork.editionSize": (v19/*: any*/),
        "artwork.height": (v19/*: any*/),
        "artwork.id": (v18/*: any*/),
        "artwork.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "artwork.images.height": (v20/*: any*/),
        "artwork.images.isDefault": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "artwork.images.url": (v19/*: any*/),
        "artwork.images.width": (v20/*: any*/),
        "artwork.internalID": (v18/*: any*/),
        "artwork.medium": (v19/*: any*/),
        "artwork.metric": (v19/*: any*/),
        "artwork.slug": (v18/*: any*/),
        "artwork.title": (v19/*: any*/),
        "artwork.width": (v19/*: any*/)
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
