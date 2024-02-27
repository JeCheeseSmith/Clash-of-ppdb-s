--- Standard Development Schema to load into your (empty) database

CREATE TABLE Soldier(
    name VARCHAR PRIMARY KEY,
    type VARCHAR,
    health INT,
    damage INT,
    capacity INT,
    consumption INT,
    speed INT
);

CREATE TABLE Package(
    id SERIAL PRIMARY KEY,
    stone BIGINT,
    wood BIGINT,
    food BIGINT,
    gems BIGINT,
    xp BIGINT
);

CREATE TABLE "user"(
    name VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL,
    avatar VARCHAR,
    gems BIGINT,
    xp BIGINT,
    level INT,
    logout TIMESTAMP -- Last time a user logged out at this time
);

CREATE TABLE Message(
    id SERIAL PRIMARY KEY,
    moment TIMESTAMP NOT NULL,
    content TEXT NOT NULL,
    uname VARCHAR NOT NULL REFERENCES "user"(name) ON DELETE SET NULL -- Send Relation
);

CREATE TABLE Request(
    id SERIAL PRIMARY KEY REFERENCES Message(id) ON DELETE CASCADE,
    accept BOOL NOT NULL
);

CREATE TABLE TransferRequest(
    rid SERIAL PRIMARY KEY REFERENCES Request(id) ON DELETE CASCADE,
    pid SERIAL NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ClanRequest(
    id SERIAL PRIMARY KEY REFERENCES Request(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Admin(
    name VARCHAR PRIMARY KEY REFERENCES "user"(name) ON DELETE CASCADE
);

CREATE TABLE Guild(
    name VARCHAR PRIMARY KEY,
    uname VARCHAR NOT NULL REFERENCES "user"(name) ON DELETE CASCADE, -- Leader Relation
    status VARCHAR,
    description TEXT
);

CREATE TABLE Settlement(
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    mapX INT UNIQUE NOT NULL, -- Coordinate on the map
    mapY INT UNIQUE NOT NULL,
    pid SERIAL NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Has Relation: Resources currently in the Settlement
    uname VARCHAR NOT NULL REFERENCES "user"(name) ON DELETE CASCADE -- Owns Relation
);

CREATE TABLE Achievement(
    name VARCHAR PRIMARY KEY,
    task TEXT NOT NULL, -- Description of the tasks to do
    pid SERIAL NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE -- Contains Relation
);

CREATE TABLE Quest(
    VARCHAR name PRIMARY KEY REFERENCES Achievement(name) ON DELETE CASCADE ON UPDATE CASCADE,
    deadline TIMESTAMP NOT NULL
);

CREATE TABLE Transfer(
    id SERIAL PRIMARY KEY,
    speed INT,
    sidto SERIAL NOT NULL REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- To Relation
    discovered BOOL NOT NULL,
    sidfrom SERIAL NOT NULL REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- From Relation
    pid SERIAL NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE -- Contains Relation
);

CREATE TABLE Buildable(
    name VARCHAR PRIMARY KEY,
    type VARCHAR NOT NULL,
    production TEXT NOT NULL, -- The mathematical function to evaluate the resource production with
    storage BIGINT,
    cost SERIAL NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Costs Relation
    drawback SERIAL NOT NULL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE -- Drawback Relation
);

CREATE TABLE Building(
    id SERIAL,
    name VARCHAR REFERENCES Buildable(name) ON DELETE CASCADE ON UPDATE CASCADE,
    level INT NOT NULL,
    gridX INT UNIQUE NOT NULL, -- Coordinate on the grid
    gridY INT UNIQUE NOT NULL,
    sid SERIAL NOT NULL REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Contains Relation
    PRIMARY KEY (id,name)
);

CREATE TABLE Friend(
    uname1 VARCHAR REFERENCES "user"(name) ON DELETE CASCADE ON UPDATE CASCADE,
    uname2 VARCHAR REFERENCES "user"(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(uname1,uname2)
);

CREATE TABLE Member(
    uname VARCHAR  REFERENCES "user"(name) ON DELETE CASCADE ON UPDATE CASCADE,
    gname VARCHAR REFERENCES Guild(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (uname,gname)
);

CREATE TABLE Retrieved(
    mid SERIAL REFERENCES Message(id) ON DELETE CASCADE ON UPDATE CASCADE,
    uname VARCHAR REFERENCES "user"(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (mid,uname)
);

CREATE TABLE Shared(
    mid SERIAL REFERENCES Message(id) ON DELETE CASCADE ON UPDATE CASCADE,
    gname VARCHAR REFERENCES Guild(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (mid,gname)
);

CREATE TABLE Intercept(
    tid1 SERIAL REFERENCES Transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    tid2 SERIAL REFERENCES Transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(tid1,tid2)
);

CREATE TABLE Troops(
    pid SERIAL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE,
    sname VARCHAR REFERENCES Soldier(name) ON DELETE CASCADE ON UPDATE CASCADE,
    amount INT NOT NULL,
    transferable BOOL NOT NULL,
    discovered BOOL NOT NULL,
    PRIMARY KEY (pid,sname)
);

CREATE TABLE UnlockedBuildable(
    bname VARCHAR REFERENCES Buildable(name) ON DELETE CASCADE ON UPDATE CASCADE,
    sid SERIAL REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE,
    level INT,
    PRIMARY KEY (bname,sid)
);

CREATE TABLE UnlockedSoldier(
    sname VARCHAR REFERENCES Soldier(name) ON DELETE CASCADE ON UPDATE CASCADE,
    sid SERIAL REFERENCES Settlement(id) ON DELETE CASCADE ON UPDATE CASCADE,
    level INT,
    PRIMARY KEY (sid,sname)
);

CREATE TABLE WheelofFortune(
    uname VARCHAR REFERENCES "user"(name) ON DELETE CASCADE ON UPDATE CASCADE,
    pid SERIAL REFERENCES Package(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (pid,uname)
);

CREATE TABLE Achieved(
    uname VARCHAR REFERENCES "user"(name) ON DELETE CASCADE ON UPDATE CASCADE,
    aname VARCHAR REFERENCES Achievement(name) ON DELETE CASCADE ON UPDATE CASCADE,
    moment TIMESTAMP,
    PRIMARY KEY (uname,aname)
);

INSERT INTO "user"(name,password) VALUES('watson','1234')