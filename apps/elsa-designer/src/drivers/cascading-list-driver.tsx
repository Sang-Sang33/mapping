import { PropertyDisplayDriver } from '../services'
import { ActivityModel, ActivityPropertyDescriptor } from '../models'
import { h } from '@stencil/core'
import { getOrCreateProperty } from '../utils/utils'

export class CascadingListDriver implements PropertyDisplayDriver {
  display(activity: ActivityModel, property: ActivityPropertyDescriptor) {
    const prop = getOrCreateProperty(activity, property.name)
    return <elsa-cascading-list-property activityModel={activity} propertyDescriptor={property} propertyModel={prop} />
  }

  update(activity: ActivityModel, property: ActivityPropertyDescriptor, form: FormData) {}
}
