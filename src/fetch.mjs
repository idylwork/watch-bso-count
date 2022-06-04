import fetch from 'node-fetch'
import jsdom from 'jsdom'
const { JSDOM } = jsdom

/**
 * URLからDOMを取得
 * @returns
 */
const fetchDOM = async (url) => {
  const res = await fetch(url)
  const html = await res.text()
  const dom = new JSDOM(html)
  return dom.window.document
}

/**
 * NodeListのテキストを取得
 * @returns {Array}
 */
const getInnerTexts = (els) => Array.from(els, (el) => el.textContent.trim() || null)

export { fetchDOM, getInnerTexts }