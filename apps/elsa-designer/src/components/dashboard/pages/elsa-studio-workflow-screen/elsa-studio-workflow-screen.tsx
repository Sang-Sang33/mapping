import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'elsa-studio-workflow-screen',
  shadow: false
})
export class ElsaStudioHome {
  @Prop() mode: 'edit' | 'view' = 'edit'

  render() {
    const mode = this.mode
    const entries = new URLSearchParams(location.search)
    const params = Object.fromEntries(entries)

    return mode === 'edit' ? (
      <elsa-workflow-definition-editor-screen
        workflowDefinitionId={params['workflow-definition-id']}
        canvasHeight="100vh"
      ></elsa-workflow-definition-editor-screen>
    ) : (
      <elsa-workflow-instance-viewer-screen
        workflowInstanceId={params['workflow-instance-id']}
        canvasHeight="100vh"
      ></elsa-workflow-instance-viewer-screen>
    )
  }
}
