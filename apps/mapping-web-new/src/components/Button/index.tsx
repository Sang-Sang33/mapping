import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import cx from 'classnames'

interface IProps {
    className?: string | undefined;
    onClick: () => void;
}

export function Button({ onClick, className, children }: PropsWithChildren<IProps>) {
    return <div onClick={onClick} className={cx([styles.button, className])}>
        {children}
    </div>
}