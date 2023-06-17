import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/index";
import { observer } from "mobx-react-lite";
import { Button, Checkbox, Form, Input, Switch, Select, message } from 'antd';
import './style.less'
import { getCustomerList, login } from '@/services'
import { useRequest } from "ahooks";
import qs from "qs";
import { setToken } from '@/utils/token'
import { getTenant } from '@/utils/env'

interface IFormValues {
	tenant: string;
	username: string;
	password: string;
	remember: boolean;
}

const ipReg = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,}$/
const isIp = ipReg.test(window.location.host) || window.location.host.includes('localhost')

const Login: React.FC = () => {
	const { EditorStore } = useStore()
	const [logining, setLogining] = useState(false)
	const navigate = useNavigate();
	const [isTalent, setIsTalent] = useState<boolean>(false)
	const [customerOptions, setCustomerOptions] = useState<Record<string, any>[] | undefined>(undefined)
	const { runAsync, loading } = useRequest(getCustomerList, { manual: true })

	useEffect(() => {
		// if (isTalent && !customerOptions && !loading) {
		runAsync().then(data => {
			const opts = data.map(item => ({ label: item.displayName, value: item.id, name: item.name }))
			setCustomerOptions(opts)
		}).catch(e => {
			console.log(e)
		})
		// }
	}, [])

	const onFinish = async (values: IFormValues) => {
		const { password, username } = values
		setLogining(true)
		try {
			const otherHeader: any = {}
			if (isTalent) {
				customerOptions?.forEach((item) => {
					if (item.value === values.tenant) otherHeader.__tenant = item.name
				})
			}
			if (!isIp) otherHeader.__tenant = getTenant()
			const res = await login(qs.stringify({ password, username, grant_type: 'password', client_id: 'MultiwayCloud_User' }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...otherHeader } })
			EditorStore.clearUserInfo()
			setToken(res.access_token)
			setTimeout(() => {
				navigate("/", { replace: true });
			}, 1000);
			if (isTalent || !isIp) {
				customerOptions?.forEach((item) => {
					if (item.label === otherHeader.__tenant) EditorStore.setTenantId(item.value)
				})
			}
			EditorStore.setIsHost(!isTalent && isIp)
		} catch (e) {
			message.error('登录失败！')
		} finally {
			setLogining(false);
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};
	return <div className="login-wrap">
		<Form
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 24 }}
			style={{ width: '500px' }}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
			{
				isIp && <Form.Item label="租户" valuePropName="isTalent">
					<Switch checked={isTalent} onChange={(val) => setIsTalent(val)} />
				</Form.Item>
			}

			{
				isIp && isTalent && <>
					<Form.Item
						label="租户"
						name='tenant'
						rules={[{ required: true, message: '请选择租户' }]}
					>
						<Select options={customerOptions}>
						</Select>
					</Form.Item>
				</>
			}

			<Form.Item
				label="用户名"
				name="username"
				rules={[{ required: true, message: '请输入用户名' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="密码"
				name="password"
				rules={[{ required: true, message: '请输入密码' }]}
			>
				<Input.Password />
			</Form.Item>
			<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
				<Checkbox>记住密码</Checkbox>
			</Form.Item>

			<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
				<Button type="primary" htmlType="submit" loading={logining}>
					登录
				</Button>
			</Form.Item>
		</Form>
	</div>
};

export default observer(Login);