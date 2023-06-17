// 工作流增删改查等api, 传递给elsa-designer, 让elsa-designer使用自定义的api
const { VITE_APP_BASIC_API } = import.meta.env
const workflowApi = {
  workflowDefinitionsApi: {
    getByDefinitionId: {
      url: `${VITE_APP_BASIC_API}/api/wcs/event`
    },
    save: {
      method: 'PUT',
      url: `${VITE_APP_BASIC_API}/api/wcs/event`
    }
  },
  activitiesApi: {
    list: {
      url: `/api/wcs/event/activities`
    }
  }
}

export default workflowApi
