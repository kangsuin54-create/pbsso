export function getWrongFeedback(card, wrongCount) {
  return card.wrongFeedback?.[Math.min(wrongCount, card.wrongFeedback.length - 1)] || '다시 한번 생각해봐요~ 😊'
}
