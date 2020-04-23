class Cell:
    coords = None
    isShelf = None
    cost = None
    items = []
    def __init__(self, coords, cost=1, items = []):
        self.coords = coords
        self.cost = cost
        self.items = items
    
    def updateCost(self, cost):
        self.cost = cost
    
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
    

    