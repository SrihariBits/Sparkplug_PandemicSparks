class Cell:
    # coords = None
    # isShelf = None
    # cost = {}
    # items = []
    def __init__(self, coords, cst=1, items = []):
        self.coords = coords
        self.cost = {}
        self.cost[0] = cst
        self.items = items
    
    def updateCost(self, cost):
        self.cost[0] = cost
        # print("inside updation: ",self.cost[0])
    
    def addItems(self, newitems):
        for i in newitems:
            self.items.append(i)
    
    def removeItems(self, removeitems):
        for i in removeitems:
            self.items.remove(i)
    
    def findItem(self, finditem):
        if finditem in self.items:
            return True
        else:
            return False
    

    