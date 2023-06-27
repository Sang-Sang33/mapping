import { Component, h, Host, Prop, State } from '@stencil/core'
import { eventBus } from '../../../../services'
import { ActivityDescriptor, ActivityDescriptorDisplayContext, ActivityTraits, EventTypes } from '../../../../models'
import { enter, leave } from 'el-transition'
import state from '../../../../utils/store'
import { ActivityIcon } from '../../../icons/activity-icon'
import { ClickOutside } from 'stencil-click-outside'

@Component({
  tag: 'elsa-activity-drag-panel',
  styleUrls: ['elsa-activity-drag-panel.css']
})
export class ElsaActivityDragPanel {
  @Prop({ attribute: 'server-url', reflect: true }) serverUrl: string
  @State() selectedTrait = 7
  @State() searchText: string
  @State() selectedCategory = 'All'
  @State() isShow = false
  @State() isActivityEditorShow = false // 用来判断活动编辑框是否显示,显示则关闭活动选择
  el: HTMLElement
  categories: Array<string> = []
  filteredActivityDescriptorDisplayContexts: Array<ActivityDescriptorDisplayContext> = []

  @ClickOutside({ exclude: 'button.activity-add-button' })
  clickoutSide = async () => {
    if (this.isShow) {
      await leave(this.el)
      this.isShow = false
    }
  }

  connectedCallback() {
    eventBus.on(EventTypes.ShowActivityDragPanel, this.onShowActivityDragPanel)
    eventBus.on(EventTypes.ActivityEditor.Show, this.onActivityEditorShow)
  }

  async componentWillRender() {
    const activityDescriptors: Array<ActivityDescriptor> = state.activityDescriptors
    this.categories = [
      'All',
      ...activityDescriptors
        .map((x) => x.category)
        .distinct() // 去重
        .sort()
    ]

    const searchText = this.searchText ? this.searchText.toLowerCase() : ''
    let filteredActivityDescriptors = activityDescriptors

    if (searchText.length > 0) {
      filteredActivityDescriptors = filteredActivityDescriptors.filter((x) => {
        const category = x.category || ''
        const description = x.description || ''
        const displayName = x.displayName || ''
        const type = x.type || ''

        return (
          category.toLowerCase().indexOf(searchText) >= 0 ||
          description.toLowerCase().indexOf(searchText) >= 0 ||
          displayName.toLowerCase().indexOf(searchText) >= 0 ||
          type.toLowerCase().indexOf(searchText) >= 0
        )
      })
    } else {
      filteredActivityDescriptors = filteredActivityDescriptors.filter(
        (x) => (x.traits & this.selectedTrait) == x.traits
      )
      filteredActivityDescriptors =
        !this.selectedCategory || this.selectedCategory == 'All'
          ? filteredActivityDescriptors
          : filteredActivityDescriptors.filter((x) => x.category == this.selectedCategory)
    }

    this.filteredActivityDescriptorDisplayContexts = filteredActivityDescriptors.map((x) => {
      const color =
        (x.traits &= ActivityTraits.Trigger) == ActivityTraits.Trigger
          ? 'rose'
          : (x.traits &= ActivityTraits.Job) == ActivityTraits.Job
          ? 'yellow'
          : 'sky'
      return {
        activityDescriptor: x,
        activityIcon: <ActivityIcon color={color} />
      }
    })

    for (const context of this.filteredActivityDescriptorDisplayContexts)
      eventBus.emit(EventTypes.ActivityDescriptorDisplaying, this, context)
  }

  onShowActivityDragPanel = async () => {
    await enter(this.el)
    this.isShow = true
  }

  onActivityEditorShow = () => {
    console.log('activity editor show')
    this.isActivityEditorShow = true
  }

  onCategoryClick(e: MouseEvent, category: string) {
    e.preventDefault()
    this.selectCategory(category)
  }

  selectCategory(category: string) {
    this.selectedCategory = category
  }

  onSearchTextChange(e: any) {
    this.searchText = (e.target as HTMLInputElement).value
  }

  async onActivityClick(e: Event, activityDescriptor: ActivityDescriptor) {
    e.preventDefault()
    await eventBus.emit(EventTypes.ActivityPicked, this, activityDescriptor)
    await leave(this.el)
    this.isShow = false
  }

  onActivityDragStart(e: DragEvent, activityDescriptor: ActivityDescriptor) {
    const { offsetX, offsetY } = e
    e.dataTransfer.setData('activityDescriptor', JSON.stringify(activityDescriptor))
    e.dataTransfer.setData('position', JSON.stringify({ offsetX, offsetY }))
  }

  onActivityDragEnd = async (e: DragEvent) => {
    e.dataTransfer.clearData()
    e.preventDefault()
    console.log('drag end')
    if (this.isActivityEditorShow) {
      await leave(this.el)
      this.isShow = false
      this.isActivityEditorShow = false
    }
  }

  renderDisplayContext(displayContexts) {
    return displayContexts.map((displayContext) => {
      let displayName = displayContext.activityDescriptor.displayName
      displayName ||= 'Untitled'
      const description = displayContext.activityDescriptor.description
      return (
        <div class="elsa-my-1">
          <a class="elsa-relative elsa-rounded elsa-group focus-within:elsa-ring-2 focus-within:elsa-ring-inset focus-within:elsa-ring-blue-500">
            <div
              class="activity-card elsa-relative elsa-border-2 elsa-border-solid elsa-cursor-pointer elsa-border-gray-200 hover:elsa-border-blue-600"
              onClick={(e) => this.onActivityClick(e, displayContext.activityDescriptor)}
              onDragStart={(e) => this.onActivityDragStart(e, displayContext.activityDescriptor)}
              onDragEnd={(e) => this.onActivityDragEnd(e)}
              draggable
            >
              <div class="elsa-p-2 elsa-relative">
                <div class="elsa-flex elsa-justify-between elsa-space-x-4 mr-4">
                  <div class="elsa-flex-shrink-0" innerHTML={displayContext.activityIcon}></div>
                  <div class="elsa-flex-1 elsa-font-medium elsa-leading-8">
                    <p class="elsa-overflow-ellipsis elsa-text-base">{displayName}</p>
                    <p class="activity-description elsa-mt-2 elsa-text-sm elsa-text-gray-500">{description}</p>
                  </div>
                </div>
              </div>
            </div>
            {description ? (
              <div class="activity-description-tooltip" data-activity-description={description}></div>
            ) : (
              <p class="activity-description elsa-mt-2 elsa-text-sm elsa-text-gray-500">{description}</p>
            )}
            {/* <div class="elsa-flex elsa-space-x-10">
            <div class="elsa-flex elsa-flex-0 elsa-items-center">
              <div innerHTML={displayContext.activityIcon}></div>
            </div>
            <div class="elsa-flex-1 elsa-mt-2">
              <h3 class="elsa-text-lg elsa-font-medium">
                <a class="focus:elsa-outline-none">
                  <span class="elsa-absolute elsa-inset-0" aria-hidden="true" />
                  {displayName}
                </a>
              </h3>
              <p class="elsa-mt-2 elsa-text-sm elsa-text-gray-500">
                {displayContext.activityDescriptor.description}
              </p>
            </div>
          </div> */}
          </a>
        </div>
      )
    })
  }

  render() {
    const selectedCategoryClass = 'elsa-bg-gray-100 elsa-text-gray-900 elsa-flex'
    const defaultCategoryClass = 'elsa-text-gray-600 hover:elsa-bg-gray-50 hover:elsa-text-gray-900'
    const filteredDisplayContexts = this.filteredActivityDescriptorDisplayContexts
    const categories = this.categories

    return (
      <div
        ref={(el) => {
          this.el = el
        }}
        data-transition-enter="elsa-transform elsa-transition elsa-ease-in-out elsa-duration-300 sm:elsa-duration-700"
        data-transition-enter-start="elsa-negative-translate-x-full"
        data-transition-enter-end="elsa-translate-x-0"
        data-transition-leave="elsa-transform elsa-transition elsa-ease-in-out elsa-duration-300 sm:elsa-duration-700"
        data-transition-leave-start="elsa-translate-x-0"
        data-transition-leave-end="elsa-negative-translate-x-full"
        class="elsa-fixed elsa-top-0 elsa-bottom-2 elsa-z-20 elsa-w-screen elsa-max-w-lg elsa-p-2 elsa-pt-20 elsa-overflow-auto elsa-bg-white hidden"
      >
        <button
          type="button"
          onClick={() => {
            leave(this.el)
            this.isShow = false
          }}
          class={`elsa-absolute elsa-right-0 elsa-top-2 elsa-inline-flex elsa-items-center elsa-p-2 elsa-rounded-full elsa-border elsa-border-transparent elsa-bg-white shadow elsa-text-gray-400 hover:elsa-text-blue-500 focus:elsa-text-blue-500 hover:elsa-ring-2 hover:elsa-ring-offset-2 hover:elsa-ring-blue-500 focus:elsa-outline-none focus:elsa-ring-2 focus:elsa-ring-offset-2 focus:elsa-ring-blue-500 elsa-z-10`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="elsa-h-8 elsa-w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        <div class="elsa-flex">
          <div class="elsa-px-8">
            {/* sidebar */}
            <nav class="elsa-space-y-1" aria-label="Sidebar">
              {categories.map((category) => (
                <a
                  href="#"
                  onClick={(e) => this.onCategoryClick(e, category)}
                  class={`${
                    category == this.selectedCategory ? selectedCategoryClass : defaultCategoryClass
                  } elsa-text-gray-600 hover:elsa-bg-gray-50 hover:elsa-text-gray-900 elsa-flex elsa-items-center elsa-px-3 elsa-py-2 elsa-text-sm elsa-font-medium elsa-rounded-md`}
                >
                  <span class="elsa-truncate">{category}</span>
                </a>
              ))}
            </nav>
          </div>
          <div class="elsa-flex-1 elsa-pr-8">
            {/* search activities area */}
            <div class="elsa-p-0 elsa-mb-6">
              <div class="elsa-relative elsa-rounded-md elsa-shadow-sm">
                <div class="elsa-absolute elsa-inset-y-0 elsa-left-0 elsa-pl-3 elsa-flex elsa-items-center elsa-pointer-events-none">
                  <svg
                    class="elsa-h-6 elsa-w-6 elsa-text-gray-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="10" cy="10" r="7" />
                    <line x1="21" y1="21" x2="15" y2="15" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={this.searchText}
                  onInput={(e) => this.onSearchTextChange(e)}
                  class="form-input elsa-block elsa-w-full elsa-pl-10 sm:elsa-text-sm sm:elsa-leading-5 focus:elsa-ring-blue-500 focus:elsa-border-blue-500 elsa-rounded-md elsa-border-gray-300"
                  // placeholder={this.t('SearchPlaceholder')}
                />
              </div>
            </div>
            {/* activities */}
            <div class="elsa-max-w-4xl elsa-mx-auto elsa-p-0">
              {categories.map((category) => {
                const displayContexts = filteredDisplayContexts.filter((x) => x.activityDescriptor.category == category)
                const subCategoryContexts = {}

                displayContexts.forEach((x) => {
                  const subCategory = x.activityDescriptor.customAttributes?.SubCategory
                  if (!subCategory) return
                  const v = subCategoryContexts[subCategory] || []
                  v.push(x)
                  subCategoryContexts[subCategory] = v
                })

                if (displayContexts.length == 0) return undefined

                return (
                  <div>
                    <h2 class="elsa-my-4 elsa-text-lg elsa-leading-6 elsa-font-medium">{category}</h2>
                    <div class="elsa-divide-y elsa-divide-gray-200 sm:elsa-divide-y-0 sm:elsa-grid sm:elsa-grid-cols-1 sm:elsa-gap-px">
                      {Object.keys(subCategoryContexts).length > 0
                        ? Object.entries(subCategoryContexts).map(([k, v]) => {
                            return (
                              <div>
                                <h3 class="elsa-ml-4 elsa-leading-6 elsa-font-medium">{k}</h3>
                                {this.renderDisplayContext(v)}
                              </div>
                            )
                          })
                        : this.renderDisplayContext(displayContexts)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
