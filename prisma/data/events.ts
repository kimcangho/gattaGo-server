const events = [
  {
    distance: "500m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "heat",
    startTime: new Date("2023-06-03T13:00:00"),
    lanes: 5,
    entries: 4,
    isSeeded: true,
    isCompleted: false,
  },
  {
    distance: "500m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "heat",
    startTime: new Date("2023-06-03T13:07:00"),
    lanes: 5,
    entries: 4,
    isSeeded: true,
    isCompleted: false,
  },
  {
    distance: "500m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "heat",
    startTime: new Date("2023-06-03T13:14:00"),
    lanes: 5,
    entries: 4,
    isSeeded: true,
    isCompleted: false,
  },
  {
    distance: "200m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "final",
    startTime: new Date("2023-06-03T14:17:00"),
    lanes: 5,
    entries: 5,
    isSeeded: false,
    isCompleted: false,
  },
  {
    distance: "200m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "final",
    startTime: new Date("2023-06-03T14:27:00"),
    lanes: 5,
    entries: 5,
    isSeeded: false,
    isCompleted: false,
  },
  {
    distance: "200m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "final",
    startTime: new Date("2023-06-03T14:37:00"),
    lanes: 5,
    entries: 2,
    isSeeded: false,
    isCompleted: false,
  },
  {
    distance: "500m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "final",
    startTime: new Date("2023-06-03T15:57:00"),
    lanes: 5,
    entries: 5,
    isSeeded: false,
    isCompleted: false,
  },
  {
    distance: "500m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "final",
    startTime: new Date("2023-06-03T16:09:00"),
    lanes: 5,
    entries: 5,
    isSeeded: false,
    isCompleted: false,
  },
  {
    distance: "500m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "final",
    startTime: new Date("2023-06-03T16:21:00"),
    lanes: 5,
    entries: 2,
    isSeeded: false,
    isCompleted: false,
  },
  {
    distance: "2000m",
    division: "premier",
    level: "sport",
    gender: "mixed",
    boatSize: "standard",
    progressionType: "final",
    startTime: new Date("2023-06-03T16:41:00"),
    lanes: 12,
    entries: 12,
    isSeeded: false,
    isCompleted: false,
  },
];

export default events;

// model Event {
//     id              String          @id @default(uuid())
//     distance        String          @db.VarChar(255)
//     division        String          @db.VarChar(255)
//     level           String          @db.VarChar(255)
//     gender          String          @db.VarChar(255)
//     boatSize        String          @db.VarChar(255)
//     progressionType String          @db.VarChar(255)
//     startTime       DateTime
//     lanes           Int
//     entries         Int
//     isSeeded        Boolean
//     isCompleted     Boolean
//     competition     Regatta         @relation(fields: [competitionId], references: [id])
//     competitionId   String
//     teams           TeamsInEvents[]
//   }
