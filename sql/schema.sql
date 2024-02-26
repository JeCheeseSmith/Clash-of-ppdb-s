--- Standard Development Schema to load into your (empty) database

CREATE TABLE Soldier(
    VARCHAR type PRIMARY KEY,
    INT health,
    INT damage,
    INT capacity,
    INT consumption,
    INT speed,
);

CREATE TABLE Package(
    SERIAL id PRIMARY KEY,
    BIGINT stone,
    BIGINT wood,
    BIGINT food,
    BIGINT gems,
    BIGINT xp
);

CREATE TABLE User(
    VARCHAR name PRIMARY KEY,
    VARCHAR password NOT NULL,
    VARCHAR avatar NOT NULL,
    BIGINT gems,
    BIGINT xp,
    INT level
);

CREATE TABLE Message(
    SERIAL id PRIMARY KEY,
    DATETIME moment NOT NULL,
    TEXT content NOT NULL,
    VARCHAR uname NOT NULL REFERENCES User(name) ON DELETE SET NULL -- Send Relation
);

CREATE TABLE Request(
    SERIAL id PRIMARY KEY REFERENCES Message(id) ON DELETE CASCADE,
    BOOL accept NOT NULL
);

CREATE TABLE TransferRequest(
    SERIAL rid PRIMARY KEY REFERENCES Request(id) ON DELETE CASCADE,
    SERIAL pid NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE,
);

CREATE TABLE ClanRequest(
    SERIAL id PRIMARY KEY REFERENCES Request(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Admin(
    VARCHAR name PRIMARY KEY REFERENCES User(name) ON DELETE CASCADE
);

CREATE TABLE Guild(
    VARCHAR name PRIMARY KEY,
    VARCHAR uname NOT NULL REFERENCES User(name) ON DELETE CASCADE, -- Leader Relation
    VARCHAR status,
    TEXT description
);

CREATE TABLE Settlement(
    SERIAL id PRIMARY KEY,
    VARCHAR name UNIQUE NOT NULL,
    INT mapX UNIQUE NOT NULL, -- Coordinate on the map
    INT mapY UNIQUE NOT NULL,
    SERIAL pid NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Has Relation: Resources currently in the Settlement
    VARCHAR uname NOT NULL REFERENCES User(name) ON DELETE CASCADE -- Owns Relation
);

CREATE TABLE Achievement(
    VARCHAR name PRIMARY KEY,
    TEXT task NOT NULL, -- Description of the tasks to do
    SERIAL pid NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE -- Contains Relation
);

CREATE TABLE Quest(
    VARCHAR name PRIMARY KEY REFERENCES Achievement(name) ON DELETE CASCADE ON UPDATE CASCADE,
    DATETIME deadline NOT NULL
);

CREATE TABLE Transfer(
    SERIAL id PRIMARY KEY,
    INT speed,
    SERIAL sidto NOT NULL REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- To Relation
    BOOL discovered NOT NULL,
    SERIAL sidfrom NOT NULL REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- From Relation
    SERIAL pid NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Contains Relation
);

CREATE TABLE Buildable(
    VARCHAR name PRIMARY KEY,
    VARCHAR type NOT NULL,
    TEXT production NOT NULL, -- The mathematical function to evaluate the resource production with
    BIGINT storage,
    SERIAL cost NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Costs Relation
    SERIAL drawback NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Drawback Relation
);

CREATE TABLE Building(
    SERIAL id,
    VARCHAR name REFERENCES Buildable(name) ON DELETE CASCADE ON UPDATE CASCADE,
    INT level NOT NULL,
    INT gridX UNIQUE NOT NULL, -- Coordinate on the grid
    INT gridY UNIQUE NOT NULL,
    SERIAL sid NOT NULL REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Contains Relation
    PRIMARY KEY (id,name)
);

CREATE TABLE Friend(
    VARCHAR uname1 REFERENCES User(name) ON DELETE CASCADE ON UPDATE CASCADE,
    VARCHAR uname2 REFERENCES User(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(uname1,uname2)
);

CREATE TABLE Member(
    VARCHAR uname REFERENCES User(name) ON DELETE CASCADE ON UPDATE CASCADE,
    VARCHAR gname REFERENCES Guild(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (uname,gname)
);

CREATE TABLE Retrieved(
    SERIAL mid REFERENCES Message(id) ON DELETE CASCADE ON UPDATE CASCADE,
    VARCHAR uname REFERENCES User(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (mid,uname)
);

CREATE TABLE Shared(
    SERIAL mid REFERENCES Message(id) ON DELETE CASCADE ON UPDATE CASCADE,
    VARCHAR gname REFERENCES Guild(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (mid,gname)
);

CREATE TABLE Intercept(
    SERIAL tid1 REFERENCES Transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    SERIAL tid2 REFERENCES Transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(tid1,tid2)
);

CREATE TABLE Troops(
    SERIAL pid REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE,
    VARCHAR stype REFERENCES Soldier(type) ON DELETE CASCADE ON UPDATE CASCADE,
    INT amount NOT NULL,
    BOOL transferable NOT NULL,
    BOOL discovered NOT NULL,
    PRIMARY KEY (pid,stype)
);

CREATE TABLE UnlockedBuildable(
    VARCHAR bname REFERENCES Buildable(name) ON DELETE CASCADE ON UPDATE CASCADE,
    SERIAL sid REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INT level,
    PRIMARY KEY (bname,sid)
);

CREATE TABLE UnlockedSoldier(
    VARCHAR stype REFERENCES Soldier(type) ON DELETE CASCADE ON UPDATE CASCADE,
    SERIAL sid REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INT level,
    PRIMARY KEY (sid,bname)
);

CREATE TABLE WheelofFortune(
    VARCHAR uname REFERENCES User(name) ON DELETE CASCADE ON UPDATE CASCADE,
    SERIAL pid REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (pid,uname)
);

CREATE TABLE Achieved(
    VARCHAR uname REFERENCES User(name) ON DELETE CASCADE ON UPDATE CASCADE,
    VARCHAR aname REFERENCES Achievement(name) ON DELETE CASCADE ON UPDATE CASCADE,
    DATETIME moment,
    PRIMARY KEY (uname,aname)
);