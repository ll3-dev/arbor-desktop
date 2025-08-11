import { ChatLlamaCpp } from '@langchain/community/chat_models/llama_cpp'
import { AIMessageChunk } from '@langchain/core/messages'
import { getValue, setValue } from '@main/database/KeyValue'
import { app, BrowserWindow, DownloadItem } from 'electron'
import { download, Progress } from 'electron-dl'

const LLM_MODEL_DOWNLOADED_KEY = 'llmModelDownloaded'
const llmPath = app.getPath('appData') + '/llm/gemma-3n-E2B-it-UD-Q4_K_XL.gguf'
const url =
  'https://huggingface.co/unsloth/gemma-3n-E2B-it-GGUF/resolve/main/gemma-3n-E2B-it-UD-Q4_K_XL.gguf?download=true'

class LLM {
  model: ChatLlamaCpp | null = null

  async initialize() {
    if (this.model) {
      console.warn('LLM is already initialized.')
      return
    }
    const isModelDownloaded = (await getValue(LLM_MODEL_DOWNLOADED_KEY)) === 'true'
    if (!isModelDownloaded) {
      throw new Error('LLM model not downloaded. Please download the model first.')
    }

    this.model = await ChatLlamaCpp.initialize({
      modelPath: llmPath
    }).catch((error) => {
      console.error('Failed to initialize LLM:', error)
      throw new Error('LLM initialization failed')
    })
  }

  invoke(question: string): ReturnType<ChatLlamaCpp['invoke']> {
    if (!this.model) {
      throw new Error('Model not initialized. Call initialize() first.')
    }
    return this.model.invoke(question)
  }

  async stream(question: string, onStream?: (chunk: AIMessageChunk) => void) {
    if (!this.model) {
      throw new Error('Model not initialized. Call initialize() first.')
    }

    const stream = await this.model.stream(question).catch((error) => {
      console.error('Failed to stream LLM:', error)
      throw new Error('LLM streaming failed')
    })

    for await (const chunk of stream) {
      onStream?.(chunk)
    }
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
      directory: llmPath.replace(/\/[^/]+$/, ''),
      filename: llmPath.split('/').pop(),
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
