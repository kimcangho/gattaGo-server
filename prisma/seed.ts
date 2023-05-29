import regattas from "./data/regattas";
import events from "./data/events";
import teams from "./data/teams";
import lineups from "./data/lineups";
import athletes from "./data/athletes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//  Seed Database Tables
const seedRegattas = async () => {
  for (let regattaUnit of regattas) {
    if (regattaUnit.name === "Pickering Dragon Boat Festival") {
      await prisma.regatta.create({
        data: {
          ...regattaUnit,
          events: {
            create: events,
          },
        },
      });
    } else {
      await prisma.regatta.create({
        data: regattaUnit,
      });
    }
  }
};

const seedTeamsInRegattas = async () => {
  const pickeringRegattaId = await prisma.regatta.findFirst({
    where: {
      name: "Pickering Dragon Boat Festival",
    },
    select: {
      id: true,
    },
  });

  const { id: regattaId } = pickeringRegattaId!;

  const allTeamIds = await prisma.team.findMany({
    select: {
      id: true,
    },
  });

  for (let teamUnit of allTeamIds) {
    const { id: teamId } = teamUnit;
    await prisma.teamsInRegattas.create({
      data: {
        regattaId,
        teamId,
      },
    });
  }
};

const seedTeams = async () => {
  for (let teamUnit of teams) {
    if (teamUnit.name === "The Dodgefathers") {
      await prisma.team.create({
        data: {
          ...teamUnit,
          lineups: {
            create: lineups,
          },
        },
      });
    } else {
      await prisma.team.create({
        data: teamUnit,
      });
    }
  }
};

const seedTeamsInEvents = async () => {

  //  500m Heat
  const foundFiveHundoHeats = await prisma.event.findMany({
    where: {
      distance: "500m",
      progressionType: "heat",
    },
    select: {
      id: true,
      entries: true,
    },
  });

  const foundTeamIds = await prisma.team.findMany({
    select: {
      id: true,
    },
  });

  //  add teams to events (4 teams per 500m heat)
  for (let i = 0; i < foundTeamIds.length; i++) {
    let j = Math.floor(i / 4);
    await prisma.teamsInEvents.create({
      data: {
        eventId: foundFiveHundoHeats[j].id,
        teamId: foundTeamIds[i].id,
      },
    });
  }

  const foundTwoKiloFinalEventId = await prisma.event.findFirst({
    where: {
      distance: "2000m",
    },
    select: {
      id: true,
    },
  });
  const { id: eventId } = foundTwoKiloFinalEventId!;

  const allTeamIds = await prisma.team.findMany({
    select: {
      id: true,
    },
  });
  for (let teamUnit of allTeamIds) {
    const { id: teamId } = teamUnit;
    await prisma.teamsInEvents.create({
      data: {
        teamId,
        eventId,
      },
    });
  }
};

const seedAthletes = async () => {
  for (let athleteUnit of athletes) {
    await prisma.athlete.create({
      data: athleteUnit,
    });
  }
};

const seedAthletesInTeams = async () => {
  const foundTeamId = await prisma.team.findFirst({
    where: {
      name: "The Dodgefathers",
    },
    select: {
      id: true,
    },
  });
  const { id: teamId } = foundTeamId!;

  const allAthleteIds = await prisma.athlete.findMany({
    select: {
      id: true,
    },
  });

  for (let athleteUnit of allAthleteIds) {
    const { id: athleteId } = athleteUnit;
    await prisma.athletesInTeams.create({
      data: {
        athleteId,
        teamId,
      },
    });
  }
};

const seedAthletesInLineups = async () => {
  const foundLineupIds = await prisma.lineup.findMany({
    select: {
      id: true,
    },
  });

  const seedTwoHundoHeats = async () => {
    const foundDrummer = await prisma.athlete.findFirst({
      where: {
        firstName: "Drummer",
      },
      select: {
        id: true,
      },
    });

    const { id: drummerId } = foundDrummer!;
    await prisma.athletesInLineups.create({
      data: {
        athleteId: drummerId,
        lineupId: foundLineupIds[0].id,
        position: 0,
      },
    });

    const foundSteers = await prisma.athlete.findFirst({
      where: {
        firstName: "Steers",
      },
      select: {
        id: true,
      },
    });

    const { id: steersId } = foundSteers!;
    await prisma.athletesInLineups.create({
      data: {
        athleteId: steersId,
        lineupId: foundLineupIds[0].id,
        position: 21,
      },
    });

    const foundPaddlers = await prisma.athlete.findMany({
      where: {
        isAvailable: true,
        OR: [
          {
            paddleSide: "L",
          },
          {
            paddleSide: "R",
          },
        ],
      },
      select: {
        id: true,
      },
    });

    for (let i = 1; i <= foundPaddlers.length; i++) {
      await prisma.athletesInLineups.create({
        data: {
          position: i,
          athleteId: foundPaddlers[i - 1].id,
          lineupId: foundLineupIds[0].id,
        },
      });
    }
  };

  const seedFiveHundoHeats = async () => {
    const foundDrummer = await prisma.athlete.findFirst({
      where: {
        firstName: "Drummer",
      },
      select: {
        id: true,
      },
    });

    const { id: drummerId } = foundDrummer!;
    await prisma.athletesInLineups.create({
      data: {
        athleteId: drummerId,
        lineupId: foundLineupIds[1].id,
        position: 0,
      },
    });

    const foundSteers = await prisma.athlete.findFirst({
      where: {
        firstName: "Steers",
      },
      select: {
        id: true,
      },
    });

    const { id: steersId } = foundSteers!;
    await prisma.athletesInLineups.create({
      data: {
        athleteId: steersId,
        lineupId: foundLineupIds[1].id,
        position: 21,
      },
    });

    const foundPaddlers = await prisma.athlete.findMany({
      take: 20,
      orderBy: [{ id: "desc" }],
      where: {
        isAvailable: true,
        OR: [
          {
            paddleSide: "B",
          },
          {
            paddleSide: "L",
          },
          {
            paddleSide: "R",
          },
        ],
      },
      select: {
        paddleSide: true,
        id: true,
      },
    });

    for (let i = 1; i <= foundPaddlers.length; i++) {
      await prisma.athletesInLineups.create({
        data: {
          position: i,
          athleteId: foundPaddlers[i - 1].id,
          lineupId: foundLineupIds[1].id,
        },
      });
    }
  };

  const seedTwoKayFinal = async () => {
    const foundDrummer = await prisma.athlete.findFirst({
      where: {
        firstName: "Drummer",
      },
      select: {
        id: true,
      },
    });

    const { id: drummerId } = foundDrummer!;
    await prisma.athletesInLineups.create({
      data: {
        athleteId: drummerId,
        lineupId: foundLineupIds[2].id,
        position: 0,
      },
    });

    const foundSteers = await prisma.athlete.findFirst({
      where: {
        firstName: "Steers",
      },
      select: {
        id: true,
      },
    });

    const { id: steersId } = foundSteers!;
    await prisma.athletesInLineups.create({
      data: {
        athleteId: steersId,
        lineupId: foundLineupIds[2].id,
        position: 21,
      },
    });

    const foundPaddlers = await prisma.athlete.findMany({
      take: 20,
      orderBy: [{ id: "asc" }],
      where: {
        isAvailable: true,
        OR: [
          {
            paddleSide: "B",
          },
          {
            paddleSide: "L",
          },
          {
            paddleSide: "R",
          },
        ],
      },
      select: {
        paddleSide: true,
        id: true,
      },
    });

    for (let i = 1; i <= foundPaddlers.length; i++) {
      await prisma.athletesInLineups.create({
        data: {
          position: i,
          athleteId: foundPaddlers[i - 1].id,
          lineupId: foundLineupIds[2].id,
        },
      });
    }
  };

  seedTwoHundoHeats();
  seedFiveHundoHeats();
  seedTwoKayFinal();
};

const seedDatabase = async () => {
  try {
    await seedRegattas();
    await seedTeams();
    await seedTeamsInRegattas();
    await seedTeamsInEvents();
    await seedAthletes();
    await seedAthletesInTeams();
    await seedAthletesInLineups();
    prisma.$disconnect;
  } catch (err) {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedDatabase();
