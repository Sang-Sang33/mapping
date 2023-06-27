import { Component, h, Prop, State } from '@stencil/core'
import {
  ActivityDefinitionProperty,
  ActivityModel,
  ActivityPropertyDescriptor,
  VersionOptions
} from '../../../../models'
import Tunnel from '../../../../data/workflow-editor'
import { createElsaClient } from '../../../../services'
import { enter, leave } from 'el-transition'

interface IOption {
  label: string
  value: string
  children: {
    label: string
    value: string
    children: {
      label: string
      value: string
    }[]
  }[]
}

@Component({
  tag: 'elsa-cascading-list-property',
  styleUrl: 'elsa-cascading-list-property.css',
  shadow: false
})
export class ElsaWorkflowListProperty {
  @Prop() activityModel: ActivityModel
  @Prop() propertyDescriptor: ActivityPropertyDescriptor
  @Prop() propertyModel: ActivityDefinitionProperty
  @Prop({ mutable: true }) serverUrl: string
  @State() selectedValues: string[] = []
  @State() options: IOption[] = [
    {
      label: 'Option 1',
      value: 'option1',
      children: [
        {
          label: 'Option 1-1',
          value: 'option1-1',
          children: [
            { label: 'Option 1-1-1', value: 'option1-1-1' },
            { label: 'Option 1-1-2', value: 'option1-1-2' }
          ]
        },
        {
          label: 'Option 1-2',
          value: 'option1-2',
          children: [
            { label: 'Option 1-2-1', value: 'option1-2-1' },
            { label: 'Option 1-2-2', value: 'option1-2-2' }
          ]
        }
      ]
    },
    {
      label: 'Option 2',
      value: 'option2',
      children: [
        {
          label: 'Option 2-1',
          value: 'option2-1',
          children: [
            { label: 'Option 2-1-1', value: 'option2-1-1' },
            { label: 'Option 2-1-2', value: 'option2-1-2' }
          ]
        },
        {
          label: 'Option 2-2',
          value: 'option2-2',
          children: [
            { label: 'Option 2-2-1', value: 'option2-2-1' },
            { label: 'Option 2-2-2', value: 'option2-2-2' }
          ]
        }
      ]
    },
    {
      label: 'Option 3',
      value: 'Option 3',
      children: []
    },
    {
      label: 'Option 4',
      value: 'Option 4',
      children: []
    },
    {
      label: 'Option 5',
      value: 'Option 5',
      children: []
    },
    {
      label: 'Option 6',
      value: 'Option 6',
      children: []
    },
    {
      label: 'Option 7',
      value: 'Option 7',
      children: []
    },
    {
      label: 'Option 8',
      value: 'Option 8',
      children: []
    },
    {
      label: 'Option 9',
      value: 'Option 9',
      children: []
    },
    {
      label: 'Option 10',
      value: 'Option 10',
      children: []
    },
    {
      label: 'Option 11',
      value: 'Option 11',
      children: []
    }
  ]

  private cascadingListContainerEl: HTMLDivElement = null
  private cascadingListEl: HTMLDivElement = null
  private lastExpandedContainerMap: Map<number, HTMLDivElement> = new Map()

  handleDocumentClick(e: MouseEvent) {
    if (this.cascadingListContainerEl && !this.cascadingListContainerEl.contains(e.target as Node)) {
      this.hideList()
    }
  }

  hideList() {
    leave(this.cascadingListEl)
    if (this.selectedValues.length === 0) {
      for (let container of this.lastExpandedContainerMap.values()) {
        container.classList.toggle('elsa-hidden')
      }
      this.lastExpandedContainerMap.clear()
    }
  }

  componentDidLoad() {
    document.addEventListener('click', (e) => this.handleDocumentClick(e), true)
  }

  disconnectedCallback() {
    document.removeEventListener('click', (e) => this.handleDocumentClick(e), true)
  }

  async loadWorkflowDefinitions() {
    const elsaClient = await createElsaClient(this.serverUrl)
    const page = 0
    const pageSize = 1000
    const latestOrPublishedVersionOptions: VersionOptions = { isLatestOrPublished: true }
    return await elsaClient.workflowDefinitionsApi.list(page, pageSize, latestOrPublishedVersionOptions)
  }

  handleItemClick = (event: MouseEvent, level: number, option: IOption) => {
    if (option.children?.length) {
      this.toggleOptions(event, level)
    } else {
      this.hideList()
    }
    this.selectOption(option, level)
  }

  toggleOptions = (event: MouseEvent, level: number) => {
    const target = event.currentTarget as HTMLElement
    const lastExpandedContainer = this.lastExpandedContainerMap.get(level)
    if (lastExpandedContainer) lastExpandedContainer.classList.toggle('elsa-hidden')
    const childrenContainer = target.nextElementSibling as HTMLDivElement
    childrenContainer.classList.toggle('elsa-hidden')
    this.lastExpandedContainerMap.set(level, childrenContainer)
  }

  selectOption = (option: IOption, level: number) => {
    this.selectedValues[level - 1] = option.value
    this.selectedValues = [...this.selectedValues.slice(0, level)]
  }

  clearSelectedValues = () => {
    this.selectedValues = []
    this.hideList()
  }

  getBorderClass = (level: number) => {
    if (!this.selectedValues.length) return 'elsa-rounded-md'

    if (level - 1 === 0) return 'elsa-rounded-tl-md elsa-rounded-bl-md'
    else if (level - 1 === this.selectedValues.length) return 'elsa-rounded-tr-md elsa-rounded-br-md'
    else return ''
  }

  renderOptions = (options: any[], level: number) => {
    if (!options || !options.length) return null

    return (
      <ul
        class={`elsa-p-1 elsa-bg-white elsa-shadow-md elsa-h-90 elsa-overflow-auto elsa-box-content ${this.getBorderClass(
          level
        )}`}
      >
        {options.map((option) => (
          <li>
            <div
              class={`elsa-cursor-pointer elsa-px-2 elsa-py-2 hover:elsa-bg-gray-200 elsa-flex elsa-items-center elsa-rounded ${
                this.selectedValues.includes(option.value) ? 'elsa-bg-gray-300 font-bold' : ''
              }`}
              onClick={(e) => this.handleItemClick(e, level, option)}
            >
              <span class="elsa-text-sm elsa-whitespace-nowrap elsa-mr-2">{option.label}</span>
              {option.children && option.children.length ? (
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5457"
                  width="14"
                  height="14"
                >
                  <path
                    d="M290.3 945c17.5 17.5 45.8 17.5 63.3 0l370.2-370.2c35-35 35-91.7 0-126.6l-372.9-373c-17.3-17.3-45.3-17.5-62.8-0.5-17.9 17.4-18.1 46.1-0.5 63.8l341.3 341.3c17.5 17.5 17.5 45.8 0 63.3L290.3 881.7c-17.5 17.5-17.5 45.8 0 63.3z"
                    p-id="5458"
                  ></path>
                </svg>
              ) : null}
            </div>
            {option.children && option.children.length ? (
              <div class="elsa-hidden elsa-absolute elsa-z-10 elsa-top-0 elsa-left-full elsa-w-fit">
                {this.renderOptions(option.children, level + 1)}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const value = this.selectedValues.length ? this.selectedValues.join(' / ') : ''
    const propertyDescriptor = this.propertyDescriptor
    const hint = propertyDescriptor.hint
    const fieldName = propertyDescriptor.name
    const label = propertyDescriptor.label
    console.log(this.selectedValues)

    return (
      <div class="elsa-relative">
        <label htmlFor={fieldName} class="elsa-mb-1 elsa-block elsa-text-sm elsa-font-medium elsa-text-gray-700">
          {label}
        </label>
        <div class="elsa-relative" ref={(el) => (this.cascadingListContainerEl = el)}>
          <input
            type="text"
            value={value}
            placeholder="Select an option"
            class="focus:elsa-ring-blue-500 focus:elsa-border-blue-500 elsa-block elsa-w-full elsa-min-w-0 elsa-rounded-md sm:elsa-text-sm elsa-border-gray-300"
            readOnly
            onFocus={(_) => enter(this.cascadingListEl)}
          />
          <svg
            class={`elsa-absolute elsa-right-2 elsa-top-1/2 elsa-negative-translate-y-half elsa-z-10 elsa-cursor-pointer ${
              this.selectedValues.length ? 'elsa-opacity-100' : 'elsa-opacity-0'
            }`}
            viewBox="0 0 1025 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3472"
            width="20"
            height="20"
            onClick={() => this.clearSelectedValues()}
          >
            <path
              d="M513.344 0a512 512 0 1 0 0 1024 512 512 0 0 0 0-1024z m226.048 674.624l-54.528 56.896-171.52-164.928-171.392 164.928-54.592-56.896L456.576 512 287.36 349.312l54.592-56.768 171.392 164.8 171.52-164.8 54.528 56.768L570.176 512l169.216 162.624z"
              fill="#e6e6e6"
              p-id="3473"
            ></path>
          </svg>
          <div
            ref={(el) => (this.cascadingListEl = el)}
            data-transition-enter="elsa-ease-out elsa-duration-300"
            data-transition-enter-start="elsa-opacity-0 elsa-translate-y-4 sm:elsa-translate-y-0 sm:elsa-scale-95"
            data-transition-enter-end="elsa-opacity-0 elsa-translate-y-0 sm:elsa-scale-100"
            data-transition-leave="elsa-ease-in elsa-duration-200"
            data-transition-leave-start="elsa-opacity-0 elsa-translate-y-0 sm:elsa-scale-100"
            data-transition-leave-end="elsa-opacity-0 elsa-translate-y-4 sm:elsa-translate-y-0 sm:elsa-scale-95"
            class="elsa-absolute elsa-top-full elsa-left-0 elsa-mt-1 elsa-w-fit elsa-h-fit elsa-opacity-0 elsa-translate-y-4 sm:elsa-translate-y-0 sm:elsa-scale-95 elsa-shadow-lg "
          >
            {this.renderOptions(this.options, 1)}
          </div>
        </div>
        {hint && hint.length > 0 ? <p class="elsa-mt-2 elsa-text-sm elsa-text-gray-500">{hint}</p> : undefined}
      </div>
    )
  }
}

Tunnel.injectProps(ElsaWorkflowListProperty, ['serverUrl'])
