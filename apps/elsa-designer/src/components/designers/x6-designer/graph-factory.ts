import { CellView, Edge, Graph, Node, Model } from '@antv/x6'
import './ports'
import { ActivityNodeShape } from './shapes'

let _cursorX = 0
let _cursorY = 0

addEventListener('mousemove', (e) => {
  _cursorX = e.clientX
  _cursorY = e.clientY
})

const WIDTH = 5000
const HEIGHT = 5000

export function createGraph(
  container: HTMLElement,
  interacting: CellView.Interacting,
  disableEvents: () => void,
  enableEvents: (emitWorkflowChanged: boolean) => void,
  disableEdit = false
): Graph {
  const graph = new Graph({
    container: container,
    // 定制节点和边的交互行为。
    interacting: interacting,
    // 节点不能组合
    embedding: {
      enabled: false
    },
    // 网格
    grid: {
      type: 'mesh',
      size: 20,
      visible: true,
      args: {
        color: '#e0e0e0'
      }
    },
    height: HEIGHT,
    width: WIDTH,

    // Keep disabled for now until we find that performance degrades significantly when adding too many nodes.
    // When we do enable async rendering, we need to take care of the selection rectangle after pasting nodes, which would be calculated too early (before rendering completed).
    // 是否为异步渲染的画布, 节点过多时存在性能问题时开启
    async: false,

    autoResize: true,
    // 快捷键
    keyboard: {
      enabled: true,
      global: false
    },
    // 剪切板
    clipboard: {
      enabled: true,
      useLocalStorage: true
    },
    // 节点可选
    selecting: {
      enabled: true,
      showNodeSelectionBox: false,
      rubberband: !disableEdit
    },
    scroller: {
      enabled: true,
      pannable: true,
      pageVisible: true,
      pageBreak: false,
      // padding: 0,
      modifiers: ['ctrl', 'meta']
    },
    connecting: {
      allowBlank: false,
      allowMulti: !disableEdit,
      allowLoop: !disableEdit,
      allowNode: !disableEdit,
      allowEdge: false,
      allowPort: !disableEdit,
      highlight: !disableEdit,
      router: {
        name: 'manhattan',
        args: {
          padding: 10,
          startDirections: ['right', 'bottom'],
          endDirections: ['left']
        }
      },
      //connector: 'elsa-connector',
      connector: {
        name: 'rounded',
        args: {
          radius: 10
        }
      },
      snap: {
        radius: 30
      },
      validateMagnet({ magnet }) {
        return magnet.getAttribute('port-group') !== 'in'
      },
      // TODO 优化边连接交互
      validateConnection({ sourceMagnet, targetMagnet }) {
        console.log('🚀 ~ file: graph-factory.ts ~ line 104 ~ validateConnection ~ targetMagnet', targetMagnet)
        console.log('🚀 ~ file: graph-factory.ts ~ line 104 ~ validateConnection ~ sourceMagnet', sourceMagnet)
        // if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
        //   return false
        // }

        // if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
        //   return false
        // }

        // const portId = sourceMagnet.getAttribute('port')!
        // const node = sourceView.cell as Node
        // const port = node.getPort(portId)
        // console.log('🚀 ~ file: graph-factory.ts ~ line 117 ~ validateConnection ~ port', port)
        // return !(port && port.connected)

        // 只能从输出链接桩创建连接
        if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
          return false
        }

        // 只能连接到输入链接桩
        if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
          return false
        }

        // if (sourceView) {
        //   const node = sourceView.cell;
        //   if (node instanceof ActivityNodeShape) {
        //     const portId = targetMagnet.getAttribute('port');
        //     const usedOutPorts = node.getUsedOutPorts(graph);
        //     if (usedOutPorts.find((port) => port && port.id === portId)) {
        //       return false
        //     }
        //   }
        // }
        return true
      },
      createEdge() {
        return graph.createEdge({
          shape: 'elsa-edge',
          zIndex: -1
        })
      }
    },
    onPortRendered(args) {},
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF'
          }
        }
      }
    },
    // 鼠标滚轮缩放画布, 配合scroller
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'], // 鼠标滚轮默认滚动页面, 配置ctrl\meta键来缩放画布
      minScale: container.getBoundingClientRect().height / HEIGHT,
      maxScale: 3
    },
    history: {
      enabled: !disableEdit,
      beforeAddCommand: (e: string, args: any) => {
        if (args.key == 'tools') return false

        const supportedEvents = ['cell:added', 'cell:removed', 'cell:change:*', 'edge:change:*']
        return supportedEvents.indexOf(e) >= 0
      }
    }
  })

  // 注册事件
  addGraphEvents(graph, disableEvents, enableEvents, disableEdit)

  return graph
}

export function addGraphEvents(
  graph,
  disableEvents: () => void,
  enableEvents: (emitWorkflowChanged: boolean) => void,
  disableEdit: boolean
) {
  if (!disableEdit) {
    graph.on('node:mousedown', ({ node }) => {
      // 点击时节点提升层级
      node.toFront()
    })

    graph.on('edge:mouseenter', ({ edge }) => {
      // 添加边的箭头: 拖动该图形来修改边的起点或终点
      edge.addTools([
        'source-arrowhead', // 靠近源节点的箭头
        'target-arrowhead', // 靠近节点的箭头
        {
          name: 'button-remove', // 添加删除按钮,点击时删除对应的边
          args: {
            distance: -30
          }
        }
      ])
    })

    graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools()
    })

    graph.on('edge:removed', ({ edge }) => {})

    function copyGraphCells(graph, cells) {
      if (cells.length) {
        graph.copy(cells)
      }
      const cellsJson = localStorage.getItem('x6.clipboard.cells')
      // 写入剪切板中 用处未知??
      navigator.clipboard.writeText(cellsJson)
    }

    // 复制
    graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.getSelectedCells()
      copyGraphCells(graph, cells)
      return false
    })

    // 剪切
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      const cellsJson = localStorage.getItem('x6.clipboard.cells')
      navigator.clipboard.writeText(cellsJson)
      return false
    })

    // 粘贴
    graph.bindKey(['meta+v', 'ctrl+v'], async () => {
      const cellsJson = await navigator.clipboard.readText()
      if (cellsJson) {
        // 用处未知
        disableEvents()

        let cells = []
        try {
          cells = Model.fromJSON(JSON.parse(cellsJson)) as any
          if (!cells?.length) {
            console.log('No cells to paste')
            return
          }
          cells.forEach((cell) => {
            cell.model = null
            cell.removeProp('zIndex')
            cell.translate(0, 0)
          })
          graph.addCell(cells)
          copyGraphCells(graph, cells) // So it would generate new cell ids to the cells in the clipboard

          const activityIdsMap = cells
            .filter((x) => !!x.activity)
            .reduce(function (map, x) {
              map[x.activity.activityId] = x.id
              return map
            }, {})

          const nodePositions = cells.filter((x) => !!x.activity).map((x) => x.position({ relative: false }))
          const minX = Math.min(...nodePositions.map((x) => x.x))
          const minY = Math.min(...nodePositions.map((x) => x.y))

          graph.disableHistory()
          for (const cell of cells) {
            if (cell.activity) {
              cell.activity.activityId = cell.id

              // Move the cells where the cursor is located
              const cellPosition = cell.position({ relative: false })
              const point = graph.pageToLocal(_cursorX, _cursorY)
              const newX = point.x + cellPosition.x - minX
              const newY = point.y + cellPosition.y - minY
              cell.position(newX, newY)

              cell.activity.x = Math.round(newX)
              cell.activity.y = Math.round(newY)
            } else if (cell.data) {
              cell.data.sourceId = activityIdsMap[cell.data.sourceId] || cell.data.sourceId
              cell.data.targetId = activityIdsMap[cell.data.targetId] || cell.data.targetId
            }
          }
        } catch (error) {
          console.error(error)
        }

        graph.enableHistory()

        await enableEvents(true)
        graph.cleanSelection()
        if (cells.length) {
          graph.select(cells)
        }
      }
      return false
    })

    //undo redo
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.history.canUndo()) {
        graph.history.undo()
      }
      return false
    })

    graph.bindKey(['meta+y', 'ctrl+y'], () => {
      if (graph.history.canRedo()) {
        graph.history.redo()
      }
      return false
    })

    //delete
    graph.bindKey('del', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })
  }

  // select all;
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes()
    if (nodes) {
      graph.select(nodes)
    }
  })

  // zoom
  graph.bindKey(['ctrl+1', 'meta+1'], () => {
    const zoom = graph.zoom()
    if (zoom < 1.5) {
      graph.zoom(0.1)
    }
  })

  graph.bindKey(['ctrl+2', 'meta+2'], () => {
    const zoom = graph.zoom()
    if (zoom > 0.5) {
      graph.zoom(-0.1)
    }
  })
}

export function removeGraphEvents(graph: Graph) {
  graph.off('node:mousedown')
  graph.off('edge:mouseenter')
  graph.off('edge:mouseleave')
  graph.off('edge:removed')
  graph.unbindKey(['meta+c', 'ctrl+c'])
  graph.unbindKey(['meta+x', 'ctrl+x'])
  graph.unbindKey(['meta+v', 'ctrl+v'])
  graph.unbindKey(['meta+z', 'ctrl+z'])
  graph.unbindKey(['meta+y', 'ctrl+y'])
  graph.unbindKey('del')
  graph.unbindKey(['meta+a', 'ctrl+a'])
  graph.unbindKey(['ctrl+1', 'meta+1'])
  graph.unbindKey(['ctrl+2', 'meta+2'])
}

Graph.registerNode('activity', ActivityNodeShape, true)
