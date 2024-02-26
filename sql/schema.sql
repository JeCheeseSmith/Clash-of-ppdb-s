--- Standard Development Schema to load into your (empty) database

CREATE TABLE Message(
    SERIAL id PRIMARY KEY,
    DATETIME moment,
    TEXT content
)

CREATE TABLE Request(
    SERIAL id PRIMARY KEY REFERENCES Message(id),
    BOOL status
)

CREATE TABLE TransferRequest(
    SERIAL id PRIMARY KEY REFERENCES Request(id)
)

CREATE TABLE ClanRequest(
    SERIAL id PRIMARY KEY REFERENCES Request(id)
)


CREATE TABLE User(
    VARCHAR name PRIMARY KEY,
    VARCHAR password NOT NULL,
    VARCHAR avatar NOT NULL,
    BIGINT gems,
    BIGINT xp,
    SERIAL mid NOT NULL REFERENCES Message(id) -- Send relation
)

CREATE TABLE Admin(
    VARCHAR name PRIMARY KEY REFERENCES User(name)
)

CREATE TABLE Guild(
    VARCHAR name PRIMARY KEY,
    VARCHAR uname NOT NULL REFERENCES User(name), --Guild Leader relation
    VARCHAR status,
    TEXT description
)

CREATE TABLE Settlement(
    SERIAL id PRIMARY KEY,
    VARCHAR name UNIQUE NOT NULL,
    INT mapX UNIQUE NOT NULL,
    INT mapY UNIQUE NOT NULL
)

CREATE TABLE Achievement(
    VARCHAR name PRIMARY KEY,
    TEXT task NOT NULL, --Description of the tasks to do
)

CREATE TABLE Quest(
    VARCHAR name PRIMARY KEY REFERENCES Achievement(name),
    DATETIME deadline NOT NULL
)

CREATE TABLE Package(
    SERIAL id PRIMARY KEY,
    BIGINT stone,
    BIGINT wood,
    BIGINT food,
    BIGINT gems,
    BIGINT xp
)

CREATE TABLE Transfer(
    SERIAL id PRIMARY KEY,
    INT speed,
)

CREATE TABLE Buildable(
    VARCHAR name PRIMARY KEY,
    VARCHAR type NOT NULL,
    TEXT production NOT NULL, -- The mathematical function to evaluate the resource production with
    BIGINT storage
)

CREATE TABLE Building(
    SERIAL id,
    VARCHAR name FOREIGN KEY REFERENCES Buildable(name),
    INT level NOT NULL,
    INT gridX UNIQUE NOT NULL,
    INT gridY UNIQUE NOT NULL,
    PRIMARY KEY (id,name)
)

CREATE TABLE Troop(
    VARCHAR type PRIMARY KEY,
    INT health,
    INT damage,
    INT capacity,
    INT consumption,
    INT speed,
)

CREATE TABLE Friend(
    VARCHAR uname1 REFERENCES User(name),
    VARCHAR uname2 REFERENCES User(name),
    PRIMARY KEY(uname1,uname2)
)

CREATE TABLE Member(
    VARCHAR uname REFERENCES User(name),
    VARCHAR gname REFERENCES Guild(name),
    PRIMARY KEY (uname,gname)
)

CREATE TABLE Retrieved(
    SERIAL mid REFERENCES Message(id),
    VARCHAR uname REFERENCES User(name)
)

CREATE TABLE Shared(
    SERIAL mid REFERENCES Message(id),
    VARCHAR gname REFERENCES Guild(name)
)