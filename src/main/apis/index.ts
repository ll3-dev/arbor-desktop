import { router } from '../actions/trpc'
import { keyValueRouter } from './keyValue'

export const appRouter = router({
  kv: keyValueRouter
})
