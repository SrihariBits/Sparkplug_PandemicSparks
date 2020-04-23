from Cell import Cell

class Grid:
    dims = None
    grid = []
    def __init__(self, dims):
        self.dims = dims
        for i in range(dims[0]):
            tmp = []
            for j in range(dims[1]):
                obj = Cell((i,j))
                tmp.append(obj)
            self.grid.append(tmp)
    
    def printGrid(self):
        print(self.grid)