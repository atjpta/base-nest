/**
 * Mixin là một thuật ngữ của lập trình hướng đối tượng, là một lớp chứa các phương thức cho các class khác sử dụng
 */

export class AppMixin {
  static parseArray = (str: any) => {
    if (str) {
      return str.toString().split(',');
    }
    return null;
  };
  static toArray = (data?: any): any[] => {
    let resData: any[] = [];

    if (!data) {
      resData = [];
    } else if (typeof data === 'string') {
      resData = [data];
    } else if (data instanceof Object) {
      const isArray = Array.isArray(data);
      if (isArray) {
        if (data[0]) {
          resData = data;
        } else {
          resData = [];
        }
      } else {
        if (Object.values(data)) {
          resData = [data];
        } else {
          resData = [];
        }
      }
    } else {
      resData = [data];
    }
    return resData;
  };

  /**
   *
   * @returns: random Hex color
   */
  static generateHexColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color.toLowerCase();
  };

  /**
   *
   * @param hexcolor: string
   * @param light: 'white'
   * @param dark: 'black'
   * @returns: string
   */
  static generateContrastColor = (
    hexcolor: string,
    light = 'white',
    dark = 'black',
  ): string => {
    if (hexcolor[0] == '#') {
      hexcolor = hexcolor.substring(1, hexcolor.length - 1);
    }

    if (hexcolor.length === 3) {
      hexcolor = hexcolor
        .split('')
        .map(function (hex) {
          return hex + hex;
        })
        .join('');
    }
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 2), 16);
    const b = parseInt(hexcolor.substring(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? `${dark}` : `${light}`;
  };

  /**
   *
   * @param name: name of css variable
   * @param value?: new value of css variable
   * @returns: value of CSS variable (or set new value if have value param)
   */
  static varCSS = (name: string, value: string | null) => {
    if (name[0] != '-') name = '--' + name;
    if (value) document.documentElement.style.setProperty(name, value);
    return getComputedStyle(document.documentElement).getPropertyValue(name);
  };

  // NUMBER MIXIN

  /**
   *
   * @param number: number to handle
   * @param separator: ['.', ',']
   * @returns: string
   * === Examples
   * generateCommasNumber(123456) 123,456
   * generateCommasNumber(123456, '.') 123.456
   * generateCommasNumber(123456, ',') 123,456
   */
  static generateCommasNumber = (number: number, separator = ','): string => {
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    const result = number.toString().replace(regex, `${separator}`);
    return result;
  };

  /**
   * compactNumber (render view in watch video)
   * @param value: view count
   * @returns: view count format
   * === Examples
   * compactNumber(10) 10
   * compactNumber(100) 100
   * compactNumber(1100)1.1k
   * compactNumber(100100) 100.1k
   * compactNumber(99900) 99.9k
   * compactNumber(22000000) 22m
   * compactNumber(22200000) 22.2m
   */
  static generateViewNumber = (value: number): string => {
    const suffixes = ['', 'k', 'm', 'b', 't'];
    let suffixNum = ~~(`${value}`.length / 3);
    let shortValue = value / 1000 ** suffixNum;
    if (shortValue <= 1) {
      shortValue *= 1000;
      suffixNum--;
    }
    const result = `${shortValue}${suffixes[suffixNum]}`;

    return result;
  };

  /**
   * Compact Number
   * @param value: number to check rank
   * @returns: rank of number
   * === Examples
   * ordinalSuffix(1)); // 1st
   * ordinalSuffix(2)); // 2nd
   * ordinalSuffix(3)); // 3rd
   * ordinalSuffix(9)); // 9th
   * ordinalSuffix(-1)); // number parameter is integer!
   * ordinalSuffix(0)); // number parameter is integer!
   * ordinalSuffix(10)); // 10th
   * ordinalSuffix(11)); // 11th
   */
  static generateRank = (value: number): string => {
    if (value <= 0) return `rank parameter is integer!`;
    if (value > 3) return `${value}th`;
    const j = value % 10;
    const arr = ['', 'st', 'nd', 'rd'];

    return `${value}${arr[j]}`;
  };

  /**
   * get random between min - max
   * @param min: min value
   * @param max: max value
   * @returns: random number
   * === Examples
   * generateRandomNumber(1, 10): 9
   */
  static generateRandomNumber = (min: number, max: number): number => {
    if (max <= min) throw new Error('min < max');
    min = Math.ceil(min);
    max = Math.ceil(max);
    const result = Math.floor(Math.random() * (max - min + 1)) + min;

    return result;
  };

  /**
   *
   * @param length: length of id
   * @returns: random id
   * === Examples
   */
  static generateID = (length: number): string => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  /**
   *
   * @returns: new fake id of mongodb
   * === Examples
   * 6119227a020c10299c1ee2f8: Mongo ObjectId
   * 62da657b24721e596acb0f9f: fake id
   */
  static generateObjectIdInMongoDB = () => {
    // objectId like mongodb, it use 3 byte (24 number) to generate to id
    // [0,..., 9, a, b, c, d, e, f]
    const currentTimestamp = Math.floor(new Date().getTime() / 1000).toString(
      16,
    );
    const objectId = 'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16))
      .toLowerCase();

    return `${currentTimestamp}${objectId}`;
  };

  // TIME MIXINS
  /**
   *
   * @param wall: ['/', ':']
   * @returns: date format
   * === Examples
   * getCurrentDate() Friday 22/7/2022 3:19:53 PM
   */
  static getCurrentDate = (wall = '/') => {
    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const d = new Date();
    const dayName = weekDays[d.getDay()];
    const time = d.toLocaleTimeString();
    const day = `${d.getUTCDate()}${wall}${
      d.getUTCMonth() + 1
    }${wall}${d.getUTCFullYear()}`;

    return `${dayName} ${day} ${time}`;
  };

  /**
   *
   * @returns: current format time
   * === Examples
   * getTime() 19:51:56 11/16/2021 PM
   */
  static getCurrentTime = (): string => {
    const date = new Date();
    let hh: string | number = date.getHours();
    let mm: string | number = date.getMinutes();
    let ss: string | number = date.getSeconds();
    let session = 'AM';
    if (hh === 0) hh = 12;
    if (hh > 12) {
      hh = hh - 12;
      session = 'PM';
    }
    hh = hh < 10 ? `0${hh}` : hh;
    mm = mm < 10 ? `0${mm}` : mm;
    ss = ss < 10 ? `0${ss}` : ss;

    return `${hh}:${mm}:${ss} ${session}}`;
  };

  /**
   *
   * @param timestamp: string of timestamp
   * @param wall: ['/', ':']
   * @returns: format time
   * === Examples
   * handleTimestamp('2022-08-16T08:16:21.005Z') 16/8/2022
   */
  static handleTimestamp = (timestamp: string, wall = '/'): string => {
    const data = new Date(timestamp);
    return `${data.getDate()}${wall}${
      data.getMonth() + 1
    }${wall}${data.getFullYear()}`;
  };

  /**
   *
   * @param timeZone: timezone key
   * @returns: time of local
   */
  getTimeOfTimeZones = (timeZone = 'Asia/Ho_Chi_Minh'): string => {
    /**
     * Some timezone
     * vietnam: 'Asia/Ho_Chi_Minh',
     * china: 'Asia/Hong_Kong',
     * japan: 'Asia/Tokyo',
     * america: 'America/New_York',
     * mexico: 'America/Mexico_City',
     */
    const date = new Date();
    const strTime = date.toLocaleTimeString('en-US', {
      timeZone,
    });
    return strTime;
  };

  /**
   *
   * @param n: day count
   * @returns
   */
  addDays = (n: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + n);
    return date.toDateString();
  };
}
