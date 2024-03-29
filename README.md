# gattaGo-server

> gattaGo is a dragonboat team coaching tool designed to track teams, manage athletes and build boat lineups.

NOTE: for front-end documentation, see [here](https://github.com/kimcangho/gattaGo-client#readme).

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Next Steps](#next-steps)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## General Information

- Dragonboating is a flatwater canoe sport where teams of 22 (1 drummer, 20 paddlers and 1 steersperson) race each over a given distance.
- Traditional means of managing teams vary from tactile pen-and-paper to spreadsheet and print-out implementations.
- gattaGo aims to provide a web application alternative of tracking dragonboat teams, athlete details and boat lineups.
- This project was conceived to reinforce full-stack web development practices and to address a niche opportunity within an amateur sport.

## Technologies Used

- Express.js - version 4.18.2
- Prisma - version 5.3.1
- MySQL - version 8.0.33-arm64
- Typescript - version 5.0.4

## Notable Libraries Used

- bcrypt - version 5.1.0
- cors - version 2.8.5
- dotenv - 16.0.3
- faker.js - version 8.0.2
- JSON Web Token - version 9.0.0
- nodemailer - version 6.9.3
- nodemon - version 2.0.22
- ts-node - version 10.9.1

## API Reference

### Teams

#### Get all teams managed by user

```
  GET /teams/user/:userId
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `userId`  | `string` | Id of user to fetch all managed teams |

#### Create team for user to manage

```
  POST /teams/user/:userId
```

| Parameter | Type     | Description                                   |
| :-------- | :------- | :-------------------------------------------- |
| `userId`  | `string` | Id of user the created team will be linked to |

| Request Body  | Type     | Description                                               |
| :------------ | :------- | :-------------------------------------------------------- |
| `name`        | `string` | Team name                                                 |
| `division`    | `string` | Team division (U18 / U24 / Premier / SA / SB / SC / Para) |
| `level`       | `string` | Team level (Community / Sport)                            |
| `eligibility` | `string` | Team eligibility (Open / Women)                           |

#### Generate sample team for user (includes 30 athletes and 1 lineup)

```
  POST /teams/user/:userId/generateFullTeam
```

| Parameter | Type     | Description                                            |
| :-------- | :------- | :----------------------------------------------------- |
| `userId`  | `string` | Id of user the generated sample team will be linked to |

#### Get team information

```
  GET /teams/:teamId
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `teamId`  | `string` | Id of team to retrieve details from |

#### Update team

```
  PUT /teams/:teamId
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `teamId`  | `string` | Id of team to update details |

| Request Body  | Type     | Description                                               |
| :------------ | :------- | :-------------------------------------------------------- |
| `name`        | `string` | Team name                                                 |
| `division`    | `string` | Team division (U18 / U24 / Premier / SA / SB / SC / Para) |
| `level`       | `string` | Team level (Community / Sport)                            |
| `eligibility` | `string` | Team eligibility (Open / Women)                           |

#### Delete team

```
  DELETE /teams/:teamId
```

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `teamId`  | `string` | Id of team to delete |

#### Get team athletes

```
  GET /teams/:teamId/athletes
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `teamId`  | `string` | Id of team with athletes to fetch |

#### Delete team athletes

```
  DELETE /teams/:teamId/athletes
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `teamId`  | `string` | Id of team with athletes to delete |

#### Create new athlete for team

```
  POST /teams/:teamId/athletes/:athleteId
```

| Parameter   | Type     | Description                  |
| :---------- | :------- | :--------------------------- |
| `teamId`    | `string` | Id of team                   |
| `athleteId` | `string` | Id of athlete to add to team |

#### Delete athlete from team

```
  DELETE /teams/:teamId/athletes/:athleteId
```

| Parameter   | Type     | Description             |
| :---------- | :------- | :---------------------- |
| `teamId`    | `string` | Id of team              |
| `athleteId` | `string` | Id of athlete to delete |

#### Get all lineups from team

```
  GET /teams/:teamId/lineups
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `teamId`  | `string` | Id of team to fetch lineups from |

#### Create new lineup for team

```
  POST /teams/:teamId/lineups
```

| Parameter | Type     | Description                     |
| :-------- | :------- | :------------------------------ |
| `teamId`  | `string` | Id of team to create lineup for |

| Request Body | Type       | Description                                                         |
| :----------- | :--------- | :------------------------------------------------------------------ |
| `athletes`   | `string[]` | Array of athletes within lineup. Includes athlete info and position |
| `name`       | `string`   | Lineup name                                                         |

#### Delete all lineups from team

```
  DELETE /teams/:teamId/lineups
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `teamId`  | `string` | Id of team to delete lineups from |

#### Get lineup

```
  GET /teams/:teamId/lineups/:lineupId
```

| Parameter  | Type     | Description                   |
| :--------- | :------- | :---------------------------- |
| `teamId`   | `string` | Id of team to get lineup from |
| `lineupId` | `string` | Id of lineup to fetch         |

#### Update lineup

```
   PUT /teams/:teamId/lineups/:lineupId
```

| Parameter  | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `teamId`   | `string` | Id of team to update lineup |
| `lineupId` | `string` | Id of lineup to update      |

| Request Body | Type       | Description                                                                   |
| :----------- | :--------- | :---------------------------------------------------------------------------- |
| `athletes`   | `string[]` | Array of athletes within lineup to update. Includes athlete info and position |
| `name`       | `string`   | Lineup name                                                                   |

#### Delete lineup

```
   DELETE /teams/:teamId/lineups/:lineupId
```

| Parameter  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `teamId`   | `string` | Id of team to delete lineup from |
| `lineupId` | `string` | Id of lineup to delete           |

#### Get team dashboard details

```
   GET /teams/:teamId/dashboard
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `teamId`  | `string` | Id of team to fetch dashbaord info from |

### Athletes

#### Create new athlete

```
  POST /athletes/
```

| Request Body       | Type      | Description                              |
| :----------------- | :-------- | :--------------------------------------- |
| `teamId`           | `string`  | Team id                                  |
| `email`            | `string`  | Email                                    |
| `firstName`        | `string`  | First name                               |
| `lastName`         | `string`  | Last name                                |
| `eligibiility`     | `string`  | Eligibility (Open / Women)               |
| `isAvailable`      | `boolean` | Availability                             |
| `paddleSide`       | `string`  | Paddle side (Left / Right / Both / None) |
| `weight`           | `number`  | Weight (lbs)                             |
| `notes`            | `string`  | Miscellaneous notes on athlete           |
| `paddlerSkillsObj` | `object`  | Boolean flags for athlete's skills       |

#### Get athlete

```
  GET /athletes/:athleteId
```

| Parameter   | Type     | Description                      |
| :---------- | :------- | :------------------------------- |
| `athleteId` | `string` | Id of athlete to fetch info from |

#### Update athlete

```
  PUT /athletes/:athleteId
```

| Parameter   | Type     | Description                  |
| :---------- | :------- | :--------------------------- |
| `athleteId` | `string` | Id of athlete to update info |

| Request Body       | Type      | Description                              |
| :----------------- | :-------- | :--------------------------------------- |
| `email`            | `string`  | Email                                    |
| `firstName`        | `string`  | First name                               |
| `lastName`         | `string`  | Last name                                |
| `eligibiility`     | `string`  | Eligibility (Open / Women)               |
| `isAvailable`      | `boolean` | Availability                             |
| `paddleSide`       | `string`  | Paddle side (Left / Right / Both / None) |
| `weight`           | `number`  | Weight (lbs)                             |
| `notes`            | `string`  | Miscellaneous notes on athlete           |
| `paddlerSkillsObj` | `object`  | Boolean flags for athlete's skills       |

#### Delete athlete

```
  DELETE /athletes/:athleteId
```

| Parameter   | Type     | Description             |
| :---------- | :------- | :---------------------- |
| `athleteId` | `string` | Id of athlete to delete |

### Auth

#### Login user

```
  POST /login/
```

| Request Body | Type     | Description   |
| :----------- | :------- | :------------ |
| `email`      | `string` | User email    |
| `password`   | `string` | User password |

#### Logout user

```
  DELETE /logout/
```

| Cookie         | Type     | Description   |
| :------------- | :------- | :------------ |
| `refreshToken` | `string` | Refresh token |

#### Issue new refresh token

```
  GET /refresh/
```

| Cookie         | Type     | Description   |
| :------------- | :------- | :------------ |
| `refreshToken` | `string` | Refresh token |

#### Register user

```
  POST /register/
```

| Request Body | Type     | Description   |
| :----------- | :------- | :------------ |
| `email`      | `string` | User email    |
| `password`   | `string` | User password |

#### Send reset password email

```
  POST /reset/
```

| Request Body | Type     | Description |
| :----------- | :------- | :---------- |
| `email`      | `string` | User email  |

#### Update password

```
  PUT /reset/
```

| Request Body | Type     | Description         |
| :----------- | :------- | :------------------ |
| `email`      | `string` | User email          |
| `password`   | `string` | User password       |
| `resetCode`  | `string` | Password reset code |

#### Get user email for password reset

```
  GET /reset/:resetCodeId
```

| Parameter     | Type     | Description         |
| :------------ | :------- | :------------------ |
| `resetCodeId` | `string` | Password reset code |

## Setup

1. Download or clone repository.
2. Install application.
   > npm i
3. Create .env file and environment variables (refer to .env.sample files for environment variable names).
4. Ensure that MySQL server is operational.
5. Run script to compile Typescript code into Javascript.
   > npm run build
6. Run script to set up MySQL Prisma Schemas.
   > npm run migrate
7. Spin up back-end server.
   > npm run serve

## Usage

### Scripts

| Script            | Description                                                                             |
| :---------------- | :-------------------------------------------------------------------------------------- |
| `npm run build`   | Compile Typescript code into Javascript.                                                |
| `npm run dev`     | Compile Typescript code into Javascript and spin up server.                             |
| `npm run serve`   | Spin up server.                                                                         |
| `npm run migrate` | Create Prisma MySQL database schemas.                                                   |
| `npm run seed`    | Execute seed file to populate database with sample users, teams, athletes, and lineups. |
| `npm run reseed`  | Reset database with seed data.                                                          |
| `npm run studio`  | Launch Prisma Studio UI in browser.                                                     |

## Project Status

Project is: _in progress (phase1)_.  
Currently working on: _deployment_.

## Next Steps

Room for improvement:

- Separate database calls into services for team controller.
- General type-checking.
- Optimize touch features for lineup page.

To do:

- Deploy application.

Future Phase Ideas:

- Race plan weather section.
- User roles: managers (read+write), athletes (read-only), event organizers.
- Regatta and event support for event organizers.
- Live race day progressions and results using websockets.

Known issues:

- Deployment issues where cookies are unable to be received by front-end from back-end. _removed refresh token and cookie handling logic_

## Contact

Created by [Kent K.C. Ho](https://www.linkedin.com/in/kentkcho/) - feel free to contact me!

> Written with [StackEdit](https://stackedit.io/).
