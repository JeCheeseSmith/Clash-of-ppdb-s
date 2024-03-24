# Buildings
> List of several statistics on the gameMechanics.
> > It defines how many resource are produced/time unit, storage limits, upgrade times, ... 

This table gives an overview for each building. Make sure to look into the respective documentation for extra explanation of each property.

| name            | type       | function    | timeFunction | upgradeFunction  | upgradeResourceID | upgradeResource(s) |
|-----------------|------------|-------------|--------------|------------------|-------------------|--------------------|
| WoodCuttersCamp | production | 200x        | 600x         | 400x             | 2                 | Wood               |
| Quarry          | production | 200x        | 600x         | 400x             | 1                 | Stone              |
| SteelMine       | production | 20 + 25x    | 600x         | 400x             | 12                | Stone & Wood       |
| Farm            | production | 300x        | 600x         | 400x             | 12                | Stone & Wood       |
| WoodStockPile   | storage    | 200x        | 600x         | (200*x)*2x-4*200 | 2                 | Stone              |
| StoneStockPile  | storage    | 2000*2^(x)  | 600x         | (2000*2^(x))/2   | 1                 | Wood               |
| Armory          | storage    | 10000*(2*x) | 600x         | (2000*2^(x))/2   | 12                | Stone & Wood       |
| GrainSilo       | storage    | 2000*2^(x)  | 600x         | (2000*2^(x))/2   | 12                | Stone & Wood       |
| Castle          | government | 0           | 10800*2(x-1) | 1000*4*2^(x)     | 12                | Stone & Wood       |
| SatelliteCastle | government | 0           | 10800*2(x-1) | 1000*4*2^(x)     | 12                | Stone & Wood       |
| Chancery        | government | 0           | 86400x       | 1000*4*2^(x+3)   | 12                | Stone & Wood       |
| Barracks        | government | 0           | 21600x       | 4000*2^(x)       | 12                | Stone & Wood       |
| Stables         | defense    | 1.1x        | 6*3600*x     | 1000*4*2^(x)     | 12                | Stone & Wood       |
| ArcherTower     | defense    | 1.1x        | 6*3600*x     | 1000*4*2^(x)     | 12                | Stone & Wood       |
| LookoutTower    | defense    | 1.1x        | 6*3600*x     | 1000*4*2^(x)     | 12                | Stone & Wood       |
| BlackSmith      | defense    | 1.1x        | 6*3600*x     | 1000*4*2^(x)     | 12                | Stone & Wood       |
| Tavern          | defense    | 1.1x        | 6*3600*x     | 1000*4*2^(x)     | 12                | Stone & Wood       |

>Initial build time for all buildings is 10 seconds unless otherwise stated.

### Production buildings

These building have the function to make resources over time.

### Storage buildings

These buildings expand a settlements storage amount for different types of resources.

### Governmental buildings

These buildings unlock certain areas of the game.

### Defensive buildings

These buildings let the player gain advantages as the defendant in an attack.

### Castle

The Castle is the main building and provides some basic features. It determines a settlements level and specifies how many buildings of a type can be placed. It also has a base storage capacity.

| level | storage capacity |
|-------|------------------| 
| 1     | 500              |
| 2     | 1000             | 
| 3     | 2000             | 
| 4     | 5000             | 
| 5     | 20000            | 
| 6     | 50000            |
| 7     | 100000           |

| level | WoodcuttersCamp | Quarry | SteelMine | Farm | Barracks | WoodStockpile | StoneStockPile | Armory | GrainSilo |
|-------|-----------------|--------|-----------|------|----------|---------------|----------------|--------|-----------|
| 1     | 1               | 1      | 1         | 1    | 1        | 1             | 1              | 1      | 1         | 
| 2     | 2               | 2      | 1         | 2    | 1        | 1             | 1              | 1      | 2         | 
| 3     | 2               | 2      | 2         | 3    | 2        | 2             | 2              | 2      | 3         | 
| 4     | 3               | 3      | 3         | 4    | 2        | 2             | 2              | 2      | 4         | 
| 5     | 4               | 4      | 3         | 5    | 3        | 3             | 3              | 3      | 5         | 
| 6     | 4               | 4      | 4         | 6    | 3        | 4             | 4              | 3      | 5         | 
| 7     | 5               | 5      | 4         | 7    | 4        | 4             | 4              | 3      | 6         | 

> Other buildings are limited by exactly 1 / settlement.

##### SatelliteCastle

The SatelliteCastle is only present in Settlement Outposts, and are the replacement of a main Castle. It has the same functionality, however a more limited amount of buildings and storage. It is not the main castle after all!

| level | storage capacity function | Woodcutters | Quarries | Mines | Farms | Barracks |
|-------|---------------------------|-------------|----------|-------|-------|----------|
| 1     | 500                       | 1           | 1        | 1     | 1     | 1        |
| 2     | 1000                      | 1           | 1        | 1     | 2     | 1        |
| 3     | 2000                      | 2           | 2        | 2     | 3     | 2        |
| 4     | 5000                      | 2           | 2        | 2     | 3     | 2        |
| 5     | 20000                     | 3           | 3        | 3     | 4     | 2        |

- Initial build time is time it takes to setup new city is 1 day
- Initial build time scales by the distance, since a transfer is needed to bring resource for the build.

##### Chancery

The chancery gives the oppertunity to create SatelliteCastles.

| level | Possible extra cities |
|-------|-----------------------|
| 1     | 1                     |
| 2     | 2                     |
| 3     | 3                     |
| x     | x                     |

##### Barracks
For each level of the building, 1 extra soldier can be trained in parallel.

##### Defensive buildings

Each building gives a 10% defend damage bonus to a specific type of soldiers.

- LookoutTower -> Skirmishers
- ArcherTower -> Ranged
- Stables -> Cavalry
- BlackSmith -> Spear Men
- TrainingYard/Tavern -> Heavy Infantry


