# gattaGo-server

> gattaGo is a dragonboat team coaching tool designed to track teams, manage athletes and build boat lineups.

NOTE: for front-end documentation, see [here](https://github.com/kimcangho/gattaGo-client).

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Screenshots](#screenshots)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## General Information

- Dragonboating is a flatwater canoe sport where teams of 22 (1 drummer, 20 paddlers and 1 steersperson) race each over a given distance.
- Traditional means of managing teams vary from tactile pen-and-paper to spreadsheet and print-out implementations.
- gattaGo aims to provide a web application alternative of tracking dragonboat teams, athlete details and boat lineups.
- This project was conceived to reinforce full-stack web development practices and to address a niche opportunity within an amateur sport.

## Technologies Used

- React.js - version 18.2.0
- TailwindCSS - version 3.3.2
- Typescript - version 5.0.2
- Vite.js - version 4.3.9

## Notable Libraries Used

- axios - version 1.4.0
- chart.js - version 4.3.3
- dnd-kit - version 6.0.8
- framer-motion - version 10.15.2
- react-chart-js-2 - version 5.2.0
- react-hook-form - version 7.44.3

## API Reference

### Teams

#### Get all teams managed by user

```http
  GET /teams/user/:userId
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `userId`  | `string` | Id of user to fetch all managed teams |

#### Create team for user to manage

```http
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

```http
  POST /teams/user/:userId/generateFullTeam
```

| Parameter | Type     | Description                                            |
| :-------- | :------- | :----------------------------------------------------- |
| `userId`  | `string` | Id of user the generated sample team will be linked to |

#### Get team information

```http
  GET /teams/:teamId
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `teamId`  | `string` | Id of team to retrieve details from |

#### Update team

```http
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

```http
  DELETE /teams/:teamId
```

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `teamId`  | `string` | Id of team to delete |

#### Get team athletes

```http
  GET /teams/:teamId/athletes
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `teamId`  | `string` | Id of team with athletes to fetch |

#### Delete team athletes

```http
  DELETE /teams/:teamId/athletes
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `teamId`  | `string` | Id of team with athletes to delete |

#### Create new athlete for team

```http
  POST /teams/:teamId/athletes/:athleteId
```

| Parameter   | Type     | Description                  |
| :---------- | :------- | :--------------------------- |
| `teamId`    | `string` | Id of team                   |
| `athleteId` | `string` | Id of athlete to add to team |

#### Delete athlete from team

```http
  DELETE /teams/:teamId/athletes/:athleteId
```

| Parameter   | Type     | Description             |
| :---------- | :------- | :---------------------- |
| `teamId`    | `string` | Id of team              |
| `athleteId` | `string` | Id of athlete to delete |

#### Get all lineups from team

```http
  GET /teams/:teamId/lineups
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `teamId`  | `string` | Id of team to fetch lineups from |

#### Create new lineup for team

```http
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

```http
  DELETE /teams/:teamId/lineups
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `teamId`  | `string` | Id of team to delete lineups from |

#### Get lineup

```http
  GET /teams/:teamId/lineups/:lineupId
```

| Parameter  | Type     | Description                   |
| :--------- | :------- | :---------------------------- |
| `teamId`   | `string` | Id of team to get lineup from |
| `lineupId` | `string` | Id of lineup to fetch         |

#### Update lineup

```http
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

```http
   DELETE /teams/:teamId/lineups/:lineupId
```

| Parameter  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `teamId`   | `string` | Id of team to delete lineup from |
| `lineupId` | `string` | Id of lineup to delete           |

#### Get team dashboard details

```http
   GET /teams/:teamId/dashboard
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `teamId`  | `string` | Id of team to fetch dashbaord info from |

### Athletes

#### Create new athlete

```http
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

```http
  GET /athletes/:athleteId
```

| Parameter   | Type     | Description                      |
| :---------- | :------- | :------------------------------- |
| `athleteId` | `string` | Id of athlete to fetch info from |

#### Update athlete

```http
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

```http
  DELETE /athletes/:athleteId
```

| Parameter   | Type     | Description             |
| :---------- | :------- | :---------------------- |
| `athleteId` | `string` | Id of athlete to delete |

### Auth

#### Login user

```http
  GET /resource/
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` |             |

#### Logout user

```http
  GET /resource/
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` |             |

#### Refresh token

```http
  GET /resource/
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` |             |

#### Register user

```http
  GET /resource/
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` |             |

#### Reset Password

```http
  GET /resource/
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` |             |

#### Update Password

```http
  GET /resource/
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` |             |

#### Get user email

```http
  GET /resource/
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` |             |

## Screenshots

Empty Overview Page
![Empty Overview Page](https://res.cloudinary.com/di7kiyj3y/image/upload/v1692409325/gattago-empty-overview_miszyl.png)

Team Overview Page
![Team Overview Page](https://res.cloudinary.com/di7kiyj3y/image/upload/v1692409325/gattago-overview-team_thyzfs.png)

Team Dashboard Page
![Team Dashboard Page](https://res.cloudinary.com/di7kiyj3y/image/upload/v1692409325/gattago-dashboard_umznra.png)

Team Roster Page
![Team Roster Page](https://res.cloudinary.com/di7kiyj3y/image/upload/v1692409326/gattago-roster_opynqh.png)

Team Lineup Page
![Team Lineup Page](https://res.cloudinary.com/di7kiyj3y/image/upload/v1692409326/gattago-lineups_eyu4rd.png)

Team Lineup Page with Mobile and Drag-and-Drop
![Team Lineup Page with Mobile and Drag-and-Drop](https://res.cloudinary.com/di7kiyj3y/image/upload/v1692409326/gattago-lineups-responsive_oso1ph.png)

## Setup

Setup and installation instructions coming soon!

## Usage

Details coming soon!

<!-- `write-your-code-here` -->

## Project Status

Project is: _in progress_
Currently working on: _documentation_

## Room for Improvement

Room for improvement:

- General refactoring and type-checking

To do:

- Reset password functionality (backend emailing with Typescript compatible library)

Known issues:

- Touch events interfering with scrolling in lineup page.
- Password reset email feature non-functional.

## Contact

Created by [Kent K.C. Ho](https://www.linkedin.com/in/kentkcho/) - feel free to contact me!

> Written with [StackEdit](https://stackedit.io/).
