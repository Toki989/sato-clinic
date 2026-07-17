const receptionHours = Object.freeze({
  fullDay: "8:00〜11:00 / 12:00〜17:00",
  morning: "8:00〜11:00"
});

const clinicHours = Object.freeze({
  symbols: Object.freeze({
    open: "○",
    closed: "―"
  }),
  days: Object.freeze(["月", "火", "水", "木", "金", "土", "日"]),
  slots: Object.freeze([
    Object.freeze({
      label: "午前",
      time: "9:00〜12:00",
      schedule: Object.freeze([true, true, true, false, true, true, false])
    }),
    Object.freeze({
      label: "午後",
      time: "13:30〜18:00",
      schedule: Object.freeze([true, true, true, false, true, false, false])
    })
  ]),
  mobileGroups: Object.freeze([
    Object.freeze({
      title: "平日",
      slotIndexes: Object.freeze([0, 1]),
      receptionHours: receptionHours.fullDay,
      note: "月・火・水・金"
    }),
    Object.freeze({
      title: "土曜",
      slotIndexes: Object.freeze([0]),
      receptionHours: receptionHours.morning,
      note: "午後休診"
    }),
    Object.freeze({
      title: "休診",
      slotIndexes: Object.freeze([]),
      receptionHours: "",
      note: "木曜日・日曜日",
      subnote: "祝祭日は診療日変更の可能性があります。"
    })
  ])
});
