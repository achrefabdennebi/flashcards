import * as R from 'ramda';

const MSGS = {
  SAVE_CARD : 'ADD_CARD'
}

export function saveCard (model) {
  return {
    type: MSGS.SAVE_CARD,
    ...model
  }
} 

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SAVE_CARD: {
      const updatedModel = addCard(model);
      return {
        ...updatedModel
      }
    } 
  }
  return model;
}

function addCard(model) {
  const { nextId, question, answer } = model;
  const card  = { id: nextId, question, answer };
  const cards = [...model.cards, card];
  return {
    ...model,
    cards,
    nextId: nextId + 1,
  }
}

export default update;
