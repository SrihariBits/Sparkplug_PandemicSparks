import json

with open('gridLocation.txt', 'r') as inputfile:
    jsondata = inputfile.read()

tmp = json.loads(jsondata)    
for i in range(len(tmp)):
    coord = tmp[i]
    x = int(coord['x'])
    coord['x'] = int(x/100)*100+50
    y = int(coord['y'])
    coord['y'] = int(y/100)*100+50
    tmp[i] = coord

with open('gridLocation.txt', 'w') as inputfile:
    json.dump(tmp, inputfile)