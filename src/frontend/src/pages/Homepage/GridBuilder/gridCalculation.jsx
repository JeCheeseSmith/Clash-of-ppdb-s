import {range} from "three/examples/jsm/nodes/geometry/RangeNode.js";
import {useState} from "react";
import {element} from "three/examples/jsm/nodes/shadernode/ShaderNode.js";

function GridCalculation(buildings, selectedBuilding, newPosition)
{
    let newCells = CalculateCells(selectedBuilding, newPosition)
    let validCells = ValidPositionChecker(selectedBuilding, newCells, buildings)
    if (!InsideGrid(selectedBuilding, newPosition)) {validCells=false}
    return [validCells,newCells]
}

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

function InsideGrid(selectedBuilding, newPosition)
{
    return newPosition[0] <= 40 - selectedBuilding[0].size[0] && newPosition[1] <= 40 - selectedBuilding[0].size[1] && newPosition[0] >= 0 && newPosition[1] >= 0
}

export default GridCalculation;