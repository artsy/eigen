/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Inquiry_artwork$ref } from "./Inquiry_artwork.graphql";
export type QueryRenderersInquiryQueryVariables = {
    readonly artworkID: string;
};
export type QueryRenderersInquiryQueryResponse = {
    readonly artwork: ({
        readonly " $fragmentRefs": Inquiry_artwork$ref;
    }) | null;
};
export type QueryRenderersInquiryQuery = {
    readonly response: QueryRenderersInquiryQueryResponse;
    readonly variables: QueryRenderersInquiryQueryVariables;
};



/*
query QueryRenderersInquiryQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    ...Inquiry_artwork
    __id: id
  }
}

fragment Inquiry_artwork on Artwork {
  internalID
  gravityID
  contact_message
  partner {
    name
    __id: id
  }
  ...ArtworkPreview_artwork
  __id: id
}

fragment ArtworkPreview_artwork on Artwork {
  gravityID
  internalID
  title
  artist_names
  date
  image {
    url
  }
  __id: id
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
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersInquiryQuery",
  "id": null,
  "text": "query QueryRenderersInquiryQuery(\n  $artworkID: String!\n) {\n  artwork(id: $artworkID) {\n    ...Inquiry_artwork\n    __id: id\n  }\n}\n\nfragment Inquiry_artwork on Artwork {\n  internalID\n  gravityID\n  contact_message\n  partner {\n    name\n    __id: id\n  }\n  ...ArtworkPreview_artwork\n  __id: id\n}\n\nfragment ArtworkPreview_artwork on Artwork {\n  gravityID\n  internalID\n  title\n  artist_names\n  date\n  image {\n    url\n  }\n  __id: id\n}\n",
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
            "name": "internalID",
            "args": null,
            "storageKey": null
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
