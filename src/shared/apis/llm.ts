import { publicProcedure, router } from '@main/actions/trpc'
import { z } from 'zod'
import { llm } from '@main/actions/llm'
import EventEmitter, { on } from 'events'
import { Progress } from 'electron-dl'
import { AIMessageChunk } from '@langchain/core/messages'

const ee = new EventEmitter()
const downloadProgress = 'downloadProgress'
const messageStream = 'messageStream'

export const llmRouter = router({
  initialize: publicProcedure.mutation(async () => {
    return llm.initialize()
  }),
  invoke: publicProcedure.input(z.object({ question: z.string() })).mutation(async ({ input }) => {
    return llm.invoke(input.question)
  }),
  stream: publicProcedure.input(z.object({ question: z.string() })).mutation(({ input }) => {
    llm.stream(input.question, (chunk) => {
      console.log('stream chunk', chunk)
      ee.emit(messageStream, chunk)
    })
  }),
  downloadModel: publicProcedure.mutation(() => {
    llm.downloadModel((progress) => {
      ee.emit(downloadProgress, progress)
    })
  }),
  getDownloadProgress: publicProcedure.subscription(async function* (opt) {
    for await (const [data] of on(ee, downloadProgress, { signal: opt.signal })) {
      yield data as Progress
    }
  }),
  getMessageStream: publicProcedure.subscription(async function* (opt) {
    for await (const [data] of on(ee, messageStream, { signal: opt.signal })) {
      yield data as AIMessageChunk
    }
  })
})
