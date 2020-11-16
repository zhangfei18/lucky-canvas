export default class Lucky {

  protected htmlFontSize: number = 16
  protected dpr: number = 1

  constructor () {
    // 初始化一些公共设置
    this.setDpr()
    this.setHTMLFontSize()
  }

  /**
   * 设备像素比
   */
  protected setDpr (): void {
    (window as any).dpr = this.dpr = (window.devicePixelRatio || 2 ) * 1.3
  }

  /**
   * 根标签的字体大小
   */
  protected setHTMLFontSize (): void {
    this.htmlFontSize = +getComputedStyle(document.documentElement).fontSize.slice(0, -2)
  }

  /**
   * 根据 dpr 缩放 canvas 并处理位移
   * @param canvas 画布
   * @param width 将要等比缩放的宽
   * @param height 将要等比缩放的高
   */
  protected optimizeClarity (canvas: HTMLCanvasElement, width: number, height: number): void {
    const { dpr } = this
    const compute = (len: number): number => {
      return (len * dpr - len) / (len * dpr) * (dpr / 2) * 100
    }
    canvas.style.transform = `scale(${1 / dpr}) translate(
      ${-compute(width)}%, ${-compute(height)}%
    )`
  }

  /**
   * 转换单位
   * @param { string } value 将要转换的值
   * @param config 
   * @return { number } 返回新的字符串
   */
  changeUnits (value: string, { denominator = 1, clean = false }): number {
    return Number(value.replace(/^(\-*[0-9.]*)([a-z%]*)$/, (value, num, unit) => {
      switch (unit) {
        case '%':
          num *= (denominator / 100)
          break
        case 'px':
          num *= 1
          break
        case 'rem':
          num *= this.htmlFontSize
          break
        default:
          num *= 1
          break
      }
      return clean || unit === '%' ? num : num * this.dpr
    }))
  }

  /**
   * vue2.x 响应式 - 数据劫持
   * @param obj 将要处理的数据
   */
  observer (obj: any): void {
    if (typeof obj !== 'object' || obj === null) return obj
    Object.keys(obj).forEach(key => {
      this.defineReactive(obj, key, obj[key])
    })
  }

  /**
   * vue2.x 响应式 - 重写setter和getter
   * @param obj 数据
   * @param key 属性
   * @param val 值
   */
  defineReactive (obj: object, key: string | number, val: any): void {
    this.observer(val)
    Object.defineProperty(obj, key, {
      get () {
        console.log('get', key)
        return val
      },
      set (newVal) {
        console.log('set', key, val)
        if (newVal !== val) {
          val = newVal
          this.observer(val)
        }
      }
    })
  }
}