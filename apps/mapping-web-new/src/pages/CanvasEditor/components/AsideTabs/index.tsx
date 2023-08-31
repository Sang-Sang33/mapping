import cx from "classnames";
import styles from "./index.module.scss";
import { useStore } from "@/store";
import { Tabs } from "@/constants";
import { ETabKey } from "@/typings";
import { observer } from "mobx-react-lite";

function AsideTabs() {
  const { editorStore } = useStore();
  const { currentTab, currentTabIndex } = editorStore;
  return (
    <aside className={cx([styles.canvasEditoAside, "canvasEditorAside"])}>
      <div
        className={cx([styles.canvasEditoAsideActionItem])}
        style={{ transform: `translateY(${currentTabIndex * 72}px)` }}
      ></div>
      <div className="relative z-[200]">
        {Tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => editorStore.setCurrentTab(tab.key as ETabKey)}
            className={cx([
              styles.canvasEditoAsideItem,
              { [styles.active]: currentTab === tab.key },
            ])}
          >
            <i
              className={cx(["iconfont", tab.icon])}
              style={{ fontSize: 26, marginBottom: 8 }}
            ></i>
            <span>{tab.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default observer(AsideTabs);
