'use strict';

module.exports = class Periods {
  constructor() {
    const periods = {
      1: {
        num: 1,
        periodname: '9:00 - 10:00',
        availability: true
      },
      2: {
        num: 2,
        periodname: '10:00 - 11:00',
        availability: true
      },
      3: {
        num: 3,
        periodname: '11:00 - 12:00',
        availability: true
      },
      4: {
        num: 4,
        periodname: '12:00 - 13:00',
        availability: true
      },
      5: {
        num: 5,
        periodname: '13:00 - 14:00',
        availability: true
      },
      6: {
        num: 6,
        periodname: '14:00 - 15:00',
        availability: true
      },
      7: {
        num: 7,
        periodname: '15:00 - 16:00',
        availability: true
      },
      8: {
        num: 8,
        periodname: '16:00 - 17:30',
        availability: true
      }
    };
    return periods;
  }
}
