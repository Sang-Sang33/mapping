import { Component, Event, h, Host, Prop, State } from '@stencil/core'
import { createElsaClient, eventBus, propertyDisplayManager } from '../../../../services'
import state from '../../../../utils/store'
import {
  ActivityDescriptor,
  ActivityModel,
  ActivityPropertyDescriptor,
  EventTypes,
  VersionOptions,
  WorkflowDefinition,
  WorkflowStorageDescriptor
} from '../../../../models'
import { checkBox, FormContext, section, selectField, SelectOption, textArea, textInput } from '../../../../utils/forms'
import { i18n } from 'i18next'
import { loadTranslations } from '../../../i18n/i18n-loader'
import { resources } from './localizations'
import { findChildWorkflowActivityDescriptor } from '../../../../utils/utils'

export interface TabModel {
  tabName: string
  renderContent: () => any
}

export interface ActivityEditorRenderProps {
  activityDescriptor?: ActivityDescriptor
  activityModel?: ActivityModel
  propertyCategories?: Array<string>
  defaultProperties?: Array<ActivityPropertyDescriptor>
  tabs?: Array<TabModel>
  selectedTabName?: string
}

export interface ActivityEditorEventArgs {
  activityDescriptor: ActivityDescriptor
  activityModel: ActivityModel
}

export type ActivityEditorAppearingEventArgs = ActivityEditorEventArgs

export type ActivityEditorDisappearingEventArgs = ActivityEditorEventArgs

@Component({
  tag: 'elsa-activity-editor-modal',
  shadow: false
})
export class ElsaActivityEditorModal {
  @Prop() culture: string
  @Prop({ attribute: 'server-url', reflect: true }) serverUrl: string
  @Prop() workflowDefinition: WorkflowDefinition
  @State() workflowStorageDescriptors: Array<WorkflowStorageDescriptor> = []
  @State() activityModel: ActivityModel
  @State() activityDescriptor: ActivityDescriptor
  @State() renderProps: ActivityEditorRenderProps = {}
  i18next: i18n
  dialog: HTMLElsaModalDialogElement
  formContext: FormContext

  // Force a new key every time we show the editor to make sure Stencil creates new components.
  // This prevents the issue where the designer has e.g. one activity where the user edits the properties, cancels out, then opens the editor again, seeing the entered value still there.
  timestamp: Date = new Date()

  connectedCallback() {
    eventBus.on(EventTypes.ActivityEditor.Show, this.onShowActivityEditor)
  }

  disconnectedCallback() {
    eventBus.detach(EventTypes.ActivityEditor.Show, this.onShowActivityEditor)
  }

  async componentWillLoad() {
    this.i18next = await loadTranslations(this.culture, resources)
  }

  t = (key: string) => this.i18next.t(key)

  updateActivity(formData: FormData) {
    const activity = this.activityModel
    const activityDescriptor = this.activityDescriptor
    const inputProperties: Array<ActivityPropertyDescriptor> = activityDescriptor.inputProperties

    for (const property of inputProperties) propertyDisplayManager.update(activity, property, formData)
    // console.log('🚀 ~ file: elsa-activity-editor-modal.tsx ~ line 71 ~ ElsaActivityEditorModal ~ updateActivity ~ propertyDisplayManager', propertyDisplayManager);
  }

  async componentWillRender() {
    // @ts-ignore
    const activityDescriptor: ActivityDescriptor = this.activityDescriptor || {
      displayName: '',
      type: '',
      outcomes: [],
      category: '',
      traits: 7,
      browsable: false,
      inputProperties: [],
      outputProperties: [],
      description: '',
      customAttributes: {}
    }

    // 将inputProperties中的表单配置分配给对应的tabs

    // 需要动态渲染的tab的input
    const propertyCategories = activityDescriptor.inputProperties
      .filter((x) => x.category)
      .map((x) => x.category)
      .distinct()
    // 默认属性tab的input
    const defaultProperties = activityDescriptor.inputProperties.filter((x) => !x.category || x.category.length == 0)

    const activityModel: ActivityModel = this.activityModel || {
      type: '',
      activityId: '',
      outcomes: [],
      properties: [],
      propertyStorageProviders: {}
    }

    const t = this.t
    let tabs: Array<TabModel> = []

    // 如果有默认的属性tab则渲染
    if (defaultProperties.length > 0) {
      tabs.push({
        tabName: t('Tabs.Properties.Name'),
        renderContent: () => this.renderPropertiesTab(activityModel)
      })
    }

    // 渲染动态activity配置tab及其input输入框
    for (const category of propertyCategories) {
      const categoryTab: TabModel = {
        tabName: category,
        renderContent: () => this.renderCategoryTab(activityModel, activityDescriptor, category)
      }

      tabs.push(categoryTab)
    }

    // 通用activity配置tab
    tabs.push({
      tabName: t('Tabs.Common.Name'),
      renderContent: () => this.renderCommonTab(activityModel)
    })

    // 存储activity配置tab
    tabs.push({
      tabName: t('Tabs.Storage.Name'),
      renderContent: () => this.renderStorageTab(activityModel, activityDescriptor)
    })

    this.renderProps = {
      activityDescriptor,
      activityModel,
      propertyCategories,
      defaultProperties,
      tabs,
      selectedTabName: this.renderProps.selectedTabName
    }

    await eventBus.emit(EventTypes.ActivityEditor.Rendering, this, this.renderProps)

    let selectedTabName = this.renderProps.selectedTabName
    tabs = this.renderProps.tabs

    if (!selectedTabName) this.renderProps.selectedTabName = tabs[0].tabName

    if (tabs.findIndex((x) => x.tabName === selectedTabName) < 0)
      this.renderProps.selectedTabName = selectedTabName = tabs[0].tabName
  }

  async componentDidRender() {
    await eventBus.emit(EventTypes.ActivityEditor.Rendered, this, this.renderProps)
  }

  async onCancelClick() {
    await this.hide(true)
  }

  onSubmit = async (e: Event) => {
    e.preventDefault()
    const form: any = e.target
    const formData = new FormData(form)
    this.updateActivity(formData)
    await eventBus.emit(EventTypes.UpdateActivity, this, this.activityModel)
    await this.hide(true)
  }

  onTabClick = (e: Event, tab: TabModel) => {
    e.preventDefault()
    this.renderProps = { ...this.renderProps, selectedTabName: tab.tabName }
  }

  onShowActivityEditor = async (activity: ActivityModel, animate: boolean) => {
    this.activityModel = JSON.parse(JSON.stringify(activity))
    this.activityDescriptor =
      activity.activityDescriptor || findChildWorkflowActivityDescriptor(state.activityDescriptors, activity)
    // state.activityDescriptors.find((x) => {
    //   const workflowDefinitionIdProperty = activity.properties.find((p) => p.name === 'WorkflowDefinitionId')
    //   if (workflowDefinitionIdProperty) {
    //     // 工作流的type会重复, 需要根据WorkflowDefinitionId的值来找到对应的activityDescriptor
    //     return (
    //       x.inputProperties.find((p) => p.name === 'WorkflowDefinitionId')?.defaultValue ===
    //       workflowDefinitionIdProperty.expressions.Literal
    //     )
    //   }
    //   return x.type == activity.type
    // })
    // if (activity.type === 'RunWorkflow') {
    //   // 测试代码, 表单属性和数据都是后端返回的, 后续应该由后端返回
    //   // console.log('old activityDescriptor:', this.activityDescriptor);
    //   const workflowDefinitionIdInputProperties = this.activityDescriptor.inputProperties.find(
    //     (x) => x.name === 'WorkflowDefinitionId'
    //   )
    //   workflowDefinitionIdInputProperties.uiHint = 'cascadling-list'

    //   const workflowDefinitions = await this.loadWorkflowDefinitions()
    //   console.log(
    //     '🚀 ~ file: elsa-activity-editor-modal.tsx ~ line 191 ~ ElsaActivityEditorModal ~ onShowActivityEditor= ~ workflowDefinitions',
    //     workflowDefinitions
    //   )
    //   workflowDefinitionIdInputProperties.options = {
    //     isFlagsEnum: false,
    //     items: workflowDefinitions.items
    //       .filter((x) => x.definitionId !== this.workflowDefinition.definitionId)
    //       .map(({ definitionId, displayName }) => ({
    //         text: displayName,
    //         value: definitionId
    //       }))
    //   }
    //   // console.log('latest activityDescriptor:', this.activityDescriptor);
    // }

    this.workflowStorageDescriptors = state.workflowStorageDescriptors
    this.formContext = new FormContext(this.activityModel, (newValue) => (this.activityModel = newValue))
    this.timestamp = new Date()
    this.renderProps = {}
    await this.show(animate)
  }

  show = async (animate: boolean) => await this.dialog.show(animate)
  hide = async (animate: boolean) => await this.dialog.hide(animate)

  async loadWorkflowDefinitions() {
    const elsaClient = await createElsaClient(this.serverUrl)
    const page = 0
    const pageSize = 1000
    const latestOrPublishedVersionOptions: VersionOptions = { isLatestOrPublished: true }
    return await elsaClient.workflowDefinitionsApi.list(page, pageSize, latestOrPublishedVersionOptions)
  }

  onKeyDown = async (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'Enter') {
      ;(this.dialog.querySelector('button[type="submit"]') as HTMLButtonElement).click()
    }
  }

  onDialogShown = async () => {
    const args: ActivityEditorAppearingEventArgs = {
      activityModel: this.activityModel,
      activityDescriptor: this.activityDescriptor
    }

    await eventBus.emit(EventTypes.ActivityEditor.Appearing, this, args)
  }

  onDialogHidden = async () => {
    const args: ActivityEditorDisappearingEventArgs = {
      activityModel: this.activityModel,
      activityDescriptor: this.activityDescriptor
    }

    await eventBus.emit(EventTypes.ActivityEditor.Disappearing, this, args)
  }

  render() {
    const renderProps = this.renderProps
    const activityDescriptor: ActivityDescriptor = renderProps.activityDescriptor
    const tabs = renderProps.tabs
    const selectedTabName = renderProps.selectedTabName
    const inactiveClass =
      'elsa-border-transparent elsa-text-gray-500 hover:elsa-text-gray-700 hover:elsa-border-gray-300'
    const selectedClass = 'elsa-border-blue-500 elsa-text-blue-600'
    const t = this.t

    return (
      <Host class="elsa-block">
        <elsa-modal-dialog ref={(el) => (this.dialog = el)} onShown={this.onDialogShown} onHidden={this.onDialogHidden}>
          <div slot="content" class="elsa-py-8 elsa-pb-0">
            <form
              onSubmit={(e) => this.onSubmit(e)}
              key={this.timestamp.getTime().toString()}
              onKeyDown={this.onKeyDown}
              class="activity-editor-form"
            >
              <div class="elsa-flex elsa-px-8">
                <div class="elsa-space-y-8 elsa-divide-y elsa-divide-gray-200 elsa-w-full">
                  <div>
                    {/* header activity type and description */}
                    <div>
                      <h3 class="elsa-text-lg elsa-leading-6 elsa-font-medium elsa-text-gray-900">
                        {activityDescriptor.type}
                      </h3>
                      <p class="elsa-mt-1 elsa-text-sm elsa-text-gray-500">{activityDescriptor.description}</p>
                    </div>

                    {/* tab */}
                    <div class="elsa-border-b elsa-border-gray-200">
                      <nav class="-elsa-mb-px elsa-flex elsa-space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => {
                          const isSelected = tab.tabName === selectedTabName
                          const cssClass = isSelected ? selectedClass : inactiveClass
                          return (
                            <a
                              href="#"
                              onClick={(e) => this.onTabClick(e, tab)}
                              class={`${cssClass} elsa-whitespace-nowrap elsa-py-4 elsa-px-1 elsa-border-b-2 elsa-font-medium elsa-text-sm`}
                            >
                              {tab.tabName}
                            </a>
                          )
                        })}
                      </nav>
                    </div>
                    {/* tab content */}
                    <div class="elsa-mt-8">{this.renderTabs(tabs)}</div>
                  </div>
                </div>
              </div>
              <div class="elsa-pt-5">
                <div class="elsa-bg-gray-50 elsa-px-4 elsa-py-3 sm:elsa-px-6 sm:elsa-flex sm:elsa-flex-row-reverse">
                  <button
                    type="submit"
                    class="elsa-ml-3 elsa-inline-flex elsa-justify-center elsa-py-2 elsa-px-4 elsa-border elsa-border-transparent elsa-shadow-sm elsa-text-sm elsa-font-medium elsa-rounded-md elsa-text-white elsa-bg-blue-600 hover:elsa-bg-blue-700 focus:elsa-outline-none focus:elsa-ring-2 focus:elsa-ring-offset-2 focus:elsa-ring-blue-500"
                  >
                    {t('Buttons.Save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => this.onCancelClick()}
                    class="elsa-w-full elsa-inline-flex elsa-justify-center elsa-rounded-md elsa-border elsa-border-gray-300 elsa-shadow-sm elsa-px-4 elsa-py-2 elsa-bg-white elsa-text-base elsa-font-medium elsa-text-gray-700 hover:elsa-bg-gray-50 focus:elsa-outline-none focus:elsa-ring-2 focus:elsa-ring-offset-2 focus:elsa-ring-blue-500 sm:elsa-mt-0 sm:elsa-ml-3 sm:elsa-w-auto sm:elsa-text-sm"
                  >
                    {t('Buttons.Cancel')}
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

  renderTabs(tabs: Array<TabModel>) {
    return tabs.map((x) => (
      <div class={`flex ${this.getHiddenClass(x.tabName)}`}>
        <elsa-control content={x.renderContent()} />
      </div>
    ))
  }

  renderStorageTab(activityModel: ActivityModel, activityDescriptor: ActivityDescriptor) {
    const formContext = this.formContext
    const t = this.t
    let storageDescriptorOptions: Array<SelectOption> = this.workflowStorageDescriptors.map((x) => ({
      value: x.name,
      text: x.displayName
    }))
    const outputProperties = activityDescriptor.outputProperties.filter((x) => !x.disableWorkflowProviderSelection)
    const inputProperties = activityDescriptor.inputProperties.filter((x) => !x.disableWorkflowProviderSelection)

    storageDescriptorOptions = [{ value: null, text: 'Default' }, ...storageDescriptorOptions]

    const renderPropertyStorageSelectField = function (propertyDescriptor: ActivityPropertyDescriptor) {
      const propertyName = propertyDescriptor.name
      const fieldName = `propertyStorageProviders.${propertyName}`
      return selectField(
        formContext,
        fieldName,
        propertyName,
        activityModel.propertyStorageProviders[propertyName],
        storageDescriptorOptions,
        null,
        fieldName
      )
    }
    return (
      <div class="elsa-space-y-8 elsa-w-full">
        {section(t('Tabs.Storage.Sections.WorkflowContext'))}
        {checkBox(
          formContext,
          'loadWorkflowContext',
          t('Tabs.Storage.Fields.LoadWorkflowContext.Label'),
          activityModel.loadWorkflowContext,
          t('Tabs.Storage.Fields.LoadWorkflowContext.Hint'),
          'loadWorkflowContext'
        )}
        {checkBox(
          formContext,
          'saveWorkflowContext',
          t('Tabs.Storage.Fields.SaveWorkflowContext.Label'),
          activityModel.saveWorkflowContext,
          t('Tabs.Storage.Fields.SaveWorkflowContext.Hint'),
          'saveWorkflowContext'
        )}

        {section(t('Tabs.Storage.Sections.WorkflowInstance'))}
        {checkBox(
          formContext,
          'persistWorkflow',
          t('Tabs.Storage.Fields.SaveWorkflowInstance.Label'),
          activityModel.persistWorkflow,
          t('Tabs.Storage.Fields.SaveWorkflowInstance.Hint'),
          'persistWorkflow'
        )}

        {Object.keys(outputProperties).length > 0
          ? [
              section(t('Tabs.Storage.Fields.ActivityOutput.Title'), t('Tabs.Storage.Fields.ActivityOutput.SubTitle')),
              outputProperties.map(renderPropertyStorageSelectField)
            ]
          : undefined}

        {Object.keys(inputProperties).length > 0
          ? [
              section(t('Tabs.Storage.Fields.ActivityInput.Title'), t('Tabs.Storage.Fields.ActivityInput.SubTitle')),
              inputProperties.map(renderPropertyStorageSelectField)
            ]
          : undefined}
      </div>
    )
  }

  renderCommonTab(activityModel: ActivityModel) {
    const formContext = this.formContext
    const t = this.t

    return (
      <div class="elsa-space-y-8 elsa-w-full">
        {textInput(
          formContext,
          'name',
          t('Tabs.Common.Fields.Name.Label'),
          activityModel.name,
          t('Tabs.Common.Fields.Name.Hint'),
          'activityName'
        )}
        {textInput(
          formContext,
          'displayName',
          t('Tabs.Common.Fields.DisplayName.Label'),
          activityModel.displayName,
          t('Tabs.Common.Fields.DisplayName.Hint'),
          'activityDisplayName'
        )}
        {textArea(
          formContext,
          'description',
          t('Tabs.Common.Fields.Description.Label'),
          activityModel.description,
          t('Tabs.Common.Fields.Description.Hint'),
          'activityDescription'
        )}
      </div>
    )
  }

  renderPropertiesTab(activityModel: ActivityModel) {
    const propertyDescriptors: Array<ActivityPropertyDescriptor> = this.renderProps.defaultProperties

    if (propertyDescriptors.length == 0) return undefined

    const key = `activity-settings:${activityModel.activityId}`
    const t = this.t

    return (
      <div key={key} class={`elsa-grid elsa-grid-cols-1 elsa-gap-y-6 elsa-gap-x-4 sm:elsa-grid-cols-6`}>
        {propertyDescriptors.map((property) => this.renderPropertyEditor(activityModel, property))}
      </div>
    )
  }

  renderCategoryTab(activityModel: ActivityModel, activityDescriptor: ActivityDescriptor, category: string) {
    const propertyDescriptors: Array<ActivityPropertyDescriptor> = activityDescriptor.inputProperties
    const descriptors = propertyDescriptors.filter((x) => x.category == category)
    const key = `activity-settings:${activityModel.activityId}:${category}`

    return (
      <div key={key} class={`elsa-grid elsa-grid-cols-1 elsa-gap-y-6 elsa-gap-x-4 sm:elsa-grid-cols-6`}>
        {descriptors.map((property) => this.renderPropertyEditor(activityModel, property))}
      </div>
    )
  }

  // 渲染属性编辑器(input 输入框)
  renderPropertyEditor(activity: ActivityModel, property: ActivityPropertyDescriptor) {
    const key = `activity-property-input:${activity.activityId}:${property.name}`

    const display = propertyDisplayManager.display(activity, property)
    const id = `${property.name}Control`
    return <elsa-control key={key} id={id} class="sm:elsa-col-span-6" content={display} />
  }

  getHiddenClass(tab: string) {
    return this.renderProps.selectedTabName == tab ? '' : 'hidden'
  }
}
