import { LlamaCpp } from '@langchain/community/llms/llama_cpp'
import { getValue, setValue } from '@main/database/KeyValue'
import { app, BrowserWindow, DownloadItem } from 'electron'
import { download, Progress } from 'electron-dl'

const LLM_MODEL_DOWNLOADED_KEY = 'llmModelDownloaded'
const llamaPath = app.getPath('appData') + '/llm/gguf-llama3-Q4_0.bin'
const url =
  'https://huggingface.co/unsloth/gemma-3n-E2B-it-GGUF/resolve/main/gemma-3n-E2B-it-UD-Q4_K_XL.gguf?download=true'

class LLM {
  model: LlamaCpp | null = null

  async initialize() {
    if (this.model) {
      console.warn('LLM is already initialized.')
      return
    }
    const isModelDownloaded = (await getValue(LLM_MODEL_DOWNLOADED_KEY)) === 'true'
    if (!isModelDownloaded) {
      throw new Error('LLM model not downloaded. Please download the model first.')
    }

    this.model = await LlamaCpp.initialize({ modelPath: llamaPath }).catch((error) => {
      console.error('Failed to initialize LLM:', error)
      throw new Error('LLM initialization failed')
    })
  }

  async invoke(question: string): Promise<string> {
    if (!this.model) {
      throw new Error('Model not initialized. Call initialize() first.')
    }
    return await this.model.invoke(question)
  }

  // TODO: after add downalod resumability
  async downloadModel(
    onProgress?: (progress: Progress) => void
  ): Promise<DownloadItem | undefined> {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) {
      throw new Error('No focused window found to download the model.')
    }

    return await download(win, url, {
      directory: llamaPath.replace(/\/[^/]+$/, ''),
      filename: llamaPath.split('/').pop(),
      onProgress
    })
      .then((downloadItem) => {
        console.info('Download completed:', downloadItem?.getSavePath())
        setValue(LLM_MODEL_DOWNLOADED_KEY, 'true')
        return downloadItem
      })
      .catch((error) => {
        if (error instanceof Error && error.name === 'CancelError') {
          console.info('Download was cancelled')
          return undefined
        }
        console.error('Download failed:', error)
        throw error
      })
  }
}

export const llm = new LLM()
