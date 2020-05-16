import React from 'react';
import { BoxGeometry, MeshBasicMaterial, Mesh, BoxHelper } from 'three';
import { ReactPlannerSharedStyle } from 'react-planner';

export default {
  name: 'pathNW',
  prototype: 'items',

  info: {
    title: 'pathNW',
    tag: ['demo'],
    description: 'Demo item',
    image: require('./path.png')
  },

  properties: {
    color: {
      label: 'Color',
      type: 'color',
      defaultValue: '#9c27b0'
    },
    width: {
      label: 'Width',
      type: 'length-measure',
      defaultValue: {
        length: 100,
        unit: 'cm'
      }
    },
    height: {
      label: 'Height',
      type: 'length-measure',
      defaultValue: {
        length: 100,
        unit: 'cm'
      }
    },
    depth: {
      label: 'Depth',
      type: 'length-measure',
      defaultValue: {
        length: 100,
        unit: 'cm'
      }
    },
  },

  render2D: (element, layer, scene) => {
    let style = {
      stroke: !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED,
      strokeWidth: 0,
      fill: element.properties.get('color')
    };

    let w = element.properties.getIn(['width', 'length']);
    let d = element.properties.getIn(['depth', 'length']);
    let w1 = w/6;
    let d1 = 50;
    let w2 = w/6;
    let d2 = d/6;
    let w3 = 50;
    let d3 = d/6;
    
    return (
      <g>
      <g transform={`translate( -${w1}, -${d1})`}>
        <rect x="0" y="0" width={w/3} height={d/3} style={style} />
      </g>
      <g transform={`translate( -${w2}, -${d2})`}>
        <rect x="0" y="0" width={w/3} height={d/3} style={style} />
      </g>
      <g transform={`translate( -${w3}, -${d3})`}>
        <rect x="0" y="0" width={w/3} height={d/3} style={style} />
      </g>
      </g>
    );
  },

  render3D: (element, layer, scene) => {
    let w = element.properties.getIn(['width', 'length']);
    let h = element.properties.getIn(['height', 'length']);
    let d = element.properties.getIn(['depth', 'length']);
    let geometry = new BoxGeometry(w/3, 0, d/3);
    let material = new MeshBasicMaterial({
      color: element.properties.get('color')
    });

    let mesh = new Mesh(geometry, material);

    let box = new BoxHelper(mesh, !element.selected ? ReactPlannerSharedStyle.LINE_MESH_COLOR.unselected : ReactPlannerSharedStyle.MESH_SELECTED );
    box.material.linewidth = 2;
    box.renderOrder = 1000;
    mesh.add(box);

    mesh.position.y = (h / 2);

    return Promise.resolve(mesh);
  }
};
