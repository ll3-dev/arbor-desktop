import { publicProcedure, router } from '@main/actions/trpc'
import { z } from 'zod'
import { llm } from '@main/actions/llm'
import EventEmitter, { on } from 'events'
import { Progress } from 'electron-dl'

const ee = new EventEmitter()

export const llmRouter = router({
  initialize: publicProcedure.mutation(async () => {
    return llm.initialize()
  }),
  invoke: publicProcedure.input(z.object({ question: z.string() })).mutation(async ({ input }) => {
    return llm.invoke(input.question)
  }),
  downloadModel: publicProcedure.mutation(async () => {
    return llm.downloadModel((progress) => {
      ee.emit('downloadProgress', progress)
    })
  }),
  getDownloadProgress: publicProcedure.subscription(async function* (opt) {
    for await (const [data] of on(ee, 'downloadProgress', { signal: opt.signal })) {
      yield data as Progress
    }
  })
})
