import { createProviderConsumer } from '@stencil/state-tunnel'
import { h } from '@stencil/core'
import { CustomApi } from '../services'

export interface DashboardState {
  serverUrl: string
  basePath: string
  culture: string
  monacoLibPath: string
  serverFeatures: Array<string>
  serverVersion: string
  customApi: CustomApi
  isCustomApi: boolean
}

export default createProviderConsumer<DashboardState>(
  {
    serverUrl: null,
    basePath: null,
    culture: null,
    monacoLibPath: null,
    serverFeatures: [],
    serverVersion: null,
    customApi: null,
    isCustomApi: false
  },
  (subscribe, child) => <context-consumer subscribe={subscribe} renderer={child} />
)
