/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type QueryRenderersInquiryQueryVariables = {
    readonly artworkID: string;
};
export type QueryRenderersInquiryQueryResponse = {
    readonly artwork: ({
    }) | null;
};



/*
query QueryRenderersInquiryQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    ...Inquiry_artwork
    __id
  }
}

fragment Inquiry_artwork on Artwork {
  _id
  id
  contact_message
  partner {
    name
    __id
  }
  ...ArtworkPreview_artwork
  __id
}

fragment ArtworkPreview_artwork on Artwork {
  id
  _id
  title
  artist_names
  date
  image {
    url
  }
  __id
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
    "variableName": "artworkID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersInquiryQuery",
  "id": null,
  "text": "query QueryRenderersInquiryQuery(\n  $artworkID: String!\n) {\n  artwork(id: $artworkID) {\n    ...Inquiry_artwork\n    __id\n  }\n}\n\nfragment Inquiry_artwork on Artwork {\n  _id\n  id\n  contact_message\n  partner {\n    name\n    __id\n  }\n  ...ArtworkPreview_artwork\n  __id\n}\n\nfragment ArtworkPreview_artwork on Artwork {\n  id\n  _id\n  title\n  artist_names\n  date\n  image {\n    url\n  }\n  __id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersInquiryQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Inquiry_artwork",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersInquiryQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "_id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "contact_message",
            "args": null,
            "storageKey": null
          },
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
              v2
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "artist_names",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "date",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "image",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "url",
                "args": null,
                "storageKey": null
              }
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = '820a207464d113a1f04a3c89649aa9b8';
export default node;
