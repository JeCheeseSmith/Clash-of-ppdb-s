# Buildings
> List of several statistics on the gameMechanics.
> > It defines how many resource are produced/time unit, storage limits, upgrade times, ... 

Initial build time for all buildings is 10 seconds unless otherwise stated.

#### Governmental buildings

Upgrade time for storage buildings

| level | upgrade time                   |
| ----- | ------------------------------ |
| 1-4   | f(x) = 600 seconden \* x       |
| 4-?   | f(x) = 3600 seconden \* 3(x-3) |
##### Grain Silo

| level | storage capacity function     |
| ----- | ----------------------------- |
| 1-9   | f(x) = 2 000 * 2^(x)          |
| 9-?   | f(x) = 1 000 000 * (x \* 1.5) |

##### Stone Stockpile

| level | storage capacity function      |
| ----- | ------------------------------ |
| 1-9   | f(x) = 200 \* x                |
| 9-?   | f(x) = 1 000 000 \* (x \* 1.5) |

##### Armory

| level | storage capacity function      |
| ----- | ------------------------------ |
| 1-9   | f(x) = 1000 \* 2x              |
| 9-?   | f(x) = 1 000 000 \* (x \* 1.5) |

##### Wood Stockpile

| level | storage capacity function      |
| ----- | ------------------------------ |
| 1-9   | f(x) = 200 \* x                |
| 9-?   | f(x) = 1 000 000 \* (x \* 1.5) |
##### Castle

| level | storage capacity function | Woodcutters | Quarries | Mines | Farms | Barracks |
| ----- | ------------------------- | ----------- | -------- | ----- | ----- | -------- |
| 1     | 500                       | 1           | 1        | 1     | 1     | 1        |
| 2     | 1000                      | 2           | 2        | 1     | 2     | 1        |
| 3     | 2000                      | 2           | 2        | 2     | 3     | 2        |
| 4     | 5000                      | 3           | 3        | 3     | 4     | 2        |
| 5     | 20000                     | 4           | 4        | 3     | 5     | 3        |
| 6     | 50000                     | 4           | 4        | 4     | 6     | 3        |
| 7     | 100000                    | 5           | 5        | 4     | 7     | 4        |

| level | Woodcutter stockpile | Stone quarry | Steel stockpile | Silo | max communication camp level |
| ----- | -------------------- | ------------ | --------------- | ---- | ---------------------------- |
| 1     | 1                    | 1            | 1               | 1    | 0                            |
| 2     | 1                    | 1            | 1               | 2    | 0                            |
| 3     | 2                    | 2            | 2               | 3    | 1                            |
| 4     | 2                    | 2            | 2               | 4    | 2                            |
| 5     | 3                    | 3            | 3               | 5    | 3                            |
| 6     | 4                    | 4            | 3               | 5    | 3                            |
| 7     | 4                    | 4            | 3               | 6    | 4                            |

| level | upgrade time             |
| ----- | ------------------------ |
| 1-?   | f(x) = 3 hours \* 2(x-1) |

| level | upgrade cost |
| ----- | ------------ |
| 1     | 1000         |
| 2     | 4000         |
| 3     | 25 000       |
| 4     | 50 000       |
| 5     | 150 000      |
| 6     | 250 000      |
| 7     | 1 000 000    |

##### Satellite castle (name to be changed?)

| level | storage capacity function | Woodcutters | Quarries | Mines | Farms | Barracks |
| ----- | ------------------------- | ----------- | -------- | ----- | ----- | -------- |
| 1     | 500                       | 1           | 1        | 1     | 1     | 1        |
| 2     | 1000                      | 1           | 1        | 1     | 2     | 1        |
| 3     | 2000                      | 2           | 2        | 2     | 3     | 2        |
| 4     | 5000                      | 2           | 2        | 2     | 3     | 2        |
| 5     | 20000                     | 3           | 3        | 3     | 4     | 2        |
Initial build time is time it takes to setup new city (1 day?)
Initial build cost scales with distance from main base (??)
Upgrade time & costs same as Castle
##### Chancery

| level | Possible extra cities |
| ----- | --------------------- |
| 1     | 1                     |
| 2     | 2                     |
| 3     | 3                     |
| x     | x                     |
Initial build time 12 hours

| level | upgrade time         |
| ----- | -------------------- |
| 1-?   | f(x) = 24 hours \* x |

| level | upgrade cost function (stone & wood) |
| ----- | ------------------------------------ |
| x     | f(x) = castle upgrade cost x+3       |
#### Production buildings

| level | upgrade time                   |
| ----- | ------------------------------ |
| 1-4   | f(x) = 600 seconden \* x       |
| 4-?   | f(x) = 3600 seconden \* 3(x-3) |
##### Woodcutters' Camp

| level | generation rate function |
| ----- | ------------------------ |
| 1-?   | f(x) = 200 \* x          |

| level | upgrade cost function (stone)   |
| ----- | ------------------------------- |
| 1-3   | 75% of hourly production        |
| 3-?   | hourly production \* 2 \* (x-3) |
##### Stone Quarry

| level | generation rate function |
| ----- | ------------------------ |
| 1-?   | f(x) = 200 \* x          |

| level | upgrade cost function (wood)    |
| ----- | ------------------------------- |
| 1-3   | 75% of hourly production        |
| 3-?   | hourly production \* 2 \* (x-3) |
##### Steel mine

| level | generation rate function |
| ----- | ------------------------ |
| 1-?   | f(x) = 20 + (25 \* x)    |

| level | upgrade cost function (wood & stone) |
| ----- | ------------------------------------ |
| 1-?   | hourly production \* (1.5 \* x)      |

##### Farm

| level | generation rate function |
| ----- | ------------------------ |
| 1-?   | f(x) = 300 \* x          |

| level | upgrade cost function (wood & stone)        |
| ----- | ------------------------------------------- |
| 1-3   | 60% hourly production (farm)                |
| 3-?   | hourly production \* 1.75 \* (x-3)   (farm) |

#### Military buildings

##### Barracks
Voor elk level van dit gebouw kan er 1 meer soldaat tegelijk worden getrained. (in parallel)

| level | upgrade cost function (wood & stone)    | upgrade time |
| ----- | --------------------------------------- | ------------ |
| 1-4   | f(x) = upgrade cost townhall level 2x-1 | 6 hour \* x  |

##### Defensive buildings
- Lookout tower -> skirmishers
- Archer tower -> Ranged
- Stables -> Cavalry
- Blacksmith -> spearmen
- Training Yard -> Heavy infantry
Damage bonus for units die overeenkomen met het type van dit gebouw is level \* 10%

| level | upgrade cost function (wood & stone) | upgrade time |
| ----- | ------------------------------------ | ------------ |
| 1-?   | f(x) = upgrade cost townhall level x | 6 hour \* x  |

