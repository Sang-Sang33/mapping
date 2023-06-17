import { observer } from 'mobx-react-lite'
import { useStore } from '@/store/index'
import { IMenu } from '@/types'

function Legend() {
  const { EditorStore } = useStore()
  const { editColor, menuConfig } = EditorStore
  const allMenu: IMenu[] = (menuConfig as IMenu[])
    .flatMap((menu: IMenu) => menu.children || [])
    .concat(menuConfig)
    .filter((menu) => menu.meta?.legend !== false)
  return (
    <div className="legend-wrap">
      {allMenu.map(
        (item) =>
          item.key !== 'all' && (
            <div className="legend-item">
              <span className="legend-item-color" style={{ background: editColor[item.key] }}></span>
              <span>- {item.label}</span>
            </div>
          )
      )}
    </div>
  )
}

export default observer(Legend)
