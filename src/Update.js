import * as R from 'ramda';

const MSGS = {
  ADD_CARD : 'ADD_CARD',
  SAVE_CARD: 'SAVE_CARD',
  CHANGE_EDIT_MODE: 'CHANGE_EDIT_MODE',
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
  return {
    type: MSGS.SAVE_CARD,
    editId
  }
}

export function changeEditMode(editId) {
  return {
    type: MSGS.CHANGE_EDIT_MODE,
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
    case MSGS.CHANGE_EDIT_MODE: {
      const { editId } = msg;
      const cards = R.map(card => {
        if (card.id === editId) {
          model.question = card.question;
          model.answer = card.answer;
          return { ...card, isCreateMode : true  };
        }
        return card;
      }, model.cards);

      return {
        ...model, 
        cards,
        editId: null
      }
    }
    case MSGS.SAVE_CARD: {
      const { editId } = msg;
      const { question, answer } = model;
      const cards = R.map(card => {
        if (card.id === editId) {
          return { ...card, question, answer, isCreateMode : false  };
        }
        return card;
      }, model.cards);

      return {
        ...model, 
        cards,
        question:'',
        answer: '',
        isCreateMode: true,
        editId: null
      }
    }
  }
  return model;
}

function addCard(model) {
  const { nextId, question, answer, isCreateMode } = model;
  const card  = { id: nextId, question, answer, isCreateMode };
  const cards = [...model.cards, card];
  return {
    ...model,
    cards,
    nextId: nextId + 1,
  }
}

export default update;
