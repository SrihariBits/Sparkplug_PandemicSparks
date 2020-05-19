from ModCell import Cell
from sortedcontainers import SortedList
import pickle
import os
import sys
import csv
import sys
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

def getPath(time, start, end, parents, grid):
    tmp = end
    path = []
    while tmp!=start:
    # for i in range(0,20):
        # print(tmp)
        path.append(tmp)
        tmp = parents[tmp[0]][tmp[1]]
        # print(tmp)
    
    path.append(start)
    return path

def updatePath(grid, time, path):
    cnttime = time
    penalty = 3
    # for node in path[::-1]:
    print("!!!!!!!!!!!")
    for node in path:
        #print(node, end=' ')
        if cnttime in grid[node[0]][node[1]].cost.keys():
            grid[node[0]][node[1]].cost[cnttime] = grid[node[0]][node[1]].cost[cnttime] + penalty
        else:
            grid[node[0]][node[1]].cost[cnttime] = grid[node[0]][node[1]].cost[0] + penalty
        # print(grid[node[0]][node[1]].cost)
        print(grid[node[0]][node[1]].cost[cnttime])
        cnttime += 1
    
    print("!!!!!!!!!!!")
    return grid
    

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

    if time in grid[start[0]][start[1]].cost.keys():
        cost[start[0]][start[1]] = int(grid[start[0]][start[1]].cost[time])
    else:
        cost[start[0]][start[1]] = int(grid[start[0]][start[1]].cost[0])

    # print("!!!!!!!!!!!!!!!!!")
    # print(start)
    # print(grid[start[0]][start[1]].cost)
    # print("!!!!!!!!!!!!!!!!!")
    # print("\n")
    
    costlist = SortedList()
    costlist.add((cost[start[0]][start[1]], start))
    times[start[0]][start[1]] = time-1
    tmpnode = start
    flag = 0
    while(True):
        node = costlist[0][1]
        # print("node: ",node)
        # for item in costlist:
        #     print(item, end=' ')
        # print("\n")
        # print("!!!!!!!!!!!!!!!!!")
        # print(node)
        # print(grid[node[0]][node[1]].cost)
        # print("!!!!!!!!!!!!!!!!!")
        # print("\n")
        costlist.discard(costlist[0])
        if vis[node[0]][node[1]]==1:
            continue
        vis[node[0]][node[1]] = 1
        adj = getValid(node, dims)
        # print("adj: ",adj)
        flag = 0
        # parents[node[0]][node[1]] = tmpnode
        times[node[0]][node[1]] = times[tmpnode[0]][tmpnode[1]]+1
        tmpnode = node
        for coord in adj:
            if vis[coord[0]][coord[1]]==1:
                continue

            # print(coord)
            newtime = times[node[0]][node[1]] + 1
            if newtime in grid[coord[0]][coord[1]].cost.keys():
                # print(newtime, "::", coord)
                # print("lala: ",grid[coord[0]][coord[1]].cost)
                g = (cost[node[0]][node[1]]) + (grid[coord[0]][coord[1]].cost[newtime])
            else:
                g = (cost[node[0]][node[1]]) + (grid[coord[0]][coord[1]].cost[0])
            
            h = heuristic(coord[0], coord[1], end)
            cost[coord[0]][coord[1]] = min(g,cost[coord[0]][coord[1]])
            g = cost[coord[0]][coord[1]]
            # cost[coord[0]][coord[1]] = g
            # print(g, ", ", h)
            costlist.add((g+h,coord))
            
            parents[coord[0]][coord[1]] = node

            if coord==end:
                parents[end[0]][end[1]] = node
                flag = 1
                break
            
        if flag==1:
            break
    path = getPath(time, start, end, parents, grid)
    return (cost[end[0]][end[1]],path)




def mapcoord(coord):
    newcoord = (int((coord[0]-50)/100),int((coord[1]-50)/100))
    return newcoord


def rev_mapcoord(coord):
    # newcoord = ((coord[0]*100)+50,(coord[1]*100)+50)
    newcoord = (coord*100)+50
    return newcoord

def directions(paths):
    dir ='n'
    dirarr = []
    dirarr.append(['x','y','path'])
    for i in range(len(paths)):
        for j in range(1, len(paths[i])):
            diffx = paths[i][j][0]-paths[i][j-1][0]
            diffy = paths[i][j][1]-paths[i][j-1][1]
            
            if dir=='n':
                if diffx != 0:
                    if diffx > 0:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'right'])
                        dir = 'e'
                    else:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'left'])
                        dir = 'w'
                else:
                    if diffy > 0:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'straight'])
                        dir = 'n'
                    else:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'reverse'])
                        dir = 's'
            elif dir == 's':
                if diffx != 0:
                    if diffx > 0:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'left'])
                        dir = 'e'
                    else:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'right'])
                        dir = 'w'
                else:
                    if diffy > 0:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'reverse'])
                        dir = 'n'
                    else:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'straight'])
                        dir = 's'
            elif dir == 'e':
                if diffx != 0:
                    if diffx > 0:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'straight'])
                        dir = 'e'
                    else:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'reverse'])
                        dir = 'w'
                else:
                    if diffy > 0:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'left'])
                        dir = 'n'
                    else:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'right'])
                        dir = 's'
            elif dir == 'w':
                if diffx != 0:
                    if diffx > 0:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'reverse'])
                        dir = 'e'
                    else:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'straight'])
                        dir = 'w'
                else:
                    if diffy > 0:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'right'])
                        dir = 'n'
                    else:
                        dirarr.append([rev_mapcoord(paths[i][j-1][0]), rev_mapcoord(paths[i][j-1][1]), 'left'])
                        dir = 's'

    return dirarr           


def findshortestpath(time, start, end, nodeslist):
    
    unpklfile = open("grid","rb")
    grid = pickle.load(unpklfile)
    dims = (len(grid), len(grid[0]))
    unpklfile.close()
    # for i in range(29,30):
    #     for j in range(len(grid[0])):
    #         print(grid[i][j].cost, end=" ")
    #     print("\n")
    paths = []
    
    nodesdict = {}
    nodes = []
    #print(nodeslist)
    for node in nodeslist:
        print(node)
        nodes.append((node[0],node[1]))
        tup = (node[0],node[1])
        tmptup = (node[2],node[3])
        if tup in nodesdict.keys():
            nodesdict[tup].append(tmptup)
        else:
            nodesdict[tup] = []
            nodesdict[tup].append(tmptup)


    start = mapcoord(start)
    end = mapcoord(end)
    for i in range(len(nodes)):
        nodes[i]=mapcoord(nodes[i])
    tmp = start

    starttime=time

    shortestnodes = []

    while nodes!=[]:
        short = SortedList()
        # for ele in short:
        #     print(ele)
        for node in nodes:
            # print("\n")
            # print(astar(grid, tmp, node, dims))
            short.add(astar(grid, time, tmp, node, dims))
        
        # print(short)
        for ele in short:
            print(ele)




        # updatePath(grid, time, short[0][1])
        # for node in short[0][1]:
        #     print(node)
        #     print("node: ",grid[node[0]][node[1]].cost)
        #     print("\n")

        short[0][1].reverse()
        paths.append(short[0][1])
        time += len(paths[-1]) - 1
        tmp = short[0][1][-1]
        nodes.remove(tmp)
        tmp = short[0][1][-2]
        paths[-1].pop(-1)
    
    for path in paths:
        grid = updatePath(grid, starttime, path)
        starttime+=len(path)
    
    # print("paths: ",paths)
    retpath = astar(grid, time, tmp, end, dims)
    retpath[1].reverse()
    paths.append(retpath[1])
    # for i in range(29,30):
    #     for j in range(len(grid[0])):
    #         print(grid[i][j].cost, end=" ")
    #     print("\n")

    os.remove("grid")
    pklfile = open("grid","ab")
    pickle.dump(grid,pklfile)
    pklfile.close()
    dirarr = directions(paths)

    with open('../path.csv', 'w') as file:
        writer = csv.writer(file)
        writer.writerows(dirarr)

    return paths

if __name__ == '__main__':
    time = int(sys.argv[1])
    start = sys.argv[2][1:len(sys.argv[2])-1]
    start = start.split(',')
    for i in range(len(start)):
        start[i] = int(start[i])
    
    end = sys.argv[3][1:len(sys.argv[3])-1]
    end = end.split(',')
    for i in range(len(end)):
        end[i] = int(end[i])

    # print(start)
    # print(end)

    nodeslist = []

    with open('nodeslist.csv') as readfile:
        csvreader = csv.reader(readfile, delimiter=',')
        for row in csvreader:
            # print(row)
            tmp = []
            tmp.append(int(row[0]))
            tmp.append(int(row[1]))
            tmp.append(row[2])
            tmp.append(row[3])
            nodeslist.append(tmp)
    
    print(nodeslist)
    print(findshortestpath(time,start,end,nodeslist))
    

#uncomment the following to test run
# start = [50,50]
# end = [2950,1950]
# nodes = [[450,1550,'abc','khkjdh'],[250,1850,'def','jhkj'],[350,950,'ghi','wuey'], [350,950,'jkl','9487'], [350,950,'mno','849ie']]
# path1 = findshortestpath(5, start, end, nodes)
# print("\n\n\n\n")
# print(path1)


#reference: def findshortestpath(time, start, end, nodeslist)
