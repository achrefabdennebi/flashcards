import * as R from 'ramda';

const MSGS = {
  ADD_CARD : 'ADD_CARD',
  SAVE_CARD: 'SAVE_CARD',
  QUESTION_INPUT: 'QUESTION_INPUT',
  ANSWER_INPUT: 'ANSWER_INPUT',
}

export function addCardButton (model) {
  return {
    type: MSGS.ADD_CARD,
    ...model
  }
} 

export function questionInput (question) {
  return {
    type: MSGS.QUESTION_INPUT,
    question
  }
} 

export function answerInput (answer) {
  return {
    type: MSGS.ANSWER_INPUT,
    answer
  }
}

export function saveCard(editId) {
  return  {
    type: MSGS.SAVE_CARD,
    editId
  }
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.ADD_CARD: {
      const updatedModel = addCard(model);
      return {
        ...updatedModel
      }
    }
    case MSGS.QUESTION_INPUT: {
      const { question } = msg;
      return {
        ...model,
        question
      }
    }
    case MSGS.ANSWER_INPUT: {
      const { answer } = msg;
      return {
        ...model,
        answer
      }
    }
    case MSGS.SAVE_CARD: {
      const { editId } = msg;
      const { question, answer } = model;
      const cards = R.map(card => {
        if (card.id === editId) {
          return { ...card, question, answer };
        }
        return meal;
      }, model.cards);

      return {
        ...model, 
        cards
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
