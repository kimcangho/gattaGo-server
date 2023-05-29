const regattas = [
    {
        name: "Pickering Dragon Boat Festival",
        address: "Bruce Hanscombe Park",
        phone: "416-562-9089",
        email: "katy.dunlop@alkame.ca",
        startDate: new Date("2023-06-03"),
        endDate: new Date("2023-06-04"),
    },
    {
        name: "Toronto International Dragon Boat Race Festival",
        address: "Toronto Island",
        phone: "416-962-8899",
        email: "info@gwnevents.com",
        startDate: new Date("2023-06-17"),
        endDate: new Date("2023-06-18"),
    },
    {
        name: "Canadian Dragon Boat Championship",
        address: "Welland International Flatwater Centre",
        phone: "647-210-5175",
        email: "director@dragonboat.ca",
        startDate: new Date("2023-07-20"),
        endDate: new Date("2023-07-23"),
    },
]

export default regattas

// model Regatta {
//     id        String            @id @default(uuid())
//     name      String            @db.VarChar(255)
//     address   String            @db.VarChar(255)
//     phone     String            @db.VarChar(255)
//     email     String            @db.VarChar(255)
//     startDate DateTime
//     endDate   DateTime
//     events    Event[]
//     teams     TeamsInRegattas[]
  
//     @@map(name: "regatta")
//   }