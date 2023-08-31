import { PropsWithChildren } from "react";
import styles from "./index.module.scss";
import cx from "classnames";
import { Popover, PopoverProps } from "antd";

interface IProps {
	active: boolean;
	className?: string;
	onClick: () => void;
    popoverProps: PopoverProps;
    id?: string;
}

export default function Operation({ active, children, popoverProps, className, ...props }: PropsWithChildren<IProps>) {
	return (
        <Popover {...popoverProps}>
            <div className={cx([styles.operation, "cursor-pointer", { [styles.active]: active }, className])} {...props} >
                {children}
            </div>
        </Popover>
	);
}
