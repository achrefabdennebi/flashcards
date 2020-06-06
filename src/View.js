import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
  addCardButton,
  saveCard,
  questionInput,
  answerInput,
  changeEditMode
} from './Update';

const { 
 div,
 h1,
 pre,
 button,
 i,
 textarea
} = hh(h);

function buttonAddFlashCard(dispatch, model) {
  return div({},[
    button(
      {
        className: 'pa2 br1 mv2 bg-green bn white',
        type: 'Button',
        onclick: () => dispatch(addCardButton(model))
      },
      [
        i({ className: 'fa fa-plus ph1'}),
        'Add Flashcard'
      ] 
    )
  ]);
}

/**
 * Textarea input
 * @param {*} label 
 */
function textAreaInput(label, inputValue, oninput) {
  return div(
    {},
    [
      div({className: 'b f6 mv1'}, label),
      textarea({
        className: 'w-100 bg-washed-yellow outline-0 h4',
        type: 'textarea',
        value: inputValue,
        oninput
      })
    ]
  )
}

/**
 * Form card view
 */
function formCard (dispatch, model) {
  const {question , answer } = model;

  return div(
    {
      className: 'w-third pa2'
    },
    [
      div(
        {
          className: 'w-100 h-100 pa2 bg-light-yellow mv2 shadow-1 relative'
        },
        [
          textAreaInput('Question', question, e => dispatch(questionInput(e.target.value))),
          textAreaInput('Answer', answer, e => dispatch(answerInput(e.target.value))),
          button({
            className: 'f4 ph3 pv2 br1 bg-gray bn white mv2',
            onclick: () => dispatch(saveCard(model.id))
          }, 'Save')
        ]
      )
    ]
  )
}


function displayInfo(label, value, onclick) {
  return div(
    {
      className: ''
    },
    [
      div({ className: 'b f6 mv1 underline' }, label),
      div({ className: 'pointer', onclick: onclick }, value)
    ]
  )
}

function cardTpl (dispatch, model) {
  const { question, answer } = model;

  return div(
    {
      className: 'w-third pa2'
    },
    [
      div(
        {
          className: 'w-100 h-100 pa2 bg-light-yellow shadow-1 mv2 relative',
        },
        [
          displayInfo('Question', question, () => dispatch(changeEditMode(model.id))),
          displayInfo('Answer', answer, () => dispatch(changeEditMode(model.id)))
        ]
      )
    ]
  )
}

/**
 * List of card to be shown
 * @param {*} dispatch 
 * @param {*} cards 
 */
function listCard(dispatch, cards) {
  // TO improve
  const formCards = R.filter((card) => card.isCreateMode === true, cards);
  const viewCards = R.filter((card) => card.isCreateMode === false, cards);

  const viewCardsItem = R.map( R.partial(cardTpl, [dispatch]), viewCards);
  const formCardsItem = R.map( R.partial(formCard, [dispatch]), formCards);

  const rows = [...formCardsItem, ...viewCardsItem]
  
  return rows;
}

/**
 * Cards container
 * @param {*} dispatch 
 * @param {*} cards 
 */
function cardsView(dispatch, cards) {
  return div({
    className: 'flex flex-wrap nl2 nr2',
  },
  [
    listCard(dispatch, cards)
  ])
}

function view(dispatch, model) {
  return div({ className: 'mw8 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Flashcard Study'),
    buttonAddFlashCard(dispatch, model),
    cardsView(dispatch, model.cards),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
