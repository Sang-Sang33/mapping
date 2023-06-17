import { useStore } from "../store/index";
import { observer } from "mobx-react-lite";

function RectMenu() {
    const { EditorStore } = useStore();
    const { x, y, show, rectName } = EditorStore.rectMenuParams
    function handleDelete() {
        EditorStore.removeSelectedRect(rectName)
    }
    function handleEdit() {
        EditorStore.setEditingRectName(rectName)
        EditorStore.setDrawerOpen(true)
    }
    return <div className="rect-menu" style={{ top: y + 'px', left: x + 'px', display: show ? 'block' : 'none' }}>
        <div className="rect-menu-item" onClick={handleEdit}>编辑</div>
        <div className="rect-menu-item" onClick={handleDelete}>删除</div>
    </div>
}

export default observer(RectMenu)