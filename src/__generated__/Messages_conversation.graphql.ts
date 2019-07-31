/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkPreview_artwork$ref } from "./ArtworkPreview_artwork.graphql";
import { Message_message$ref } from "./Message_message.graphql";
import { ShowPreview_show$ref } from "./ShowPreview_show.graphql";
declare const _Messages_conversation$ref: unique symbol;
export type Messages_conversation$ref = typeof _Messages_conversation$ref;
export type Messages_conversation = {
    readonly id: string;
    readonly internalID: string | null;
    readonly from: {
        readonly name: string;
        readonly email: string;
        readonly initials: string | null;
    };
    readonly to: {
        readonly name: string;
        readonly initials: string | null;
    };
    readonly initial_message: string;
    readonly messages: {
        readonly pageInfo: {
            readonly startCursor: string | null;
            readonly endCursor: string | null;
            readonly hasPreviousPage: boolean;
            readonly hasNextPage: boolean;
        };
        readonly edges: ReadonlyArray<{
            readonly cursor: string;
            readonly node: {
                readonly id: string;
                readonly impulse_id: string;
                readonly is_from_user: boolean | null;
                readonly body: string | null;
                readonly attachments: ReadonlyArray<{
                    readonly internalID: string;
                } | null> | null;
                readonly " $fragmentRefs": Message_message$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly items: ReadonlyArray<{
        readonly artwork: ({
            readonly href?: string | null;
            readonly " $fragmentRefs": ArtworkPreview_artwork$ref;
        } & ({
            readonly href: string | null;
            readonly " $fragmentRefs": ArtworkPreview_artwork$ref;
        } | {
            /*This will never be '% other', but we need some
            value in case none of the concrete values match.*/
            readonly __typename: "%other";
        })) | null;
        readonly show: ({
            readonly href?: string | null;
            readonly " $fragmentRefs": ShowPreview_show$ref;
        } & ({
            readonly href: string | null;
            readonly " $fragmentRefs": ShowPreview_show$ref;
        } | {
            /*This will never be '% other', but we need some
            value in case none of the concrete values match.*/
            readonly __typename: "%other";
        })) | null;
    } | null> | null;
    readonly " $refType": Messages_conversation$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Messages_conversation",
  "type": "Conversation",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "after",
        "direction": "forward",
        "path": [
          "messages"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "after",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "from",
      "storageKey": null,
      "args": null,
      "concreteType": "ConversationInitiator",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "email",
          "args": null,
          "storageKey": null
        },
        (v3/*: any*/)
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "to",
      "storageKey": null,
      "args": null,
      "concreteType": "ConversationResponder",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        (v3/*: any*/)
      ]
    },
    {
      "kind": "ScalarField",
      "alias": "initial_message",
      "name": "initialMessage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "messages",
      "name": "__Messages_messages_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "MessageConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "pageInfo",
          "storageKey": null,
          "args": null,
          "concreteType": "PageInfo",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "startCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "endCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hasPreviousPage",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hasNextPage",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "MessageEdge",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Message",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": "impulse_id",
                  "name": "impulseID",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": "is_from_user",
                  "name": "isFromUser",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "body",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "attachments",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Attachment",
                  "plural": true,
                  "selections": [
                    (v1/*: any*/)
                  ]
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "Message_message",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "items",
      "storageKey": null,
      "args": null,
      "concreteType": "ConversationItem",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "artwork",
          "name": "item",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "type": "Artwork",
              "selections": [
                (v4/*: any*/),
                {
                  "kind": "FragmentSpread",
                  "name": "ArtworkPreview_artwork",
                  "args": null
                }
              ]
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": "show",
          "name": "item",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "type": "Show",
              "selections": [
                (v4/*: any*/),
                {
                  "kind": "FragmentSpread",
                  "name": "ShowPreview_show",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'ecb2d6daa828b6f1c8b326a8a3cc775f';
export default node;
