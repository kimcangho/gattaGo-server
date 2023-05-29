const lineups = [
  {
    name: "Dodgefathers - 200m",
  },
  {
    name: "Dodgefathers - 500m",
  },
  {
    name: "Dodgefathers - 2000m",
  },
];

export default lineups;

// model Lineup {
//     id       String              @id @default(uuid())
//     name     String              @db.VarChar(255)
//     Athletes AthletesInLineups[]
//     roster   Team                @relation(fields: [rosterId], references: [id])
//     rosterId String
//   }
