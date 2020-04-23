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
    print(dims)
    for i in range(dims[0]):
        tmp = []
        for j in range(dims[1]):
            tmp.append((i,j))
        parents.append(tmp)
        vis.append([0]*dims[1])
        cost.append([100000*100]*dims[1])
    # print(cost)
    # print(vis)
    # print(parents)

    cost[start[0]][start[1]] = 0
    # parents[start[0]][start[1]] = (0,0)
    costlist = SortedList()
    costlist.add((cost[start[0]][start[1]], start))
    while(True):
        print()
        print()
        # print("inside while")
        # print(costlist)
        node = costlist[0][1]
        cst = costlist[0][0]
        # print("*****************")
        print(node)
        # print(cst)
        # print(costlist[0])
        # print("*****************")
        costlist.discard(costlist[0])
        if vis[node[0]][node[1]]==1:
            continue
        vis[node[0]][node[1]] = 1
        print(vis)
        adj = getValid(node, dims)
        flag = 0
        for coord in adj:
            # print(coord)
            # print(vis[coord[0]][coord[1]])
            if vis[coord[0]][coord[1]]==1:
                # print("TREU")
                continue
            f = cst + grid[coord[0]][coord[1]].cost
            h = heuristic(coord[0], coord[1], end)
            if f<=cost[coord[0]][coord[1]]:
                print("before assigning: ", node)
                print(coord)
                parents[coord[0]][coord[1]] = node
                costlist.add((f+h,coord))
                cost[coord[0]][coord[1]] = f
                print(parents)
            
            if coord==end:
                flag = 1
                break
            
        if flag==1:
            break
    
    print("path")
    # print(parents)
    print(getPath(start, end, parents))
    print("\n\n")


    return cost



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

# for(int k = 1; k <= n; k++){
#     for(int i = 1; i <= n; i++){
#         for(int j = 1; j <= n; j++){
#             dist[i][j] = min( dist[i][j], dist[i][k] + dist[k][j] );
#         }
#     }
# }






start = (1,3)
end = (3,3)
print(astar(grid, start, end,dims))




