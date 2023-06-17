// 工作流增删改查等api, 传递给elsa-designer, 让elsa-designer使用自定义的api
const workflowApi = {
  // 工作流定义的api
  workflowDefinitionsApi: {
    getByDefinitionId: {
      url: `/api/wcs/function`
    },
    save: {
      method: 'PUT',
      url: `/api/wcs/function`
    }
  },
  activitiesApi: {
    list: {
      url: `/api/wcs/device/activities`
    }
  }
}

export default workflowApi
