import { TOP, BOTTOM } from './types.mjs'

/**
 * 通知イベントの定義 (イニング開始時に通知)
 */
const inningEvents = [
  {
    inning: 1,
    team: TOP,
    message: '試合開始',
  },
  {
    inning: 4,
    team: BOTTOM,
    message: '4回表終了',
  },
  {
    inning: 6,
    team: BOTTOM,
    message: '6回表終了',
  },
  {
    inning: 10,
    team: TOP,
    message: '試合終了',
  },
]

export default inningEvents