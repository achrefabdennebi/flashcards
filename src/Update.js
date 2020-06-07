import * as R from 'ramda';

const MSGS = {
  ADD_CARD : 'ADD_CARD',
  SAVE_CARD: 'SAVE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  CHANGE_EDIT_MODE: 'CHANGE_EDIT_MODE',
  QUESTION_INPUT: 'QUESTION_INPUT',
  ANSWER_INPUT: 'ANSWER_INPUT',
  DISPLAY_ANSWER: 'DISPLAY_ANSWER',
  SET_RANK: 'SET_RANK'
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

export function deleteCard(id) {
  return {
    type: MSGS.DELETE_CARD,
    id
  }
}

export function displayAnswer (id) {
  return {
    type: MSGS.DISPLAY_ANSWER,
    id
  }
}

export function setRank(rank, id) {
  return {
    type: MSGS.SET_RANK,
    rank, 
    id
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
          return { ...card, question, answer, isCreateMode : false, showAnswer: false };
        }
        return card;
      }, model.cards);

      return {
        ...model, 
        cards,
        question:'',
        answer: '',
        showAnswer: false,
        isCreateMode: true,
        editId: null
      }
    }
    case MSGS.DELETE_CARD: {
      const { id } = msg;
      const cards = R.filter(
        card => card.id !== id
      , model.cards);

      return { ...model, cards };
    }
    case MSGS.DISPLAY_ANSWER: {
      const { id } = msg;

      const cards = R.map(card => {
        if (card.id === id) {
          return { ...card, showAnswer: true };
        }
        return card;
      }, model.cards);
  
      return {
        ...model,
        cards,
      }
    }
    case MSGS.SET_RANK: {
      const { id, rank } = msg;
      debugger;
      const cards = R.map(card => {
        if (card.id === id) {
          return { ...card, showAnswer: false, rank };
        }
        return card;
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
  const { nextId, question, answer, isCreateMode, showAnswer, rank } = model;
  const card  = { id: nextId, question, answer, isCreateMode, showAnswer, rank };
  const cards = [...model.cards, card];
  return {
    ...model,
    cards,
    nextId: nextId + 1,
  }
}

export default update;
