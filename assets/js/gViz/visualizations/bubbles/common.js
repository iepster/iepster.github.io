
var d3 = require('d3');

module.exports = {
  STATES: {
    INITIAL: 'INITIAL',
    HIDDEN: 'HIDDEN',
    ACTIVE: 'ACTIVE',
    SHADOWED: 'SHADOWED'
  },
  LAYOUT_TYPES: {
    INITIAL: "INITIAL",
    // FULL: "FULL",
    ONLY_CUSTOMER_MAP: "CUSTOMER_ANALYSIS_ACTIVE",
    CUSTOMER_AND_ATTR_ANALYSIS_ACTIVE: "CUSTOMER_AND_ATTR_ANALYSIS_ACTIVE",
    // CUSTOMER_AND_ATTR_ANALYSIS_INITIAL: "CUSTOMER_AND_ATTR_ANALYSIS_INITIAL",
  },
  getUpdateHandlerFuncs: function () {
    return {
      data: null,
      scale: null,
      state: null,
      hoverStart: null,
      hoverEnd: null
    }
  },
  drawWhiteCircles: function (whiteCirclesWrapper, attrs) {
    frequency = attrs.frequency || 250;

    var whiteCircleSvgElements = whiteCirclesWrapper.patternify({
      selector: 'white-circle-svg-element',
      elementTag: 'svg',
      data: d3.range(10)
    })
      .attr('width', frequency + (Math.random() * 100 - 40))
      .attr('height', frequency)

    whiteCircleSvgElementCircle = whiteCircleSvgElements
      .patternify({
        selector: 'white-circle-svg-element-circle',
        elementTag: 'circle',
        data: d => [d]
      })
      .attr('r', 30)
      .attr('cx', 100)
      .attr('cy', 100)
      .attr('fill', '#e3e8ef');

    whiteCircleSvgElements.style('transform', function (d) {
      var scale = Math.random() * 2.5 + 0.5;
      return 'scale(' + scale + ')'
    })

    whiteCircleSvgElements.each(function (d) {
      var circleDim = d3.select(this).node().getBoundingClientRect();
      var pos = circleDim.y + circleDim.height;
      if (pos > attrs.height) {
        d3.select(this).style('display', 'none')
      } else {
        d3.select(this).style('display', 'inline')
      }
    })

  },
  layouts: {
    "INITIAL": {
      "pricePointAnalysisHover": {
        x: 65,
        y: 55,
        dx: 135,
        dy: -25,
        invokables: {
          scale: 0.7,
          state: "HIDDEN"
        },
      },
      "mainProductBubble": {
        x: 50,
        y: 50,
        invokables: {
          circleStroke:'#786285',
          scale: 0.8,
          circleFill: '#B93E71',
        }
      },
      "attributeAnalysis": {
        x: 40,
        y: 43,
        invokables: {
          circleFill: '#1B1620',
          circleStroke:'#786285',
          svgWidth: 400,
          svgHeight: 400,
        },
        linkedBubbles: ["attributeAnalysisHover"]
      },
      "customerAnalysis": {
        x: 70,
        y: 30,
        invokables: {
          circleStroke:'#786285',
          circleFill: '#1B1620',
          scale: 0.7,
        },
      },
      "salesStockAnalysis": {
        "Stock2": {
          x: 30,
          y: 55,
          dx: -120,
          dy: -100,
          invokables: {
            circleFill: '#1B1620',
            circleStroke:'#786285',
            scale: 0.52,
            state: "HIDDEN",
            numberFlagColor: '#73628C',
            chartNameFill: "#583F6C",
            lineDirection: 'NONE'
          }
        },
        "Stock3": {
          x: 30,
          y: 55,
          dx: -110,
          dy: 20,
          invokables: {
            circleFill: '#1B1620',
            circleStroke:'#786285',
            scale: 0.52,
            state: "HIDDEN",
            numberFlagColor: '#73628C',
            chartNameFill: "#38214D",
            lineDirection: 'NONE'
          }
        },
        "Stock1": {
          x: 30,
          y: 55,
          invokables: {
            circleFill: '#1B1620',
            circleStroke:'#786285',
            scale: 0.6,
            showTitle: true,
            numberFlagColor: '#73628C',
            chartNameFill: "#73628C",
            lineDirection: 'LEFT',
            hasPointerEvents: true,
          },
          linkedBubbles: ["Stock2", 'Stock3', 'Sell1', 'Sell2', 'Sell3']
        },
        "Sell2": {
          x: 45,
          y: 67,
          dx: 120,
          dy: 80,
          invokables: {
            circleFill: '#1B1620',
            circleStroke:'#786285',
            scale: 0.52,
            state: "HIDDEN",
            numberFlagColor: '#EA5C84',
            chartNameFill: "#F20070",
            lineDirection: 'NONE'
          }
        },
        "Sell3": {
          x: 45,
          y: 67,
          dx: -20,
          dy: 120,
          invokables: {
            circleFill: '#1B1620',
            circleStroke:'#786285',
            scale: 0.52,
            state: "HIDDEN",
            numberFlagColor: '#EA5C84',
            chartNameFill: "#E9004F",
            lineDirection: 'NONE'
          }
        }, "Sell1": {
          x: 45,
          y: 67,
          invokables: {
            circleFill: '#1B1620',
            circleStroke:'#786285',
            scale: 0.6,
            numberFlagColor: '#EA5C84',
            chartNameFill: "#FF0076",
            lineDirection: 'RIGHT',
            hasPointerEvents: true,
          },
          linkedBubbles: ["Stock2", 'Stock3', 'Stock1', 'Sell2', 'Sell3']
        }
      }, "attributeAnalysisHover": {
        x: 40,
        y: 43,
        dx: -185,
        dy: -85,
        invokables: {
          circleFill: '#1B1620',
          svgWidth: 400,
          svgHeight: 400,
          state: "HIDDEN"
        },
      },
      "pricePointAnalysis": {
        x: 65,
        y: 55,
        invokables: {
          circleFill: '#1B1620',
          circleStroke:'#786285',
          scale: 0.5,
          svgWidth: 400,
          svgHeight: 430
        },
        linkedBubbles: ["pricePointAnalysisHover"]
      },
    },
    // "CUSTOMER_ANALYSIS_ACTIVE": {
    //   "pricePointAnalysisHover": {
    //     x: 490,
    //     y: 310,
    //     invokables: {
    //       scale: 0.7,
    //       state: "HIDDEN"
    //     },
    //   },
    //   "attributeAnalysisHover": {
    //     x: -190,
    //     y: -30,
    //     invokables: {
    //       svgWidth: 400,
    //       svgHeight: 400,
    //       state: "HIDDEN"
    //     },
    //   },
    //   "mainProductBubble": {
    //     x: 150,
    //     y: 190,
    //     invokables: {
    //       scale: 0.8,
    //     }
    //   },
    //   "attributeAnalysis": {
    //     x: -150,
    //     y: 30,
    //     invokables: {
    //       svgWidth: 400,
    //       svgHeight: 400,
    //       state: "SHADOWED"
    //     },
    //   },
    //   "customerAnalysis": {
    //     x: 352,
    //     y: 40,
    //     invokables: {
    //       scale: 1,
    //       state: 'ACTIVE'
    //     },
    //   },
    //   "salesStockAnalysis": {
    //     "Stock2": {
    //       x: -70,
    //       y: 80,
    //       invokables: {
    //         scale: 0.52,
    //         state: "HIDDEN",
    //         numberFlagColor: '#73628C',
    //         chartNameFill: "#583F6C",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Stock3": {
    //       x: -60,
    //       y: 200,
    //       invokables: {
    //         scale: 0.52,
    //         state: "HIDDEN",
    //         numberFlagColor: '#73628C',
    //         chartNameFill: "#38214D",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Stock1": {
    //       x: 50,
    //       y: 280,
    //       invokables: {
    //         scale: 0.6,
    //         showTitle: true,
    //         numberFlagColor: '#73628C',
    //         chartNameFill: "#73628C",
    //         state: "SHADOWED",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Sell1": {
    //       x: 200,
    //       y: 340,
    //       invokables: {
    //         scale: 0.6,
    //         numberFlagColor: '#EA5C84',
    //         chartNameFill: "#FF0076",
    //         state: "SHADOWED",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Sell2": {
    //       x: 320,
    //       y: 320,
    //       invokables: {
    //         scale: 0.52,
    //         state: "HIDDEN",
    //         numberFlagColor: '#EA5C84',
    //         chartNameFill: "#F20070",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Sell3": {
    //       x: 180,
    //       y: 360,
    //       invokables: {
    //         scale: 0.52,
    //         state: "HIDDEN",
    //         numberFlagColor: '#EA5C84',
    //         chartNameFill: "#E9004F"
    //       }
    //     },
    //   }
    //   , "pricePointAnalysis": {
    //     x: 60,
    //     y: 55,
    //     invokables: {
    //       scale: 0.5,
    //       svgWidth: 400,
    //       svgHeight: 430,
    //       state: "SHADOWED"
    //     }
    //   },
    // },
    // "CUSTOMER_AND_ATTR_ANALYSIS_ACTIVE": {

    //   "attributeAnalysisHover": {
    //     x: -190,
    //     y: 300,
    //     invokables: {
    //       svgWidth: 400,
    //       svgHeight: 400,
    //       state: "ACTIVE",
    //       scale: 0.8,
    //     },
    //   },
    //   "mainProductBubble": {
    //     x: 120,
    //     y: 150,
    //     invokables: {
    //       scale: 0.8,
    //     }
    //   },
    //   "attributeAnalysis": {
    //     x: 0,
    //     y: 330,
    //     invokables: {
    //       svgWidth: 400,
    //       svgHeight: 400,
    //       state: 'ACTIVE',
    //       scale: 0.6
    //     },
    //     linkedBubbles: ["attributeAnalysisHover"]
    //   },
    //   "customerAnalysis": {
    //     x: 352,
    //     y: 40,
    //     invokables: {
    //       scale: 1,
    //       state: 'ACTIVE'
    //     },
    //   },
    //   "salesStockAnalysis": {
    //     "Stock2": {
    //       x: -70,
    //       y: 80,
    //       invokables: {
    //         scale: 0.52,
    //         state: "HIDDEN",
    //         numberFlagColor: '#73628C',
    //         chartNameFill: "#583F6C",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Stock3": {
    //       x: -60,
    //       y: 200,
    //       invokables: {
    //         scale: 0.52,
    //         state: "HIDDEN",
    //         numberFlagColor: '#73628C',
    //         chartNameFill: "#38214D",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Stock1": {
    //       x: 50,
    //       y: 280,
    //       invokables: {
    //         scale: 0.6,
    //         showTitle: true,
    //         numberFlagColor: '#73628C',
    //         chartNameFill: "#73628C",
    //         state: "SHADOWED",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Sell1": {
    //       x: 200,
    //       y: 340,
    //       invokables: {
    //         scale: 0.6,
    //         numberFlagColor: '#EA5C84',
    //         chartNameFill: "#FF0076",
    //         state: "SHADOWED",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Sell2": {
    //       x: 320,
    //       y: 320,
    //       invokables: {
    //         scale: 0.52,
    //         state: "HIDDEN",
    //         numberFlagColor: '#EA5C84',
    //         chartNameFill: "#F20070",
    //         lineDirection: "NONE"
    //       }
    //     },
    //     "Sell3": {
    //       x: 180,
    //       y: 360,
    //       invokables: {
    //         scale: 0.52,
    //         state: "HIDDEN",
    //         numberFlagColor: '#EA5C84',
    //         chartNameFill: "#E9004F",
    //         lineDirection: "NONE"
    //       }
    //     },
    //   }
    //   , "pricePointAnalysis": {
    //     x: 360,
    //     y: 260,
    //     invokables: {
    //       scale: 0.5,
    //       svgWidth: 400,
    //       svgHeight: 430,
    //       state: "SHADOWED"
    //     }
    //   },
    //   "pricePointAnalysisHover": {
    //     x: 510,
    //     y: 310,
    //     invokables: {
    //       scale: 0.7,
    //       state: "HIDDEN"
    //     },
    //   },
    // }
  }
  // possibleLayouts: {
  //     "INITIAL": {
  //         "pricePointAnalysis": true,
  //         "pricePointAnalysisHover": true,
  //         "attributeAnalysisHover": true,
  //         "salesStockAnalysis": {
  //             "Stock1": true,
  //             "Stock2": true,
  //             "Stock3": true,
  //             "Sell1": true,
  //             "Sell2": true,
  //             "Sell3": true,
  //         },
  //         "mainProductBubble": true,
  //         "attributeAnalysis": true,
  //         "customerAnalysis": true,
  //     },
  //     "CUSTOMER_AND_ATTR_ANALYSIS_ACTIVE": {
  //         "pricePointAnalysis": false,
  //         "pricePointAnalysisHover": false,
  //         "attributeAnalysisHover": true,
  //         "salesStockAnalysis": false,
  //         "mainProductBubble": true,
  //         "attributeAnalysis": true,
  //         "customerAnalysis": true,
  //     },
  //     "CUSTOMER_AND_ATTR_ANALYSIS_INITIAL": {
  //         "pricePointAnalysis": false,
  //         "pricePointAnalysisHover": false,
  //         "attributeAnalysisHover": false,
  //         "salesStockAnalysis": false,
  //         "mainProductBubble": true,
  //         "attributeAnalysis": true,
  //         "customerAnalysis": true,
  //     },
  // },
}



