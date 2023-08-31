import styles from "./index.module.scss";
import cx from "classnames";

interface Iprops {
	type: "3d" | "2d";
	handleChange(type: "3d" | "2d"): void;
}

export default function SwitchMenu({ type, handleChange }: Iprops) {
	return (
		<div className={styles.switchMenu}>
			<span
				className={cx({
					[styles.switchMenuItem]: true,
					[styles.active]: type === "2d"
				})}
                onClick={() => handleChange('2d')}
			>
				2d
			</span>
			<span
				className={cx({
					[styles.switchMenuItem]: true,
					[styles.active]: type === "3d"
				})}
                onClick={() => handleChange('3d')}
			>
				3d
			</span>
		</div>
	);
}
