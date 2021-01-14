/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 87dffd4db22ee1f4dba34506eff18a3e */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionArtworkHeaderRefetchQueryVariables = {
    artworkID: string;
};
export type MyCollectionArtworkHeaderRefetchQueryResponse = {
    readonly artwork: {
        readonly artistNames: string | null;
        readonly date: string | null;
        readonly images: ReadonlyArray<{
            readonly height: number | null;
            readonly isDefault: boolean | null;
            readonly imageURL: string | null;
            readonly width: number | null;
            readonly internalID: string | null;
            readonly imageVersions: ReadonlyArray<string | null> | null;
        } | null> | null;
        readonly internalID: string;
        readonly slug: string;
        readonly title: string | null;
    } | null;
};
export type MyCollectionArtworkHeaderRefetchQuery = {
    readonly response: MyCollectionArtworkHeaderRefetchQueryResponse;
    readonly variables: MyCollectionArtworkHeaderRefetchQueryVariables;
};



/*
query MyCollectionArtworkHeaderRefetchQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    artistNames
    date
    images {
      height
      isDefault
      imageURL
      width
      internalID
      imageVersions
    }
    internalID
    slug
    title
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artworkID"
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
  "name": "date",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v5 = {
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
      "name": "height",
      "storageKey": null
    },
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
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "width",
      "storageKey": null
    },
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imageVersions",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkHeaderRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v5/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyCollectionArtworkHeaderRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v5/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "87dffd4db22ee1f4dba34506eff18a3e",
    "metadata": {},
    "name": "MyCollectionArtworkHeaderRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '46a8e156f6bd0894d312af8825f02b9c';
export default node;
