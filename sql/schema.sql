--- Standard Development Schema to load into your (empty) database
--- This deletes your WHOLE CURRENT DATABASE
--- USE WITH CAUTION

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE IF NOT EXISTS soldier(
    name VARCHAR PRIMARY KEY,
    type VARCHAR,
    health INT,
    damage INT,
    capacity INT,
    consumption INT,
    speed FLOAT4,
    stealth FLOAT4
);

CREATE TABLE IF NOT EXISTS package(
    id SERIAL PRIMARY KEY,
    stone BIGINT,
    wood BIGINT,
    steel BIGINT,
    food BIGINT,
    gems BIGINT,
    xp BIGINT
);

CREATE TABLE IF NOT EXISTS player(
    name VARCHAR PRIMARY KEY,
    password VARCHAR NOT NULL,
    avatar VARCHAR,
    gems BIGINT,
    xp BIGINT,
    level INT,
    logout TIMESTAMP -- Last time a user logged out at this time
);

CREATE TABLE IF NOT EXISTS message(
    id SERIAL PRIMARY KEY,
    moment TIMESTAMP NOT NULL,
    content TEXT NOT NULL,
    sname VARCHAR NOT NULL REFERENCES player(name) ON DELETE SET NULL -- Send Relation
);

CREATE TABLE IF NOT EXISTS request(
    id SERIAL PRIMARY KEY REFERENCES message(id) ON DELETE CASCADE,
    accept BOOL NOT NULL
);

CREATE TABLE IF NOT EXISTS transferRequest(
    rid SERIAL PRIMARY KEY REFERENCES request(id) ON DELETE CASCADE,
    pid SERIAL NOT NULL REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS clanRequest(
    id SERIAL PRIMARY KEY REFERENCES request(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS friendRequest(
    id SERIAL PRIMARY KEY REFERENCES request(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS admin(
    name VARCHAR PRIMARY KEY REFERENCES player(name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS guild(
    name VARCHAR PRIMARY KEY,
    pname VARCHAR NOT NULL REFERENCES player(name) ON DELETE CASCADE, -- Leader Relation
    status VARCHAR,
    description TEXT
);

CREATE TABLE IF NOT EXISTS settlement(
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    mapX INT UNIQUE NOT NULL, -- Coordinate on the map
    mapY INT UNIQUE NOT NULL,
    pid SERIAL NOT NULL REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Has Relation: Resources currently in the settlement
    pname VARCHAR NOT NULL REFERENCES player(name) ON DELETE CASCADE -- Owns Relation
);

CREATE TABLE IF NOT EXISTS achievement(
    name VARCHAR PRIMARY KEY,
    task TEXT NOT NULL, -- Description of the tasks to do
    pid SERIAL NOT NULL REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE -- Contains Relation
);

CREATE TABLE IF NOT EXISTS quest(
    VARCHAR name PRIMARY KEY REFERENCES achievement(name) ON DELETE CASCADE ON UPDATE CASCADE,
    deadline TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS transfer(
    id SERIAL PRIMARY KEY,
    speed INT,
    sidto SERIAL NOT NULL REFERENCES settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- To Relation
    discovered BOOL NOT NULL,
    sidfrom SERIAL NOT NULL REFERENCES settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- From Relation
    pid SERIAL NOT NULL REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE -- Contains Relation
);

CREATE TABLE IF NOT EXISTS buildable(
    name VARCHAR PRIMARY KEY,
    type VARCHAR NOT NULL,
    function TEXT NOT NULL, -- The mathematical function to evaluate the resource function with
    cost SERIAL NOT NULL REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Costs Relation
    drawback SERIAL NOT NULL REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE -- Drawback Relation
);

CREATE TABLE IF NOT EXISTS building(
    id SERIAL,
    name VARCHAR REFERENCES buildable(name) ON DELETE CASCADE ON UPDATE CASCADE,
    level INT NOT NULL,
    gridX INT UNIQUE NOT NULL, -- Coordinate on the grid
    gridY INT UNIQUE NOT NULL,
    sid SERIAL NOT NULL REFERENCES settlement(id) ON DELETE CASCADE ON UPDATE CASCADE, -- Contains Relation
    PRIMARY KEY (id,name)
);

CREATE TABLE IF NOT EXISTS friend(
    pname1 VARCHAR REFERENCES player(name) ON DELETE CASCADE ON UPDATE CASCADE,
    pname2 VARCHAR REFERENCES player(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(pname1,pname2)
);

CREATE TABLE IF NOT EXISTS member(
    pname VARCHAR  REFERENCES player(name) ON DELETE CASCADE ON UPDATE CASCADE,
    gname VARCHAR REFERENCES guild(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (pname,gname)
);

CREATE TABLE IF NOT EXISTS retrieved(
    mid SERIAL REFERENCES message(id) ON DELETE CASCADE ON UPDATE CASCADE,
    pname VARCHAR REFERENCES player(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (mid,pname)
);

CREATE TABLE IF NOT EXISTS shared(
    mid SERIAL REFERENCES message(id) ON DELETE CASCADE ON UPDATE CASCADE,
    gname VARCHAR REFERENCES guild(name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (mid,gname)
);

CREATE TABLE IF NOT EXISTS intercept(
    tid1 SERIAL REFERENCES transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    tid2 SERIAL REFERENCES transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(tid1,tid2)
);

CREATE TABLE IF NOT EXISTS troops(
    pid SERIAL REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE,
    sname VARCHAR REFERENCES soldier(name) ON DELETE CASCADE ON UPDATE CASCADE,
    amount INT NOT NULL,
    transferable BOOL NOT NULL,
    discovered BOOL NOT NULL,
    PRIMARY KEY (pid,sname)
);

CREATE TABLE IF NOT EXISTS unlockedBuildable(
    bname VARCHAR REFERENCES buildable(name) ON DELETE CASCADE ON UPDATE CASCADE,
    sid SERIAL REFERENCES settlement(id) ON DELETE CASCADE ON UPDATE CASCADE,
    level INT,
    PRIMARY KEY (bname,sid)
);

CREATE TABLE IF NOT EXISTS unlockedsoldier(
    sname VARCHAR REFERENCES soldier(name) ON DELETE CASCADE ON UPDATE CASCADE,
    sid SERIAL REFERENCES settlement(id) ON DELETE CASCADE ON UPDATE CASCADE,
    level INT,
    PRIMARY KEY (sid,sname)
);

CREATE TABLE IF NOT EXISTS wheelofFortune(
    pname VARCHAR REFERENCES player(name) ON DELETE CASCADE ON UPDATE CASCADE,
    pid SERIAL REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (pid,pname)
);

CREATE TABLE IF NOT EXISTS achieved(
    pname VARCHAR REFERENCES player(name) ON DELETE CASCADE ON UPDATE CASCADE,
    aname VARCHAR REFERENCES achievement(name) ON DELETE CASCADE ON UPDATE CASCADE,
    moment TIMESTAMP,
    PRIMARY KEY (pname,aname)
);

INSERT INTO player(name,password) VALUES('watson','1234');
INSERT INTO player(name,password) VALUES('admin','1234');

INSERT INTO package(stone,wood,steel,food,gems,xp) VALUES('0','0','0','0','0','0');

INSERT INTO buildable(name,type,function,cost,drawback) VALUES('WoodcuttersCamp','production','200*x',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('Quarry','production','200*x',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('SteelMine','production','20+(25*x)',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('Farm','production','300*x',1,1);

-- INSERT INTO buildable(name,type,function,storage,cost,drawback) VALUES('Castle','storage');
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('Wood','storage','2000*2^(x)',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('Stone','storage','2000*2^(x)',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('Steel','storage','10000*(2*x)',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('Food','storage','2000*2^(x)',1,1);

INSERT INTO buildable(name,type,function,cost,drawback) VALUES('Stables','defense','1,1*x',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('ArcherTower','defense','1,1*x',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('LookoutTower','defense','1,1*x',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('BlackSmith','defense','1,1*x',1,1);
INSERT INTO buildable(name,type,function,cost,drawback) VALUES('Tavern','defense','1,1*x',1,1);

INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('ArmoredFootman','HeavyInfantry',15,10,5,2,1,1);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Huskarl','HeavyInfantry',25,15,5,3,1,1);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('OrderKnight','HeavyInfantry',45,25,5,4,1,1);

INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Guardsman','Spearmen',12,12,8,2,1.3,1);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Pikeman','Spearmen',20,20,5,8,3.3,1);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Halbardier','Spearmen',32,32,8,4,1.3,1);

INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Horseman','Cavalry',20,20,7,6,2,0.3);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Knight','Cavalry',40,40,5,12,2,0.3);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('WarElephant','Cavalry',45,45,7,15,2,0.3);

INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Bowman','Ranged',10,15,10,2,1.4,1);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Longbowman','Ranged',15,25,10,3,1.4,1);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Crossbowman','Ranged',25,45,10,4,1.4,1);

INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Bandit','Skirmishers',8,12,20,3,1.2,3);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Militia','Skirmishers',12,28,20,5,1.2,3);
INSERT INTO soldier(name, type, health, damage, capacity, consumption, speed,stealth) VALUES('Skirmisher','Skirmishers',20,40,20,6,1.2,3);