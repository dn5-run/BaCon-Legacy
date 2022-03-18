import MonacoEditor, { OnMount } from '@monaco-editor/react'
import { ArgumentTypes } from 'bacon-types'
import { useStyletron } from 'baseui'
import { useRef } from 'react'

export const Editor: React.VFC<{ content: string; filepath: string; onSave: (content: string) => void }> = ({ content, filepath, onSave }) => {
  const [css] = useStyletron()
  const ref = useRef<ArgumentTypes<OnMount>[0]>(null)

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 's' && e.ctrlKey) {
          e.preventDefault()
          onSave(ref.current?.getValue() || content)
        }
      }}
      className={css({
        width: '60vw',
        height: '70vh',
      })}
    >
      <MonacoEditor
        height="100%"
        width="100%"
        path={filepath}
        onMount={(editor, monaco) => {
          ;(ref.current as any) = editor
        }}
        value={content}
        theme="vs-dark"
      />
    </div>
  )
}
