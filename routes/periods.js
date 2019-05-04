'use strict';

module.exports = class Periods {
  constructor() {
    const periods = {
      1: {
        num: 1,
        periodname: '9:00 - 10:00',
        startHour: 9,
        endHour: 10,
        availability: true,
        isSelf: false
      },
      2: {
        num: 2,
        periodname: '10:00 - 11:00',
        startHour: 10,
        endHour: 11,
        availability: true,
        isSelf: false
      },
      3: {
        num: 3,
        periodname: '11:00 - 12:00',
        startHour: 11,
        endHour: 12,
        availability: true,
        isSelf: false
      },
      4: {
        num: 4,
        periodname: '12:00 - 13:00',
        startHour: 12,
        endHour: 13,
        availability: true,
        isSelf: false
      },
      5: {
        num: 5,
        periodname: '13:00 - 14:00',
        startHour: 13,
        endHour: 14,
        availability: true,
        isSelf: false
      },
      6: {
        num: 6,
        periodname: '14:00 - 15:00',
        startHour: 14,
        endHour: 15,
        availability: true,
        isSelf: false
      },
      7: {
        num: 7,
        periodname: '15:00 - 16:00',
        startHour: 15,
        endHour: 16,
        availability: true,
        isSelf: false
      },
      8: {
        num: 8,
        periodname: '16:00 - 17:30',
        startHour: 16,
        endHour: 17.5,
        availability: true,
        isSelf: false
      }
    };
    return periods;
  }
}
