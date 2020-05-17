from ModCell import Cell
from sortedcontainers import SortedList
import pickle
import os
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
    
    # if r+1<dims[1] and c+1<dims[1]:
    #     valids.append((r+1, c+1))
    
    # if r-1>=0 and c+1<dims[1]:
    #     valids.append((r-1, c+1))
    
    # if r+1<dims[1] and c-1>=0:
    #     valids.append((r+1, c-1))
    
    # if r-1>=0 and c+1>=0:
    #     valids.append((r-1, c-1))
    

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
    # cnttime = time
    # penalty = 3
    # for node in path[::-1]:
    #     if cnttime in grid[node[0]][node[1]].cost.keys():
    #         grid[node[0]][node[1]].cost[cnttime] += penalty
    #     else:
    #         grid[node[0]][node[1]].cost[cnttime] = grid[node[0]][node[1]].cost[0] + penalty
    #     cnttime += 1
    return path

def updatePath(grid, time, path):
    cnttime = time
    penalty = 3
    for node in path[::-1]:
        if cnttime in grid[node[0]][node[1]].cost.keys():
            grid[node[0]][node[1]].cost[cnttime] += penalty
        else:
            grid[node[0]][node[1]].cost[cnttime] = grid[node[0]][node[1]].cost[0] + penalty
        cnttime += 1

def astar(grid, time, start, end, dims):
    cost = []
    vis = []
    parents = []
    times = []
    print(start,":::::::::::",end)
    for i in range(dims[0]):
        tmp = []
        for j in range(dims[1]):
            tmp.append((i,j))
        parents.append(tmp)
        vis.append([0]*dims[1])
        cost.append([100000*100]*dims[1])
        times.append([time]*dims[1])

    # print("cost:")
    # print(cost)

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
            if g+h<=cost[coord[0]][coord[1]]:
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



# grid = []
# dims = (5,5)

# maxcost = 100000


# for i in range(dims[0]):
#     tmp = []
#     for j in range(dims[1]):
#         obj = Cell((i,j))
#         tmp.append(obj)
#     grid.append(tmp)

# grid[2][2].cost[0]=maxcost
# grid[2][2].addItems(["a", "b",  "c"])

# grid[2][1].updateCost(maxcost)
# grid[2][1].addItems(["a", "b",  "c"])

# grid[2][3].updateCost(maxcost)
# grid[2][3].addItems(["a", "b",  "c"])

def mapcoord(coord):
    newcoord = (int((coord[0]-50)/100),int((coord[1]-50)/100))
    return newcoord


def rev_mapcoord(coord):
    newcoord = ((coord[0]*100)+50,(coord[1]*100)+50)
    return newcoord


def findshortestpath(time, start, end, nodes):
    
    unpklfile = open("grid","rb")
    grid = pickle.load(unpklfile)
    dims = (len(grid), len(grid[0]))
    unpklfile.close()
    # for i in range(1,2):
    #     for j in range(len(grid[0])):
    #         print(grid[i][j].cost, end=" ")
    #     print("\n")
    paths = []
    
    start = mapcoord(start)
    end = mapcoord(end)
    for i in range(len(nodes)):
        nodes[i]=mapcoord(nodes[i])
    tmp = start

    while nodes!=[]:
        short = SortedList()
        for ele in short:
            print(ele)
        for node in nodes:
            # print(astar(grid, tmp, node, dims))
            short.add(astar(grid, time, tmp, node, dims))
        # print(short)
        for ele in short:
            print(ele)
        updatePath(grid, time, short[0][1])
        short[0][1].reverse()
        # print("cost:: ", short[0][0])
        # print()
        paths.append(short[0][1])
        time += len(paths[-1]) - 1
        # print(nodes)
        # print(short[0][1])
        tmp = short[0][1][-1]
        print(tmp)
        nodes.remove(tmp)
        tmp = short[0][1][-2]
        paths[-1].pop(-1)
    
    # print("paths: ",paths)
    retpath = astar(grid, time, tmp, end, dims)
    retpath[1].reverse()
    paths.append(retpath[1])
    # for i in range(1,2):
    #     for j in range(len(grid[0])):
    #         print(grid[i][j].cost, end=" ")
    #     print("\n")

    os.remove("grid")
    pklfile = open("grid","ab")
    pickle.dump(grid,pklfile)
    pklfile.close()

    return paths

start = (50,50)
end = (450,350)
#add the commented lines to debug
# nodes = [(150,150), (450,250), (250,450), (450,450)]
nodes = [(150,150),(450,1550)]
path1 = findshortestpath(0, start, end, nodes)
print(path1)
# print("**********")
# nodes = [(1,1), (4,2), (2,4), (4,4)]
# print(findshortestpath(0, (1,3), (4,3), nodes))


# for m in range(dims[0]):
#     print(m)
#     for n in range(dims[1]):
#         print(n," : ",grid[m][n].cost)
# print(astar(grid, 0, start, end, dims))
# for m in range(dims[0]):
#     print(m)
#     for n in range(dims[1]):
#         print(n," : ",grid[m][n].cost)

