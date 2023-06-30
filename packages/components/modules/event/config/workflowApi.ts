// 工作流增删改查等api, 传递给elsa-designer, 让elsa-designer使用自定义的api
const workflowApi = {
  workflowDefinitionsApi: {
    getByDefinitionId: {
      url: `/api/wcs/event`
    },
    save: {
      method: 'PUT',
      url: `/api/wcs/event`
    }
  },
  activitiesApi: {
    list: {
      url: `/api/wcs/event/activities`
    }
  }
}

export default workflowApi
