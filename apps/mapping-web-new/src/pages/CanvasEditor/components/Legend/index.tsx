import cx from 'classnames';
import styles from './index.module.scss';

export default function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <span
          className={cx([styles.legendItemColor, styles.round])}
          style={{ backgroundColor: "#333" }}
        ></span>
        <span>RCS点位</span>
      </div>
      <div className={styles.legendItem}>
        <span
          className={cx([styles.legendItemColor, styles.round])}
          style={{ backgroundColor: "#7e22ce" }}
        ></span>
        <span>库位点</span>
      </div>
      <div className={styles.legendItem}>
        <span
          className={styles.legendItemColor}
          style={{ backgroundColor: "#007aff" }}
        ></span>
        <span>区域</span>
      </div>
      <div className={styles.legendItem}>
        <span
          className={styles.legendItemColor}
          style={{ backgroundColor: "#78716c" }}
        ></span>
        <span>巷道</span>
      </div>
      <div className={styles.legendItem}>
        <span
          className={styles.legendItemColor}
          style={{ backgroundColor: "#a855f7" }}
        ></span>
        <span>货架</span>
      </div>
    </div>
  );
}
