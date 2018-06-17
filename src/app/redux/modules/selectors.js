
import orm from './models'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'

// Selects the state managed by Redux-ORM.
export const ormSelector = state => state.db
const s = '*****'

export const token = createSelector(
  ormSelector,
  state => state.tokens.selection,
  ormCreateSelector( orm, (session, selectedTokenId) => {
    console.log(`${s}Running token selector for selected token ${selectedTokenId}`);
    // .ref returns a reference to the plain
    // JavaScript object in the store.
    if ( ! session.Token.hasId( selectedTokenId ) ) return ({})
    //return ( { ...session.Token.withId(selectedTokenId).ref, rounds: token.rounds.toRefArray()} )

    return ( { ...session.Token.withId(selectedTokenId).ref, rounds: token.rounds ? token.rounds.toRefArray(): [] } )
  })
)

export const tokens = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    console.log('Running tokens selector',session.Token)
    return session.Token.filter().toModelArray().map(token => {
      return ( { ...token.ref, rounds: token.rounds.toRefArray() } )
        // `.toRefArray` returns a new Array that includes
        // direct references to each User object in the state.
        //return session.Token.all().toRefArray()
    })
  })
)

