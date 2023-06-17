import { Button, Switch } from 'antd'
import { useStorage } from 'hooks'
import { memo, useEffect, useState } from 'react'
import type { FC } from 'react'
// import { useWcsRequest } from 'services'

const colorList = [
  {
    label: '薄暮',
    color: '#F5222D'
  },
  {
    label: '火山',
    color: '#FA541C'
  },
  {
    label: '日暮',
    color: '#FAAD14'
  },
  {
    label: '明青',
    color: '#13C2C2'
  },
  {
    label: '极光绿',
    color: '#52C41A'
  },
  {
    label: '拂晓蓝（默认）',
    color: '#1890FF'
  },
  {
    label: '极客蓝',
    color: '#2F54EB'
  },
  {
    label: '酱紫',
    color: '#722ED1'
  }
]

const Wcs: FC = () => {
  // const { fetchDevice, fetchEvent, fetchMissionProcess } = useWcsRequest()
  const { getItem, setItem, getAllItem, removeItem } = useStorage()
  const [theme, setTheme] = useState<'dark' | 'light'>(getItem('THEME') ?? 'light')
  const handleThemeChange = (checked: boolean) => {
    const theme = checked ? 'dark' : 'light'
    setItem('THEME', theme)
    setTheme(theme)
  }

  const [color, setColor] = useState<string>(getItem('PRIMARY_COLOR') || '#13C2C2')

  useEffect(() => {
    // fetchDevice().then((res) => {
    //   console.log('🚀 ~ file: index.tsx ~ line 10 ~ fetchDevice ~ device', res)
    // })
    // fetchEvent().then((res) => {
    //   console.log('🚀 ~ file: index.tsx ~ line 13 ~ fetchEvent ~ event', res)
    // })
    // fetchMissionProcess().then((res) => {
    //   console.log('🚀 ~ file: index.tsx ~ line 13 ~ fetchMissionProcess ~ mission process', res)
    // })
  }, [])
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>
        wcs当前主题: {getItem('THEME')} <Switch onChange={handleThemeChange}></Switch>{' '}
        <Button onClick={() => removeItem('THEME')}>删除主题</Button>
      </h2>
      <h2>
        wcs当前主题色: <span style={{ color: getItem('PRIMARY_COLOR') }}>{getItem('PRIMARY_COLOR')}</span>
        <div>
          {colorList.map(({ label, color }) => (
            <Button
              key={color}
              style={{ backgroundColor: color, color: 'white' }}
              onClick={() => {
                setItem('PRIMARY_COLOR', color)
                setColor(color)
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </h2>
      <h2>当前storage存储的所有信息: {JSON.stringify(getAllItem())}</h2>
    </div>
  )
}

export default memo(Wcs)
