time management


Monster query:

CREATE VIEW friendly AS(
-- Subquery to get all players friendly associated with player 'a'
SELECT pname2 AS pname FROM friend WHERE pname1 = 'a' UNION SELECT pname1 AS pname FROM friend WHERE pname2 = 'a' -- All friends
UNION
-- All clan members
SELECT pname FROM member WHERE cname IN (SELECT cname FROM member WHERE pname='a')
UNION
-- Player its self
SELECT 'a'
-- Except the admin (since everyone is a friend with admin
EXCEPT
SELECT 'admin');

SELECT * FROM timer WHERE sid IN -- Get all timers for my settlements
(SELECT id FROM settlement WHERE pname='a') -- All my settlements
UNION
-- Timers interacting with friendly
SELECT * FROM timer WHERE type='transfer' OR type='espionage' OR type='attack' OR type = 'outpost' AND oid IN
( -- Transfer interacting with friendly
SELECT id FROM transfer WHERE pname IN(friendly) -- Transfer owned by friendly
UNION
-- Someone's Transfers interacting with friendly transfers
SELECT id FROM transfer WHERE totype=True and idto IN (SELECT id FROM transfer WHERE pname IN(friendly))
UNION
-- Someone's Transfers going to friendly settlements
SELECT id FROM transfer WHERE totype=False and idto IN (SELECT id FROM settlement WHERE pname IN (friendly))
);