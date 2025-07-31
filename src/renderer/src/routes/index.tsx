import { Button } from '@renderer/components/ui/button'
import { trpc } from '@renderer/router'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useSubscription } from '@trpc/tanstack-react-query'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

type ModelStatus = 'initialized' | 'downloading' | 'error' | 'idle'

function RouteComponent() {
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle')
  const [message, setMessage] = useState('')
  const { mutateAsync: initModel } = useMutation(trpc.llm.initialize.mutationOptions())
  const { mutateAsync: downloadModel } = useMutation(trpc.llm.downloadModel.mutationOptions())
  const { data: progress } = useSubscription(trpc.llm.getDownloadProgress.subscriptionOptions())
  const { mutateAsync: invokeModel } = useMutation(trpc.llm.invoke.mutationOptions())

  const onDownloadModel = () => downloadModel().then(() => setModelStatus('downloading'))
  const onInitModel = () => initModel().then(() => setModelStatus('initialized'))
  const onInvokeModel = (question: string) =>
    invokeModel({ question }).then((result) => setMessage(result))

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
      <Button variant="default" onClick={onDownloadModel}>
        Download File
      </Button>
      <Button variant="default" onClick={onInitModel}>
        Initialize Model
      </Button>
      <Button variant="default" onClick={() => onInvokeModel('너는 한국어를 잘 하니?')}>
        Invoke Model
      </Button>
    </div>
  )
}
