import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
  addCardButton,
  saveCard,
  questionInput,
  answerInput,
  changeEditMode,
  deleteCard,
  displayAnswer,
  setRank
} from './Update';

const { 
 div,
 h1,
 pre,
 button,
 i,
 textarea,
 a
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
      div({ className: 'pointer hover-bg-black-10 bg-animate pv2 ph1', onclick: onclick }, value)
    ]
  )
}

function displayLink(value, onclick) {
  return div(
    {
      className : ''
    },
    [
     a(
        {
          className: 'f6 underline link pointer',
          onclick: onclick
        },
        value
      )
    ]
  )
}

function displayBtnGroup(dispatch, model) {
  const { id } = model;
  const RATINGS = {
    BAD : 0,
    GOOD: 1,
    GREAT: 2
  }

  return div(
    {
      className: 'absolute bottom-0 left-0 w-100 ph2'
    },
    [
      div(
        {
          className: 'mv2 flex justify-between',
        },
        [
          button({ className: 'f4 ph3 pv2 bg-red bn white br1', onclick: () => dispatch(setRank(RATINGS.BAD, id))}, 'BAD'),
          button({ className: 'f4 ph3 pv2 bg-blue bn white br1', onclick: () => dispatch(setRank(RATINGS.GOOD, id))}, 'Good'),
          button({ className: 'f4 ph3 pv2 bg-dark-green bn white br1', onclick: () => dispatch(setRank(RATINGS.GREAT, id))}, 'Great')
        ]
      )
    ]

  )
} 

function cardTpl (dispatch, model) {
  const { question, answer, showAnswer } = model;
  const  tplShowAnswer = showAnswer ? displayInfo('Answer', answer, () => dispatch(changeEditMode(model.id)))
                                    : displayLink('Show Answer', () => dispatch(displayAnswer(model.id)));
  const tplButton = showAnswer ? displayBtnGroup(dispatch, model) : null;

  return div(
    {
      className: 'w-third pa2'
    },
    [
      div(
        {
          className: 'w-100 h-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5',
        },
        [
          displayInfo('Question', question, () => dispatch(changeEditMode(model.id))),
          tplShowAnswer,
          tplButton,
          i(
            {
              className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer',
              onclick: () => dispatch(deleteCard(model.id))
            }
          )
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
  const sortedCards = R.sortWith([R.ascend(R.prop('rank'))], cards);
  const formCards = R.filter((card) => card.isCreateMode === true, sortedCards);
  const viewCards = R.filter((card) => card.isCreateMode === false, sortedCards);

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
