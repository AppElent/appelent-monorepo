import Cytoscape from 'src/custom/libs/Cytoscape';

import { stylesheet, NODE_TYPE, NODE_COLOR_CLASS } from 'src/custom/libs/satisfactory/graph';

function truncateFloat(n, places = 4) {
  return n.toFixed(places).replace(/\.?0+$/, '');
}

function getNodeLabel(node, gameData) {
  let label = '';
  let amountText = '';
  if (node.type === NODE_TYPE.RECIPE) {
    const recipe = gameData.recipes[node.key];
    label = recipe.name;
    amountText = `${truncateFloat(node.multiplier)}x ${gameData.buildings[recipe.producedIn].name}`;
  } else {
    const item = gameData.items[node.key];
    if (node.type === NODE_TYPE.SIDE_PRODUCT) {
      label = `Side Product:\n${item.name}`;
    } else {
      label = item.name;
    }
    amountText = `${truncateFloat(node.multiplier)} / min`;
  }
  return `${label}\n${amountText}`;
}

function getNodeClasses(node, gameData) {
  const classes = [];
  if (node.type === NODE_TYPE.RECIPE) {
    classes.push('recipe-shape');
    const recipe = gameData.recipes[node.key];
    if (recipe.producedIn === 'Desc_GeneratorNuclear_C') {
      classes.push('nuclear');
    } else {
      classes.push(NODE_COLOR_CLASS[node.type]);
    }
  } else {
    classes.push('item-shape');
    classes.push(NODE_COLOR_CLASS[node.type]);
  }
  return classes;
}

function getEdgeLabel(edge, gameData) {
  const item = gameData.items[edge.key];
  const label = item.name;
  const amountText = `${truncateFloat(edge.productionRate)} / min`;
  return `${label}\n${amountText}`;
}

const layout = {
  name: 'random',
  padding: 40,
  transform: (node, pos) => {
    return pos;
  },
  klay: {
    direction: 'RIGHT',
    edgeRouting: 'ORTHOGONAL',
    nodePlacement: 'LINEAR_SEGMENTS',
    edgeSpacingFactor: 0.2,
    inLayerSpacingFactor: 0.7,
    spacing: 40,
    thoroughness: 10,
  },
};

const Graph = ({ data, setData }) => {
  return (
    <Cytoscape
      elements={data.elements}
      //style={{ width: '100%', height: '100%' }}
      //style={{ width: '100vw', height: '100vh' }}
      layout={layout}
      stylesheet={stylesheet}
    />
  );
};

export default Graph;
