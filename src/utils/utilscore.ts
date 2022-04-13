import { format } from 'mathjs';
/**
 * 函数防抖 (完全版)
 * @param {function} fn 函数
 * @param {number} delay 延迟执行毫秒数
 * @param {boolean} immediate true 表立即执行，false 表非立即执行
 */
export const debounce = (fn, delay, immediate = false) => {
  let timer = null;
  let status = true;
  if (!immediate)
    return function () {
      const args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  else
    return function () {
      clearTimeout(timer);
      if (status) {
        status = false;
        fn.call(this, arguments);
      }
      timer = setTimeout(() => (status = true), delay);
    };
};

/**
 * 强制在数字后加0
 * @param data
 * @param type 是否除以100后再格式化，默认除以100
 * @example utilscore.toDecimal2(10000) // => "100.00"
 */
export function toDecimal2(data: number | string, type = true) {
  if (!data) {
    return '';
  }
  const x = type ? data / 100 : data;
  let res = parseFloat(x);
  if (Number.isNaN(res)) {
    return false;
  }
  res = format(res * 100, { precision: 14 });
  const f = Math.floor(res) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

/**
 * 将数字转化为千分位格式,可以在数字前面加上符号
 * @param {Number} num
 * @param {String} mark
 * @returns {String}
 * @example utilscore.toDecimalMark(12345674654.123,'￥') // => "￥12,345,674,654.123"
 */
export const toDecimalMark = (num, forceAddZero = false, mark = '') => {
  let f;
  if (num) {
    f = num.toLocaleString('en-US');
  } else {
    f = 0;
  }
  let s = f.toString();
  // 强制在数字后加0
  if (forceAddZero) {
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
  }
  return s.replace(/^/, mark);
};

/**
 * 全局唯一标识符 UUID
 * @param {number} len 长度
 * @param {number} radix 基数 62
 * @example utilscore.uuid(10,62) // => "e424F79HP8"
 */
export const uuid = (len, radix) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuidAry = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuidAry[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuidAry[8] = uuidAry[13] = uuidAry[18] = uuidAry[23] = '-';
    uuidAry[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuidAry[i]) {
        r = 0 | (Math.random() * 16);
        uuidAry[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuidAry.join('');
};

//对象数组的深拷贝
export const objDeepCopy = (source: any) => {
  const sourceCopy = source instanceof Array ? [] : {};
  for (const item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
  }
  return sourceCopy;
};

/**
 * 解决部分数值乘100后，JS精度丢失问题
 * @param data
 */
export function formateNum(data: number | string) {
  if (Number.isNaN(data)) {
    return 0;
  }
  const res = format(data, { precision: 14 });
  return Math.floor(res);
}
