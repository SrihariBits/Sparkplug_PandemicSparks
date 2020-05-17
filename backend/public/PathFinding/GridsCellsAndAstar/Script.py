from Cell import Cell
from sortedcontainers import SortedList

def getValid(node, dims):
    
    r = node[0]
    c = node[1]
    valids = []
    if r+1<dims[0]:
        valids.append((r+1,c))
    
    if c+1<dims[1]:
        valids.append((r,c+1))

    if r-1>=0:
        valids.append((r-1,c))

    if c-1>=0:
        valids.append((r,c-1))

    return valids

def heuristic(r, c, end):
    endr = end[0]
    endc = end[1]
    manhdist = abs(r-endr)+abs(c-endc)
    return manhdist

def getPath(start, end, parents):
    tmp = end
    path = []
    while tmp!=start:
        path.append(tmp)
        tmp = parents[tmp[0]][tmp[1]]
    
    path.append(start)
    return path

def astar(grid, start, end, dims):
    cost = []
    vis = []
    parents = []
    for i in range(dims[0]):
        tmp = []
        for j in range(dims[1]):
            tmp.append((i,j))
        parents.append(tmp)
        vis.append([0]*dims[1])
        cost.append([100000*100]*dims[1])

    cost[start[0]][start[1]] = 0
    costlist = SortedList()
    costlist.add((cost[start[0]][start[1]], start))
    while(True):
        node = costlist[0][1]
        cst = costlist[0][0]
        costlist.discard(costlist[0])
        if vis[node[0]][node[1]]==1:
            continue
        vis[node[0]][node[1]] = 1
        adj = getValid(node, dims)
        flag = 0
        for coord in adj:
            if vis[coord[0]][coord[1]]==1:
                continue
            g = cost[node[0]][node[1]] + grid[coord[0]][coord[1]].cost
            h = heuristic(coord[0], coord[1], end)
            if g<=cost[coord[0]][coord[1]]:
                parents[coord[0]][coord[1]] = node
                costlist.add((g+h,coord))
                cost[coord[0]][coord[1]] = g
            
            if coord==end:
                flag = 1
                break
            
        if flag==1:
            break
    
    # print(cost)
    # print("\n\n")
    return (cost[end[0]][end[1]],getPath(start, end, parents))



grid = []
dims = (5,5)

maxcost = 100000


for i in range(dims[0]):
    tmp = []
    for j in range(dims[1]):
        obj = Cell((i,j))
        tmp.append(obj)
    grid.append(tmp)

grid[2][2].updateCost(maxcost)
grid[2][2].addItems(["a", "b",  "c"])

grid[2][1].updateCost(maxcost)
grid[2][1].addItems(["a", "b",  "c"])

grid[2][3].updateCost(maxcost)
grid[2][3].addItems(["a", "b",  "c"])

def findshortestpath(grid, dims, start, end, nodes):
    
    tmp = start
    paths = []
    while nodes!=[]:
        short = SortedList()
        for node in nodes:
            # print(astar(grid, tmp, node, dims))
            short.add(astar(grid, tmp, node, dims))
        print(short)
        short[0][1].reverse()
        paths.append(short[0][1])
        print(nodes)
        print(short[0][1])
        tmp = short[0][1][len(short[0][1])-1]
        nodes.remove(tmp)
    
    retpath = astar(grid, paths[-1][-1], end, dims)
    retpath[1].reverse()
    paths.append(retpath[1])
    return paths

start = (1,3)
end = (4,3)
print(astar(grid, start, end, dims))
nodes = [(1,1), (4,2), (2,4), (4,4)]
print("multiple paths")
print(findshortestpath(grid, dims, (1,3), (1,3), nodes))




