/**
 * 試合のステータス
 * @var {Object}
 * @property {Object} 現在のイニング
 * @property {Boolean} hasTop4thFinished 4回表終了
 * @property {Boolean} hasHomerun ホームラン発生
 */
const state = {
  scores: {
    top: null,
    bottom: null,
  },
  current: {
    team: null,
    inning: 0,
  },
  isChanged: false,
  hasHomerun: false,

  /**
   * スコア情報から現在のイニング情報を取得
   * @param {Object} scores
   * @returns {Object} {team: 'top'|'bottom', inning: 0-9, isChanged: 前回から変更があったか}
   */
  updateCurrent(scores) {
    const current = {}
    Object.entries(scores).forEach(([team, teamScores]) => {
      const teamScore = teamScores.get(current.inning)
      if (!current.team) {
        // 表
        current.team = team
        current.inning = this.current.inning || 0

        while (current.inning <= teamScores.size) {
          if (teamScores.get(current.inning + 1) === null) {
            break
          }
          current.inning += 1
        }
      } else if (teamScore !== null && teamScore !== undefined) {
        // 裏
        current.team = team
      }
    })
    this.isChanged = !Object.is(this.current, current)
    this.current = current
  },

  /**
   * イニング数がキーの配列を表裏毎リストで取得 (0はNULL)
   * @param document
   * @returns {Object} {キー名: Map[1: 1回の得点, 2: 2回の得点 ...]}
   */
  updateScores(scores) {
    this.scores = scores
    this.updateCurrent(scores)
  },
};

export default state