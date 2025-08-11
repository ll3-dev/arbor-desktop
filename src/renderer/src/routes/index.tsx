import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { trpc } from '@renderer/router'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useSubscription } from '@trpc/tanstack-react-query'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

type ModelStatus = 'initialized' | 'downloading' | 'error' | 'idle'

function RouteComponent() {
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle')
  const [question, setQuestion] = useState('')
  const [message, setMessage] = useState('')

  const { mutateAsync: initModel } = useMutation(trpc.llm.initialize.mutationOptions())
  const { mutateAsync: downloadModel } = useMutation(trpc.llm.downloadModel.mutationOptions())
  const { mutateAsync: invokeModel } = useMutation(trpc.llm.invoke.mutationOptions())

  const { data: progress } = useSubscription(trpc.llm.getDownloadProgress.subscriptionOptions())

  const onDownloadModel = () => downloadModel().then(() => setModelStatus('downloading'))
  const onInitModel = () => initModel().then(() => setModelStatus('initialized'))
  const onInvokeModel = () => {
    invokeModel({ question }).then((result) => setMessage(result.content.toString()))
    setQuestion('')
  }

  return (
    <div>
      <h1>LLM Model Management</h1>
      <p>{message}</p>
      <div>{modelStatus}</div>
      {progress && (
        <div>
          <p>Download Progress: {progress.percent}%</p>
          <p>Transferred: {progress.transferredBytes} bytes</p>
          <p>Total: {progress.totalBytes} bytes</p>
        </div>
      )}
      <Input
        type="text"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Button variant="default" onClick={onDownloadModel}>
        Download File
      </Button>
      {modelStatus === 'idle' && (
        <Button variant="default" onClick={onInitModel}>
          Initialize Model
        </Button>
      )}
      {modelStatus === 'initialized' && (
        <Button variant="default" onClick={onInvokeModel}>
          Invoke Model
        </Button>
      )}
    </div>
  )
}
