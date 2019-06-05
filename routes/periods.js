'use strict';

module.exports = class Periods {
  constructor() {
    const periods = {
      1: {
        num: 1,
        startTime: 9,
        periodLabelString: '9:00 - 10:00',
        startTimeString: '9:00',
        endTimeString: '10:00',
        availability: true,
        isSelf: false
      },
      2: {
        num: 2,
        startTime: 10,
        periodLabelString: '10:00 - 11:00',
        startTimeString: '10:00',
        endTimeString: '11:00',
        availability: true,
        isSelf: false
      },
      3: {
        num: 3,
        startTime: 11,
        periodLabelString: '11:00 - 12:00',
        startTimeString: '11:00',
        endTimeString: '12:00',
        availability: true,
        isSelf: false
      },
      4: {
        num: 4,
        startTime: 12,
        periodLabelString: '12:00 - 13:00',
        startTimeString: '12:00',
        endTimeString: '13:00',
        availability: true,
        isSelf: false
      },
      5: {
        num: 5,
        startTime: 13,
        periodLabelString: '13:00 - 14:00',
        startTimeString: '13:00',
        endTimeString: '14:00',
        availability: true,
        isSelf: false
      },
      6: {
        num: 6,
        startTime: 14,
        periodLabelString: '14:00 - 15:00',
        startTimeString: '14:00',
        endTimeString: '15:00',
        availability: true,
        isSelf: false
      },
      7: {
        num: 7,
        startTime: 15,
        periodLabelString: '15:00 - 16:00',
        startTimeString: '15:00',
        endTimeString: '16:00',
        availability: true,
        isSelf: false
      },
      8: {
        num: 8,
        startTime: 16,
        periodLabelString: '16:00 - 17:30',
        startTimeString: '16:00',
        endTimeString: '17:30',
        availability: true,
        isSelf: false
      }
    };
    return periods;
  }
}
