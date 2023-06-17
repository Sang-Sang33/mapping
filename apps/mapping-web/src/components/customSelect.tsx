import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button, message } from 'antd';
import type { InputRef } from 'antd';

interface ICustomSelect {
    defaultValues?: string[];
    inputLen?: 1 | 2;
}

const CustomSelect = (props: ICustomSelect, ref) => {
    const { defaultValues = [], inputLen = 1 } = props
    const [options, setOptions] = useState<any[]>(defaultValues);
    const [value, setValue] = useState<any[]>(defaultValues)
    const [name, setName] = useState<any>();
    const [name2, setName2] = useState<any>();
    const inputRef = useRef<InputRef>(null);
    const inputRef2 = useRef<InputRef>(null);

    useImperativeHandle(ref, () => ({
        state: {
            value,
            options,
        },
    }));

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const onNameChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName2(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        const newOpt = inputLen > 1 ? `${name}-${name2}` : name
        if (options.includes(newOpt)) {
            return message.error('不能含有重复值！')
        }
        setOptions([...options, newOpt]);
        setName(undefined);
        setName2(undefined);
        setTimeout(() => {
            inputRef.current?.focus();
            setValue((val) => ([...val, newOpt]))
        }, 0);
    };

    const handleChange = (val: any) => {
        setValue(val)
    }

    return (
        <Select
            style={{ width: 300 }}
            value={value}
            onChange={handleChange}
            mode="multiple"
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                            placeholder="请输入"
                            ref={inputRef}
                            value={name}
                            onChange={onNameChange}
                        />
                        {
                            inputLen > 1 && <Input
                                placeholder="请输入"
                                ref={inputRef2}
                                value={name2}
                                onChange={onNameChange2}
                            />
                        }
                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                            新增
                        </Button>
                    </Space>
                </>
            )}
            options={options.map((item) => ({ label: item, value: item }))}
        />
    );
};

export default forwardRef(CustomSelect);