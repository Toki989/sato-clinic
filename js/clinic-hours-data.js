const receptionHours = Object.freeze({
  fullDay: "8:00〜11:00 / 12:00〜17:00",
  morning: "8:00〜11:00",
  afternoon: "12:00〜17:00"
});

const clinicHours = Object.freeze({
  closedDays: "木曜日・土曜午後・日曜日",
  holidayNote: "祝祭日は休診となる場合があります。事前にご確認ください。",
  symbols: Object.freeze({
    open: "○",
    closed: "−"
  }),
  days: Object.freeze(["月", "火", "水", "木", "金", "土", "日"]),
  slots: Object.freeze([
    Object.freeze({
      label: "午前",
      time: "9:00〜12:00",
      schedule: Object.freeze({ 月: true, 火: true, 水: true, 木: false, 金: true, 土: true, 日: false })
    }),
    Object.freeze({
      label: "午後",
      time: "13:00〜18:00",
      schedule: Object.freeze({ 月: true, 火: true, 水: true, 木: false, 金: true, 土: false, 日: false })
    })
  ]),
  mobileGroups: Object.freeze([
    Object.freeze({
      title: "平日",
      slotIndexes: Object.freeze([0, 1]),
      receptionHours: receptionHours.fullDay,
      note: "木曜日を除く月〜金曜日"
    }),
    Object.freeze({
      title: "土曜日",
      slotIndexes: Object.freeze([0]),
      receptionHours: receptionHours.morning,
      note: "午後は休診"
    }),
    Object.freeze({
      title: "休診日",
      slotIndexes: Object.freeze([]),
      receptionHours: "",
      note: "木曜日・日曜日",
      subnote: "祝祭日は休診となる場合があります。事前にご確認ください。"
    })
  ])
});
