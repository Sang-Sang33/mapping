import { Component, h, Prop, State } from '@stencil/core'

@Component({
  tag: 'elsa-studio-workflow-screen',
  shadow: false
})
export class ElsaStudioWorkflowScreen {
  @Prop() mode: 'edit' | 'view'
  @State() eidtorScreenCustomApi
  @State() viewerScreenCustomApi
  @State() isCustomApi

  render() {
    const entries = new URLSearchParams(location.search)
    const params = Object.fromEntries(entries)
    console.log(
      '🚀 ~ file: elsa-studio-workflow-screen.tsx ~ line 16 ~ ElsaStudioWorkflowScreen ~ render ~ params',
      params
    )
    const mode = params['mode'] || this.mode

    return [
      mode === 'edit' && (
        <elsa-workflow-definition-editor-screen
          // workflowDefinitionId={params['workflow-definition-id']}
          canvasHeight="100vh"
        ></elsa-workflow-definition-editor-screen>
      ),
      mode === 'view' && (
        <elsa-workflow-instance-viewer-screen
          // workflowInstanceId={params['workflow-instance-id']}
          canvasHeight="100vh"
        ></elsa-workflow-instance-viewer-screen>
      )
    ]
  }
}
