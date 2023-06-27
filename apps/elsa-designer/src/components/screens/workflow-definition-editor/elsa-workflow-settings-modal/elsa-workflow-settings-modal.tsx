import { Component, Event, h, Host, Prop, State, Watch } from '@stencil/core'
import { createElsaClient, eventBus } from '../../../../services'
import {
  EventTypes,
  Variables,
  WorkflowContextFidelity,
  WorkflowContextOptions,
  WorkflowDefinition
} from '../../../../models'
import { MonacoValueChangedArgs } from '../../../controls/elsa-monaco/elsa-monaco'
import { MarkerSeverity } from 'monaco-editor'
import { checkBox, FormContext, selectField, SelectOption, textArea, textInput } from '../../../../utils/forms'
import { i18n } from 'i18next'
import { loadTranslations } from '../../../i18n/i18n-loader'
import { resources } from './localizations'
import DashboardTunnel from '../../../../data/dashboard'
interface VariableDefinition {
  name?: string
  value?: string
}

@Component({
  tag: 'elsa-workflow-settings-modal',
  shadow: false
})
export class ElsaWorkflowDefinitionSettingsModal {
  @Prop({ attribute: 'server-url', reflect: true }) serverUrl: string
  @Prop() workflowDefinition: WorkflowDefinition
  @Prop() culture: string
  @State() workflowDefinitionInternal: WorkflowDefinition
  @State() selectedTab = 'Settings'
  @State() newVariable: VariableDefinition = {}
  dialog: HTMLElsaModalDialogElement
  monacoEditor: HTMLElsaMonacoElement
  formContext: FormContext
  workflowChannels: Array<string>

  i18next: i18n

  @Watch('workflowDefinition')
  handleWorkflowDefinitionChanged(newValue: WorkflowDefinition) {
    this.workflowDefinitionInternal = { ...newValue }
    this.formContext = new FormContext(
      this.workflowDefinitionInternal,
      (newValue) => (this.workflowDefinitionInternal = newValue)
    )
  }

  async componentWillLoad() {
    this.handleWorkflowDefinitionChanged(this.workflowDefinition)

    const client = await createElsaClient(this.serverUrl)
    this.workflowChannels = await client.workflowChannelsApi.list()

    this.i18next = await loadTranslations(this.culture, resources)
  }

  t = (key: string) => this.i18next.t(key)

  componentDidLoad() {
    eventBus.on(EventTypes.ShowWorkflowSettings, async () => await this.dialog.show(true))
  }

  onTabClick(e: Event, tab: string) {
    e.preventDefault()
    this.selectedTab = tab
  }

  async onCancelClick() {
    await this.dialog.hide(true)
  }

  async onSubmit(e: Event) {
    e.preventDefault()
    await this.dialog.hide(true)
    setTimeout(() => eventBus.emit(EventTypes.UpdateWorkflowSettings, this, this.workflowDefinitionInternal), 250)
  }

  onMonacoValueChanged(e: MonacoValueChangedArgs) {
    // Don't try and parse JSON if it contains errors.
    const errorCount = e.markers.filter((x) => x.severity == MarkerSeverity.Error).length

    if (errorCount > 0) return

    this.workflowDefinitionInternal.variables = e.value
  }

  render() {
    const tabs = ['Settings', 'Variables', 'WorkflowContext', 'Advanced']
    const selectedTab = this.selectedTab
    const inactiveClass =
      'elsa-border-transparent elsa-text-gray-500 hover:elsa-text-gray-700 hover:elsa-border-gray-300'
    const selectedClass = 'elsa-border-blue-500 elsa-text-blue-600'

    return (
      <Host>
        <elsa-modal-dialog ref={(el) => (this.dialog = el)}>
          <div slot="content" class="elsa-py-8 elsa-pb-0">
            <form onSubmit={(e) => this.onSubmit(e)}>
              <div class="elsa-px-8 mb-8">
                <div class="elsa-border-b elsa-border-gray-200">
                  <nav class="-elsa-mb-px elsa-flex elsa-space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                      const isSelected = tab === selectedTab
                      const cssClass = isSelected ? selectedClass : inactiveClass
                      return (
                        <a
                          href="#"
                          onClick={(e) => this.onTabClick(e, tab)}
                          class={`${cssClass} elsa-whitespace-nowrap elsa-py-4 elsa-px-1 elsa-border-b-2 elsa-font-medium elsa-text-sm`}
                        >
                          {this.t(`Tabs.${tab}.Name`)}
                        </a>
                      )
                    })}
                  </nav>
                </div>
              </div>

              {this.renderSelectedTab()}

              <div class="elsa-pt-5">
                <div class="elsa-bg-gray-50 elsa-px-4 elsa-py-3 sm:elsa-px-6 sm:elsa-flex sm:elsa-flex-row-reverse">
                  <button
                    type="submit"
                    class="elsa-ml-0 elsa-w-full elsa-inline-flex elsa-justify-center elsa-rounded-md elsa-border elsa-border-transparent elsa-shadow-sm elsa-px-4 elsa-py-2 elsa-bg-blue-600 elsa-text-base elsa-font-medium elsa-text-white hover:elsa-bg-blue-700 focus:elsa-outline-none focus:elsa-ring-2 focus:elsa-ring-offset-2 focus:elsa-ring-blue-500 sm:elsa-ml-3 sm:elsa-w-auto sm:elsa-text-sm"
                  >
                    {this.t('Buttons.Save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => this.onCancelClick()}
                    class="elsa-mt-3 elsa-w-full elsa-inline-flex elsa-justify-center elsa-rounded-md elsa-border elsa-border-gray-300 elsa-shadow-sm elsa-px-4 elsa-py-2 elsa-bg-white elsa-text-base elsa-font-medium elsa-text-gray-700 hover:elsa-bg-gray-50 focus:elsa-outline-none focus:elsa-ring-2 focus:elsa-ring-offset-2 focus:elsa-ring-blue-500 sm:elsa-mt-0 sm:elsa-ml-3 sm:elsa-w-auto sm:elsa-text-sm"
                  >
                    {this.t('Buttons.Cancel')}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div slot="buttons" />
        </elsa-modal-dialog>
      </Host>
    )
  }

  renderSelectedTab() {
    const selectedTab = this.selectedTab

    switch (selectedTab) {
      case 'Workflow Context':
        return this.renderWorkflowContextTab()
      case 'Variables':
        return this.renderVariablesTab()
      case 'Advanced':
        return this.renderAdvancedTab()
      case 'Settings':
      default:
        return this.renderSettingsTab()
    }
  }

  renderSettingsTab() {
    const workflowDefinition = this.workflowDefinitionInternal
    const formContext = this.formContext

    return (
      <div class="elsa-flex elsa-px-8">
        <div class="elsa-space-y-8 elsa-w-full">
          {textInput(
            formContext,
            'name',
            this.t('Tabs.Settings.Fields.Name.Label'),
            workflowDefinition.name,
            this.t('Tabs.Settings.Fields.Name.Hint'),
            'workflowName'
          )}
          {textInput(
            formContext,
            'displayName',
            this.t('Tabs.Settings.Fields.DisplayName.Label'),
            workflowDefinition.displayName,
            this.t('Tabs.Settings.Fields.DisplayName.Hint'),
            'workflowDisplayName'
          )}
          {textArea(
            formContext,
            'description',
            this.t('Tabs.Settings.Fields.Description.Label'),
            workflowDefinition.description,
            this.t('Tabs.Settings.Fields.Description.Hint'),
            'workflowDescription'
          )}
        </div>
      </div>
    )
  }

  renderAdvancedTab() {
    const workflowDefinition = this.workflowDefinitionInternal
    const formContext = this.formContext
    const workflowChannelOptions: Array<SelectOption> = [
      {
        text: '',
        value: null
      },
      ...this.workflowChannels.map((x) => ({ text: x, value: x }))
    ]

    const persistenceBehaviorOptions: Array<SelectOption> = [
      {
        text: 'Suspended',
        value: 'Suspended'
      },
      {
        text: 'Workflow Burst',
        value: 'WorkflowBurst'
      },
      {
        text: 'Activity Executed',
        value: 'ActivityExecuted'
      }
    ]

    return (
      <div class="elsa-flex elsa-px-8">
        <div class="elsa-space-y-8 elsa-w-full">
          {textInput(
            formContext,
            'tag',
            this.t('Tabs.Advanced.Fields.Tag.Label'),
            workflowDefinition.tag,
            this.t('Tabs.Advanced.Fields.Tag.Hint'),
            'tag'
          )}
          {selectField(
            formContext,
            'persistenceBehavior',
            this.t('Tabs.Advanced.Fields.PersistenceBehavior.Label'),
            workflowDefinition.persistenceBehavior,
            persistenceBehaviorOptions,
            this.t('Tabs.Advanced.Fields.PersistenceBehavior.Hint'),
            'workflowContextFidelity'
          )}
          {workflowChannelOptions.length > 0
            ? selectField(
                formContext,
                'channel',
                this.t('Tabs.Advanced.Fields.Channel.Label'),
                workflowDefinition.channel,
                workflowChannelOptions,
                this.t('Tabs.Advanced.Fields.Channel.Hint'),
                'channel'
              )
            : undefined}
          {checkBox(
            formContext,
            'isSingleton',
            this.t('Tabs.Advanced.Fields.Singleton.Label'),
            workflowDefinition.isSingleton,
            this.t('Tabs.Advanced.Fields.Singleton.Hint')
          )}
        </div>
      </div>
    )
  }

  renderVariablesTab() {
    const workflowDefinition = this.workflowDefinitionInternal
    const value = workflowDefinition.variables || '{}'
    const language = 'json'

    return (
      <div class="elsa-flex elsa-px-8">
        <div class="elsa-space-y-8 elsa-w-full elsa-h-30">
          <elsa-monaco
            value={value}
            language={language}
            editor-height="30em"
            onValueChanged={(e) => this.onMonacoValueChanged(e.detail)}
            ref={(el) => (this.monacoEditor = el)}
          />
        </div>
      </div>
    )
  }

  renderWorkflowContextTab() {
    const workflowDefinition = this.workflowDefinitionInternal
    const formContext = this.formContext

    const contextOptions: WorkflowContextOptions = workflowDefinition.contextOptions || {
      contextType: undefined,
      contextFidelity: WorkflowContextFidelity.Burst
    }

    const fidelityOptions: Array<SelectOption> = [
      {
        text: 'Burst',
        value: 'Burst'
      },
      {
        text: 'Activity',
        value: 'Activity'
      }
    ]

    return (
      <div class="elsa-flex elsa-px-8">
        <div class="elsa-space-y-8 elsa-w-full">
          {textInput(
            formContext,
            'contextOptions.contextType',
            this.t('Tabs.WorkflowContext.Fields.Type.Label'),
            contextOptions.contextType,
            this.t('Tabs.WorkflowContext.Fields.Type.Hint'),
            'workflowContextType'
          )}
          {selectField(
            formContext,
            'contextOptions.contextFidelity',
            this.t('Tabs.WorkflowContext.Fields.Fidelity.Label'),
            contextOptions.contextFidelity,
            fidelityOptions,
            this.t('Tabs.WorkflowContext.Fields.Fidelity.Hint'),
            'workflowContextFidelity'
          )}
        </div>
      </div>
    )
  }
}

DashboardTunnel.injectProps(ElsaWorkflowDefinitionSettingsModal, ['culture'])
