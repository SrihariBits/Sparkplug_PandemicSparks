import {Catalog} from 'react-planner';

import Door from './items/deskoffice/planner-element';
import Cube from './items/cube/planner-element.jsx';
import PathVT from './items/pathVT/planner-element.jsx';
import PathHZ from './items/pathHZ/planner-element.jsx';
import PathNE from './items/pathNE/planner-element.jsx';
import PathNW from './items/pathNW/planner-element.jsx';
import PathSE from './items/pathSE/planner-element.jsx';
import PathSW from './items/pathSW/planner-element.jsx';


let catalog = new Catalog();
catalog.registerElement(Door);
catalog.registerElement(Cube);
catalog.registerElement(PathVT);
catalog.registerElement(PathHZ);
catalog.registerElement(PathNE);
catalog.registerElement(PathNW);
catalog.registerElement(PathSE);
catalog.registerElement(PathSW);

//catalog.registerCategory('windows', 'Windows', [Door] );
catalog.registerCategory('Paths', 'Paths', [PathVT,PathHZ,PathNE,PathNW,PathSE,PathSW] );

export default catalog;
