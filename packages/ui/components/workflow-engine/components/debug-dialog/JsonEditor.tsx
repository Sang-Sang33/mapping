import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface IProps {
  defaultValue?: any
}

interface IJsonEditorRef {
  getValue: () => string | undefined
}

const JsonEditor = forwardRef<IJsonEditorRef, IProps>((props, ref) => {
  const { defaultValue } = props
  const [value, setValue] = useState('{}')
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  useImperativeHandle(
    ref,
    () => ({
      getValue: () => editorRef.current?.getValue()
    }),
    []
  )

  useEffect(() => {
    setValue(JSON.stringify(defaultValue, null, 2) ?? {})
  }, [defaultValue])
  return (
    <Editor onMount={(editor) => (editorRef.current = editor)} height="50vh" defaultLanguage="json" value={value} />
  )
})

export default memo(JsonEditor)
