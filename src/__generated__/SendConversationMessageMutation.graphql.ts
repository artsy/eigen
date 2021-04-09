/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 9a601b58cfe8124ff0085df2cd44a3d8 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SendConversationMessageMutationInput = {
    bodyText: string;
    clientMutationId?: string | null;
    from: string;
    id: string;
    replyToMessageID: string;
};
export type SendConversationMessageMutationVariables = {
    input: SendConversationMessageMutationInput;
};
export type SendConversationMessageMutationResponse = {
    readonly sendConversationMessage: {
        readonly messageEdge: {
            readonly node: {
                readonly impulse_id: string;
                readonly is_from_user: boolean | null;
                readonly body: string | null;
                readonly id: string;
                readonly " $fragmentRefs": FragmentRefs<"Message_message">;
            } | null;
        } | null;
    } | null;
};
export type SendConversationMessageMutation = {
    readonly response: SendConversationMessageMutationResponse;
    readonly variables: SendConversationMessageMutationVariables;
};



/*
mutation SendConversationMessageMutation(
  $input: SendConversationMessageMutationInput!
) {
  sendConversationMessage(input: $input) {
    messageEdge {
      node {
        impulse_id: impulseID
        is_from_user: isFromUser
        body
        id
        ...Message_message
      }
    }
  }
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}

fragment FileDownload_attachment on Attachment {
  fileName
  downloadURL
  ...AttachmentPreview_attachment
}

fragment ImagePreview_attachment on Attachment {
  downloadURL
  ...AttachmentPreview_attachment
}

fragment Message_message on Message {
  __typename
  body
  createdAt
  internalID
  isFromUser
  isFirstMessage
  from {
    name
    email
  }
  attachments {
    id
    internalID
    contentType
    downloadURL
    fileName
    ...PDFPreview_attachment
    ...ImagePreview_attachment
    ...FileDownload_attachment
  }
}

fragment PDFPreview_attachment on Attachment {
  fileName
  ...AttachmentPreview_attachment
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": "impulse_id",
  "args": null,
  "kind": "ScalarField",
  "name": "impulseID",
  "storageKey": null
},
v3 = {
  "alias": "is_from_user",
  "args": null,
  "kind": "ScalarField",
  "name": "isFromUser",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SendConversationMessageMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SendConversationMessageMutationPayload",
        "kind": "LinkedField",
        "name": "sendConversationMessage",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "MessageEdge",
            "kind": "LinkedField",
            "name": "messageEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Message",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "Message_message"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SendConversationMessageMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "SendConversationMessageMutationPayload",
        "kind": "LinkedField",
        "name": "sendConversationMessage",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "MessageEdge",
            "kind": "LinkedField",
            "name": "messageEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Message",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdAt",
                    "storageKey": null
                  },
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFromUser",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFirstMessage",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MessageInitiator",
                    "kind": "LinkedField",
                    "name": "from",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "email",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Attachment",
                    "kind": "LinkedField",
                    "name": "attachments",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "contentType",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "downloadURL",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "fileName",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "9a601b58cfe8124ff0085df2cd44a3d8",
    "metadata": {},
    "name": "SendConversationMessageMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'de9c31165ba6aff10f299db16ec743b0';
export default node;
