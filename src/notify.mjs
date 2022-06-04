import notifier from 'node-notifier'

/** @var {String} デスクトップ通知のタイトル */
const notificationTitle = '試合監視'
/** @var {String} デスクトップ通知の音 [Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink] */
const notificationSound = 'Glass'

/**
 * デスクトップ通知
 * @param message
 */
const notify = (message, url) => {
  notifier.notify({
    title: notificationTitle,
    sound: notificationSound,
    open: url,
    message,
  })
}

/** @var {Object} 標準出力の色設定 */
const InfoColors = {
  WARNING: 31,
  SUCCESS: 33,
  INFO: 36,
  MUTED: 2,
};

/**
 * メッセージを標準出力する
 * @param message
 * @param color
 */
const info = (message, color = null) => {
  const colorCode = typeof color === 'string'
    ? InfoColors[color.toUpperCase()]
    : color

  /* eslint-disable-next-line no-console */
  console.log(
    colorCode
      ? `\u001b[${colorCode}m${message}\u001b[0m`
      : message
  )
}

export { notify, info, InfoColors }