import cx from 'classnames';
import { PropsWithChildren, ReactNode } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

interface IProps {
    className?: string | undefined;
    onClick?: () => void;
}

export function BlockButton({ onClick, className, children }: PropsWithChildren<IProps>) {
    return <button onClick={onClick} className={cx([styles.blockButton, className])}>
        {children}
        <PlusCircleOutlined />
    </button>
}