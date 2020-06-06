import * as R from 'ramda';

const MSGS = {
  SAVE_CARD : 'ADD_CARD',
  QUESTION_INPUT: 'QUESTION_INPUT',
  ANSWER_INPUT: 'ANSWER_INPUT',
}

export function saveCard (model) {
  return {
    type: MSGS.SAVE_CARD,
    ...model
  }
} 

export function questionInput (question) {
  debugger;
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

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SAVE_CARD: {
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
