import json
import pickle
from ModCell import Cell

def mapcoord(coord):
    newcoord = (int((coord['x']-50)/100),int((coord['y']-50)/100))
    return newcoord


with open('../gridLocation.txt','r') as gridfile:
    shelves = gridfile.read()

shelf_coords = json.loads(shelves)

dims = (30,20)

grid = []

maxcost = 100000

for i in range(dims[0]):
    tmp = []
    for j in range(dims[1]):
        obj = Cell((i,j))
        tmp.append(obj)
    grid.append(tmp)

for coord in shelf_coords:
    coord = mapcoord(coord)
    # print(coord)
    grid[coord[0]][coord[1]].updateCost(maxcost)

for i in range(len(grid)):
    for j in range(len(grid[0])):
        print(grid[i][j].cost, end=" ")
    print("\n")

pklfile = open("grid","ab")
pickle.dump(grid,pklfile)
pklfile.close()