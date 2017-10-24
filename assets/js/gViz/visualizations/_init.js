module.exports = {
  bar: {
    vertical: require('./bar/vertical/_init.js'),
    horizontal: require('./bar/horizontal/_init.js')
  },
  barChartVertNeg: require('./bar-chart-vert-neg/_init.js'),
  comboChart: require('./combo-chart/_init.js'),
  dendrogram: require('./dendrogram/_init.js'),
  donut: require('./donut/_init.js'),
  donutWithToggle: require('./donut-with-toggle/_init.js'),
  groupedVertBarChart: require('./grouped-vert-bar-chart/_init.js'),
  groupedHoriBarChart: require('./grouped-hori-bar-chart/_init.js'),
  hierarchicalBars: {
    horizontal: require('./hierarchical-bars/horizontal/_init.js')
  },
  lineGraph: require('./line-graph/_init.js'),
  linearLine: require('./linear-line/_init.js'),
  mapHeatBars: require('./map-heat-bars/_init.js'),
  mapLeafletHeat: require('./map-leaflet-heat/_init.js'),
  mapLeafletHeatMultivariable: require('./map-leaflet-heat-multivariable/_init.js'),
  ontologyViewer: require('./ontology-viewer/_init.js'),
  plotEvolutionGraph: require('./plot-evolution-graph/_init.js'),
  plotGraph: require('./plot-graph/_init.js'),
  poetNetworkChart: require('./poet-network-chart/_init.js'),
  pyramidHoriGraph: require('./pyramid-hori-graph/_init.js'),
  stackedVertBarChart: require('./stacked-vert-bar-chart/_init.js'),

  bubbleComponents: {
    common: require('./bubbles/common.js'),
    pricePointAnalysis: require('./bubbles/pricePointAnalysis/_init.js'),
    pricePointAnalysisHover: require('./bubbles/pricePointAnalysisHover/_init.js'),
    attributeAnalysisHover: require('./bubbles/attributeAnalysisHover/_init.js'),
    salesStockAnalysis: require('./bubbles/salesStockAnalysis/_init.js'),
    mainProductBubble: require('./bubbles/mainProductBubble/_init.js'),
    attributeAnalysis: require('./bubbles/attributeAnalysis/_init.js'),
    customerAnalysis: require('./bubbles/customerAnalysis/_init.js'),
    combined: require('./bubbles/combined/_init.js'),
  },
  sunburstComponents: {
    tree: require('./sunburst.tree/_init.js'),
    line: require('./sunburst/sunburst.line/_init.js'),
    sunburst: require('./sunburst/_init.js'),
  },
  lightbulbLines: require('./lightbulb-lines/_init.js'),
  storesMap: require('./storeMap/_init.js'),
  productsDonut: require('./productsDonut/_init.js'),
  priceRanges: require('./priceRanges/_init.js'),
  doubleEntryTable: require('./double-entry-table/_init.js'),
  visualWeeklyProductsPredictionLine: require('./weeklyProductsPredictionLine/_init.js'),
  barPositiveNegativeDeviation: require('./bar-positive-negative-deviation/_init.js'),

  // Victoria's  Secret Visualizations
  vsBarVertWithBrush: require('./vs-bar-vert-with-brush/_init.js'),
  vsLineGraphWithDraggablePoints: require('./vs-line-graph-with-draggable-points/_init.js')
};
