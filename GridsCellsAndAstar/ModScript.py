from ModCell import Cell
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
    
    if r+1<dims[1] and c+1<dims[1]:
        valids.append((r+1, c+1))
    
    if r-1>=0 and c+1<dims[1]:
        valids.append((r-1, c+1))
    
    if r+1<dims[1] and c-1>=0:
        valids.append((r+1, c-1))
    
    if r-1>=0 and c+1>=0:
        valids.append((r-1, c-1))
    

    return valids

def heuristic(r, c, end):
    endr = end[0]
    endc = end[1]
    manhdist = abs(r-endr)+abs(c-endc)
    return manhdist

def getPath(time, start, end, parents, grid):
    tmp = end
    path = []
    while tmp!=start:
        path.append(tmp)
        tmp = parents[tmp[0]][tmp[1]]
    
    path.append(start)
    cnttime = time
    for node in path[::-1]:
        if cnttime in grid[node[0]][node[1]].cost.keys():
            grid[node[0]][node[1]].cost[cnttime] += 5
        else:
            grid[node[0]][node[1]].cost[cnttime] = grid[node[0]][node[1]].cost[0] + 5
        cnttime += 1
    return path

def astar(grid, time, start, end, dims):
    cost = []
    vis = []
    parents = []
    times = []
    for i in range(dims[0]):
        tmp = []
        for j in range(dims[1]):
            tmp.append((i,j))
        parents.append(tmp)
        vis.append([0]*dims[1])
        cost.append([100000*100]*dims[1])
        times.append([time]*dims[1])

    if time in grid[start[0]][start[1]].cost.keys():
        cost[start[0]][start[1]] = grid[start[0]][start[1]].cost[time]
    else:
        cost[start[0]][start[1]] = grid[start[0]][start[1]].cost[0]
    # print("Start cost: ",cost[start[0]][start[1]])
    costlist = SortedList()
    costlist.add((cost[start[0]][start[1]], start))
    times[start[0]][start[1]] = time
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

            newtime = times[node[0]][node[1]] + 1
            if newtime in grid[coord[0]][coord[1]].cost.keys():
                g = cost[node[0]][node[1]] + grid[coord[0]][coord[1]].cost[newtime]
            else:
                g = cost[node[0]][node[1]] + grid[coord[0]][coord[1]].cost[0]

            # if cost[node[0]][node[1]]+1 in grid[coord[0]][coord[1]].cost.keys():
            #     g = cost[node[0]][node[1]] + grid[coord[0]][coord[1]].cost[cost[node[0]][node[1]]+1]
            # else:
            #     g = cost[node[0]][node[1]] + grid[coord[0]][coord[1]].cost[0]

            # g = cost[node[0]][node[1]] + grid[coord[0]][coord[1]].cost
            h = heuristic(coord[0], coord[1], end)
            # print(g+h)
            if g<=cost[coord[0]][coord[1]]:
                parents[coord[0]][coord[1]] = node
                costlist.add((g+h,coord))
                cost[coord[0]][coord[1]] = g
                times[coord[0]][coord[1]] = newtime
            
            if coord==end:
                flag = 1
                break
            
        if flag==1:
            break
    # print(cost)
    # print("\n\n")
    path = getPath(time, start, end, parents, grid)
    return (cost[end[0]][end[1]],path)



grid = []
dims = (5,5)

maxcost = 100000


for i in range(dims[0]):
    tmp = []
    for j in range(dims[1]):
        obj = Cell((i,j))
        tmp.append(obj)
    grid.append(tmp)

grid[2][2].cost[0]=maxcost
grid[2][2].addItems(["a", "b",  "c"])

grid[2][1].updateCost(maxcost)
grid[2][1].addItems(["a", "b",  "c"])

grid[2][3].updateCost(maxcost)
grid[2][3].addItems(["a", "b",  "c"])

def findshortestpath(grid, dims, time, start, end, nodes):
    tmp = start
    paths = []
    while nodes!=[]:
        short = SortedList()
        for node in nodes:
            # print(astar(grid, tmp, node, dims))
            short.add(astar(grid, time, tmp, node, dims))
        # print(short)
        short[0][1].reverse()
        print("cost:: ", short[0][0])
        print()
        paths.append(short[0][1])
        time += len(paths[-1]) - 1
        # print(nodes)
        # print(short[0][1])
        tmp = short[0][1][-1]
        print(tmp)
        nodes.remove(tmp)
    
    # print("paths: ",paths)
    retpath = astar(grid, time, paths[-1][-1], end, dims)
    retpath[1].reverse()
    paths.append(retpath[1])
    return paths

start = (1,3)
end = (4,3)
# for m in range(dims[0]):
#     print(m)
#     for n in range(dims[1]):
#         print(n," : ",grid[m][n].cost)
# print(astar(grid, 0, start, end, dims))
# for m in range(dims[0]):
#     print(m)
#     for n in range(dims[1]):
#         print(n," : ",grid[m][n].cost)
nodes = [(1,1), (4,2), (2,4), (4,4)]
path1 = findshortestpath(grid, dims, 0, (1,3), (4,3), nodes)
print(path1)
print("**********")
nodes = [(1,1), (4,2), (2,4), (4,4)]
print(findshortestpath(grid, dims, 0, (1,3), (4,3), nodes))




