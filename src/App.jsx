import { useState } from 'react'

const TONES = ['정중하게', '부드럽게', '단호+예의', '명랑']
const CONTEXTS = ['직장상사', '직장동료', '외부고객', '기타']

export default function App() {
  const [text, setText] = useState('')
  const [tone, setTone] = useState('정중하게')
  const [context, setContext] = useState('기타')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setResult('')
    setError('')

    try {
      const res = await fetch('/api/purify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone, context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.result)
    } catch (err) {
      setError(err.message || '변환에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      {/* 헤더 */}
      <header className="w-full max-w-[390px] mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-semibold text-[#ff3967] tracking-tight">🐻 Cotton Bat</span>
        </div>
        <p className="text-sm text-[#797d86]">거친 말을 부드럽게 순화해 드려요</p>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-[390px] flex flex-col gap-5">
        {/* 원문 입력 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#121212]">원문</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="순화할 메시지를 입력하세요"
            rows={5}
            className="w-full rounded-lg border border-[#e3e4e6] bg-white px-4 py-3 text-[15px] text-[#121212] placeholder:text-[#b5b8bc] resize-none focus:outline-none focus:border-[#ff3967] transition-colors"
          />
        </div>

        {/* 어투 선택 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#121212]">어투</label>
          <div className="flex gap-2 flex-wrap">
            {TONES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  tone === t
                    ? 'bg-[#ff3967] text-white'
                    : 'bg-white border border-[#e3e4e6] text-[#5a6169] hover:border-[#ff3967]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 대상 선택 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#121212]">대상</label>
          <div className="flex gap-2 flex-wrap">
            {CONTEXTS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setContext(c)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  context === c
                    ? 'bg-[#121212] text-white'
                    : 'bg-white border border-[#e3e4e6] text-[#5a6169] hover:border-[#121212]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 변환 버튼 */}
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full py-3.5 rounded-lg bg-[#ff3967] text-white text-[16px] font-medium disabled:opacity-40 disabled:cursor-not-allowed active:bg-[#ef1447] transition-colors"
        >
          {loading ? '변환 중…' : '순화하기'}
        </button>
      </form>

      {/* 결과 */}
      {(result || error) && (
        <div className="w-full max-w-[390px] mt-6 animate-fade-in">
          {error ? (
            <div className="rounded-lg bg-[#ffeaef] border border-[#ffc7d4] px-4 py-3 text-[14px] text-[#c7002e]">
              {error}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#121212]">순화된 메시지</span>
                <button
                  onClick={handleCopy}
                  className="text-[12px] text-[#797d86] hover:text-[#ff3967] transition-colors"
                >
                  {copied ? '복사됨 ✓' : '복사하기'}
                </button>
              </div>
              <div className="rounded-lg bg-white border border-[#e3e4e6] px-4 py-3 text-[15px] text-[#121212] leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}
        </div>
      )}

      <footer className="mt-auto pt-12 text-[11px] text-[#b5b8bc]">
        Powered by Claude
      </footer>
    </div>
  )
}
