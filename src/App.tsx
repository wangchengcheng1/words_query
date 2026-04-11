import { useEffect, useRef, useState } from 'react'
import './App.css'

const buildPrompt = (word: string) =>
  `What's the etymology of the word ${word}? What's the other words having same etymology with word ${word}? Do native speakers always use them or not?`

const emptyStateText =
  "Type a word above and we'll build the full question for your AI assistant."

function App() {
  const [word, setWord] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timeoutRef = useRef<number | null>(null)

  const sanitizedWord = word.trim()
  const hasWord = sanitizedWord.length > 0
  const questionText = buildPrompt(sanitizedWord)
  const promptText = hasWord ? questionText : emptyStateText

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    if (!hasWord) {
      return
    }

    setCopyError(null)
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(questionText)
      } else if (textareaRef.current) {
        textareaRef.current.select()
        document.execCommand('copy')
      }

      setCopied(true)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed', error)
      setCopied(false)
      setCopyError('Copy failed. Please copy the text manually.')
    }
  }

  return (
    <main className="app">
      <section className="panel">
        <header>
          <p className="eyebrow">Words query</p>
          <h1>Generate your etymology prompt</h1>
          <p className="description">
            Enter a word, then copy the full question below instead of typing it every time.
          </p>
        </header>

        <label className="field">
          <span>Word</span>
          <input
            type="text"
            value={word}
            onChange={(event) => setWord(event.target.value)}
            placeholder="ecstatic"
            aria-label="Word you want to research"
            autoFocus
          />
        </label>

        <div className="prompt-block">
          <div className="prompt-header">
            <span>Question to copy</span>
            {copied && <span className="status success">Copied!</span>}
            {copyError && <span className="status error">{copyError}</span>}
          </div>
          <textarea
            ref={textareaRef}
            value={promptText}
            readOnly
            rows={5}
            aria-live="polite"
          />
          <button type="button" onClick={handleCopy} disabled={!hasWord}>
            Copy text
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
