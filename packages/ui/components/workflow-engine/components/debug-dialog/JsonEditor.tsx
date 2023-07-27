import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface IProps {
  value?: Record<string, any>
  defaultValue?: any
  defaultHeight?: string
}

interface IJsonEditorRef {
  getValue: () => string | undefined
}

const JsonEditor = forwardRef<IJsonEditorRef, IProps>((props, ref) => {
  const { value, defaultValue, defaultHeight = '50vh' } = props
  const [editorValue, setEditorValue] = useState(JSON.stringify(defaultValue, null, 2) ?? '{}')
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  useImperativeHandle(
    ref,
    () => ({
      getValue: () => editorRef.current?.getValue()
    }),
    []
  )

  useEffect(() => {
    setEditorValue(JSON.stringify(value, null, 2) ?? '{}')
  }, [value])
  return (
    <Editor
      onMount={(editor) => (editorRef.current = editor)}
      height={defaultHeight}
      defaultLanguage="json"
      value={editorValue}
    />
  )
})

export default memo(JsonEditor)