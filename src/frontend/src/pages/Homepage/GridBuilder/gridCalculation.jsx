/**
 * Calculates the validity of a building's position within the grid and checks for collisions with other buildings.
 * @param {Array} buildings - Array of existing buildings on the grid.
 * @param {Array} selectedBuilding - Selected building to be placed.
 * @param {Array} newPosition - New position coordinates for the selected building.
 * @returns {Array} - An array containing a boolean indicating the validity of the position and an array of cells occupied by the building if the position is valid.
 */
function GridCalculation(buildings, selectedBuilding, newPosition)
{
    let newCells = CalculateCells(selectedBuilding, newPosition)
    let validCells = ValidPositionChecker(selectedBuilding, newCells, buildings)
    if (!InsideGrid(selectedBuilding, newPosition)) {validCells=false}
    return [validCells,newCells]
}

/**
 * Calculates the cells occupied by the selected building based on its position and size.
 * @param {Array} selectedBuilding - Selected building to be placed.
 * @param {Array} newPosition - New position coordinates for the selected building.
 * @returns {Array} - An array of cells occupied by the building.
 */
function CalculateCells(selectedBuilding, newPosition)
{
    let cells = [];
    for (let i = 0; i <= selectedBuilding[0].size[0]; i++)
    {
        for (let j = 0; j <= selectedBuilding[0].size[1]; j++)
        {
            cells.push([newPosition[0]+i,newPosition[1]+j])
        }
    }
    return cells
}

/**
 * Checks if the position of the selected building is valid and does not collide with other buildings.
 * @param {Array} selectedBuilding - Selected building to be placed.
 * @param {Array} newCells - Cells occupied by the selected building.
 * @param {Array} buildings - Array of existing buildings on the grid.
 * @returns {boolean} - Indicates whether the position is valid and collision-free.
 */

function ValidPositionChecker(selectedBuilding, newCells, buildings)
{
    const hasDuplicates = (array) =>
    {
        const seen = new Set();
        for (const sublist of array)
        {
            const stringified = JSON.stringify(sublist); // Convert array to string for comparison
            if (seen.has(stringified))
            {
                return true;
            }
            seen.add(stringified);
        }
        return false;
    }

    for (const placedBuilding of buildings)
    {
        if (selectedBuilding[0].position !== placedBuilding.position)
        {
            let totalcells = [...placedBuilding.occupiedCells, ...newCells]
            if (hasDuplicates(totalcells))
            {
                return false
            }
        }
    }
    return true
}

/**
 * Checks if the position of the selected building is valid within the grid.
 * @param {Array} selectedBuilding - Selected building to be placed.
 * @param {Array} newPosition - New position coordinates for the selected building.
 * @returns {boolean} - Indicates whether the building's position is within the grid boundaries.
 */
function InsideGrid(selectedBuilding, newPosition)
{
    return newPosition[0] <= 40 - selectedBuilding[0].size[0] && newPosition[1] <= 40 - selectedBuilding[0].size[1] && newPosition[0] >= 0 && newPosition[1] >= 0
}

export default GridCalculation;