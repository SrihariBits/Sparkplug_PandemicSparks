import {Catalog} from 'react-planner';

import Door from './items/deskoffice/planner-element';
import Cube from './items/cube/planner-element.jsx';
import Path from './items/path/planner-element.jsx';


let catalog = new Catalog();
catalog.registerElement(Door);
catalog.registerElement(Cube);
catalog.registerElement(Path);

//catalog.registerCategory('windows', 'Windows', [Door] );
//catalog.registerCategory('cube', 'Cube', [Cube] );

export default catalog;
