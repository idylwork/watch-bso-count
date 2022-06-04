/**
 * 当日の試合を監視
 * `node src/main.mjs`
 *
 * 日付を指定して監視
 * `node src/main.mjs 2021-04-01`
 */
import dayjs from 'dayjs'
import state from './state.mjs'
import { notify, info } from './notify.mjs'
import { fetchDOM, getInnerTexts } from './fetch.mjs'
import { TOP, BOTTOM } from './types.mjs'
import inningEvents from './events.mjs'
import { InfoColors } from './notify.mjs'

/** @var {string} スクレーピング対象の日程・結果URL */
const scheduleUrl = 'https://baseball.yahoo.co.jp/npb/schedule/'
/** @var {number} 対象チーム番号 */
const teamNo = 1
/** @var {number} スクレーピングの間隔  */
const interval = 60 * 1000
/** @var {string|Null} 試合日付(YYYY-MM-DD) */
const date = process.argv[2]

/**
 * コマンド実行当日の一球速報URLをスケジュールページから取得
 * @returns string|null
 */
const getScoreUrl = async (date = null) => {
  const document = await fetchDOM(date ? `${scheduleUrl}?date=${date}` : scheduleUrl)
  const teamIconEl = document.querySelector(`.bb-score__homeLogo--team${teamNo}`)
  const url = teamIconEl ? teamIconEl.closest('.bb-score__content').href : null;
  return url && url.endsWith('/index')
    ? url.replace(/\/index$/, '/score')
    : url
}

/**
 * イニング数がキーの配列を表裏毎リストで取得 (Mapオブジェクト)
 * @param document
 * @returns {Object} {キー名: Map[1: 1回の得点, 2: 2回の得点 ...]}
 */
const getScores = (document) => {
  const rows = {
    top: document.querySelectorAll('#ing_brd tbody tr:first-of-type .bb-gameScoreTable__score'),
    bottom: document.querySelectorAll('#ing_brd tbody tr:last-of-type .bb-gameScoreTable__score'),
  }
  return Object.fromEntries(Object.entries(rows).map(([key, els]) => {
    return [key, new Map(getInnerTexts(els).map((score, index) => [index + 1, score]))]
  }))
}

/**
 * 試合の情報を取得する
 * @param notification
 */
const loadScore = async (url, notification = true) => {
  const document = await fetchDOM(url)

  // スコアとイニング情報の更新
  state.updateScores(getScores(document))

  // イニング毎の通知 (初めてそのイニングにスコアが入ったときに通知)
  if (state.isChanged) {
    let message = null
    inningEvents.forEach((event, index) => {
      if (state.current.inning > event.inning
        || (state.current.inning === event.inning
          && (state.current.team === event.team || state.current.team === BOTTOM))) {
        delete inningEvents[index]
        message = event.message || `${event.inning}${event.team === TOP ? '表' : '裏'}開始`
      }
    })
    if (message && notification) {
      notify(message, url)
    }
  }

  // ホームラン
  if (!state.hasHomerun) {
    const results = getInnerTexts(document.querySelectorAll('#gm_rslt + .bb-splitsTable .bb-splitsTable__data--result'))
    if (results.includes('ホームラン')) {
      state.hasHomerun = true
      if (notification) {
        notify('ホームラン', url)
      }
    }
  }

  // 標準出力
  const inning = document.querySelector('#sbo .live').textContent.replace(/\s+/g, ' ')
  const result = document.querySelector('#result > span').textContent.trim()
  info(`${dayjs().format('HH:mm:ss')} ${inning} ${result}`)
}

const scoreUrl = await getScoreUrl(date)
if (scoreUrl) {
  info(`Start watching game score... [${scoreUrl}]`, InfoColors.INFO)
  loadScore(scoreUrl, true)
  setInterval(loadScore, interval, scoreUrl)
} else {
  info(`No current games found. [${scoreUrl || '-'}]`, InfoColors.WARNING)
}
