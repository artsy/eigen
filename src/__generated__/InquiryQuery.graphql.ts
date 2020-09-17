/* tslint:disable */
/* eslint-disable */
/* @relayHash 8e2e2acf31107769b122809998417af5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InquiryQueryVariables = {
    artworkID: string;
};
export type InquiryQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"Inquiry_artwork">;
    } | null;
};
export type InquiryQuery = {
    readonly response: InquiryQueryResponse;
    readonly variables: InquiryQueryVariables;
};



/*
query InquiryQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    ...Inquiry_artwork
    id
  }
}

fragment ArtworkPreview_artwork on Artwork {
  slug
  internalID
  title
  artist_names: artistNames
  date
  image {
    url
    aspectRatio
  }
}

fragment Inquiry_artwork on Artwork {
  slug
  internalID
  contact_message: contactMessage
  partner {
    name
    id
  }
  ...ArtworkPreview_artwork
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
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "InquiryQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
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
            "name": "Inquiry_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "InquiryQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
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
            "alias": "contact_message",
            "name": "contactMessage",
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
              (v2/*: any*/)
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
            "alias": "artist_names",
            "name": "artistNames",
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "aspectRatio",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "InquiryQuery",
    "id": "6ad69104ea21f6d19df4b9000fa27059",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '1585091bd37bd4e98eb4aee91d287462';
export default node;
