--- Standard Development Schema to load into your (empty) database

---CHECK: Leader=Member and max 1 Leader
---CHECK: TransferRequest != Clan Request

CREATE TABLE Soldier(
    VARCHAR type PRIMARY KEY,
    INT health,
    INT damage,
    INT capacity,
    INT consumption,
    INT speed,
)

CREATE TABLE Package(
    SERIAL id PRIMARY KEY,
    BIGINT stone,
    BIGINT wood,
    BIGINT food,
    BIGINT gems,
    BIGINT xp
)

CREATE TABLE User(
    VARCHAR name PRIMARY KEY,
    VARCHAR password NOT NULL,
    VARCHAR avatar NOT NULL,
    BIGINT gems,
    BIGINT xp,
    INT level
)

CREATE TABLE Message(
    SERIAL id PRIMARY KEY,
    DATETIME moment,
    TEXT content,
    VARCHAR uname NOT NULL REFERENCES User(name) -- Send Relation
)

CREATE TABLE Request(
    SERIAL id PRIMARY KEY REFERENCES Message(id),
    BOOL accept
)

CREATE TABLE TransferRequest(
    SERIAL rid PRIMARY KEY REFERENCES Request(id),
    SERIAL pid NOT NULL REFERENCES Package(id),
)

CREATE TABLE ClanRequest(
    SERIAL id PRIMARY KEY REFERENCES Request(id)
)

CREATE TABLE Admin(
    VARCHAR name PRIMARY KEY REFERENCES User(name)
)

CREATE TABLE Guild(
    VARCHAR name PRIMARY KEY,
    VARCHAR uname NOT NULL REFERENCES User(name), -- Leader Relation
    VARCHAR status,
    TEXT description
)

CREATE TABLE Settlement(
    SERIAL id PRIMARY KEY,
    VARCHAR name UNIQUE NOT NULL,
    INT mapX UNIQUE NOT NULL, -- Coordinate on the map
    INT mapY UNIQUE NOT NULL,
    SERIAL pid NOT NULL REFERENCES Package(id), -- Has Relation: Resources currently in the Settlement
    VARCHAR uname NOT NULL REFERENCES User(name) -- Owns Relation
)

CREATE TABLE Achievement(
    VARCHAR name PRIMARY KEY,
    TEXT task NOT NULL, -- Description of the tasks to do
    SERIAL pid NOT NULL REFERENCES Package(id) -- Contains Relation
)

CREATE TABLE Quest(
    VARCHAR name PRIMARY KEY REFERENCES Achievement(name),
    DATETIME deadline NOT NULL
)

CREATE TABLE Transfer(
    SERIAL id PRIMARY KEY,
    INT speed,
    SERIAL sidto NOT NULL REFERENCES Settlement(id), -- To Relation
    BOOL discovered NOT NULL,
    SERIAL sidfrom NOT NULL REFERENCES Settlement(id), -- From Relation
    SERIAL pid NOT NULL REFERENCES Package(id), -- Contains Relation
)

CREATE TABLE Buildable(
    VARCHAR name PRIMARY KEY,
    VARCHAR type NOT NULL,
    TEXT production NOT NULL, -- The mathematical function to evaluate the resource production with
    BIGINT storage,
    SERIAL cost NOT NULL REFERENCES Package(id), -- Costs Relation
    SERIAL drawback NOT NULL REFERENCES Package(id), -- Drawback Relation
)

CREATE TABLE Building(
    SERIAL id,
    VARCHAR name FOREIGN KEY REFERENCES Buildable(name),
    INT level NOT NULL,
    INT gridX UNIQUE NOT NULL, -- Coordinate on the grid
    INT gridY UNIQUE NOT NULL,
    SERIAL sid NOT NULL REFERENCES Settlement(id), -- Contains Relation
    PRIMARY KEY (id,name)
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

CREATE TABLE Intercept(
    SERIAL tid1 REFERENCES Transfer(id),
    SERIAL tid2 REFERENCES Transfer(id),
    PRIMARY KEY(tid1,tid2)
)

CREATE TABLE Troops(
    SERIAL pid REFERENCES Package(id),
    VARCHAR stype REFERENCES Soldier(type),
    INT amount,
    BOOL transferable,
    BOOL discovered,
    PRIMARY KEY (pid,stype)
)

CREATE TABLE UnlockedBuildable(
    VARCHAR bname REFERENCES Buildable(name),
    SERIAL sid REFERENCES Settlement(id),
    INT level,
    PRIMARY KEY (bname,sid)
)

CREATE TABLE UnlockedSoldier(
    VARCHAR stype REFERENCES Soldier(type),
    SERIAL sid REFERENCES Settlement(id),
    INT level,
    PRIMARY KEY (sid,bname)
)

CREATE TABLE WheelofFortune(
    VARCHAR uname REFERENCES User(name),
    SERIAL pid REFERENCES Package(id),
    PRIMARY KEY (pid,uname)
)

CREATE TABLE Achieved(
    VARCHAR uname REFERENCES User(name),
    VARCHAR aname REFERENCES Achievement(name),
    DATETIME moment,
    PRIMARY KEY (uname,aname)
)