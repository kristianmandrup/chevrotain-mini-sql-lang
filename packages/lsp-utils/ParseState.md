# Parse state

## getParseStateManager

Sets us a `state` hashmap, keyed by document `uri`

`const state: { [uri: string]: InternalParseStateManagerStateForUri } = {};`

## getParseStateForUri

`getParseStateForUri: (uri: string): ParseState`

Retrieves a `ParseState` from the `state` hashmap for the `uri` if such a state exists, otherwise returning an empty state.

## saveParseStateForUri

`saveParseStateForUri(uri, nextParseState: Partial<ParseState> = {})`

Saves a parse state in the `state` hashmap for a given `uri`
