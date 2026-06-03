import { useState, useEffect, useRef } from 'react'
import logoText from './assets/logo-text.svg'
import logoIcon from './assets/logo-icon.svg'
import icCopy from './assets/ic-copy.svg'

const TONES = ['정중', '부드럽게', '단호+예의', '짧게']
const CONTEXTS = ['직장 상사', '직장 동료', '외부 고객', '기타']
const CONTEXT_SUFFIX = {
  '직장 상사': '상사에게',
  '직장 동료': '동료에게',
  '외부 고객': '고객에게',
  '기타': null,
}
const MAX_CHARS = 500
const TOOLTIP_TEXT = '해당 프로젝트는 조나롱이 클로드와 함께 테스트로 진행해 보았으며, 킹받는 모든 직장인을 위로하는 마음으로 제작되었습니다'

function AppBar({ showTooltip, onToggleTooltip }) {
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (!showTooltip) return
    function handleOutside(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        onToggleTooltip(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [showTooltip, onToggleTooltip])

  return (
    <header className="h-14 flex items-center justify-between px-4 shrink-0 relative">
      <div className="relative h-7 w-[162px]">
        <img alt="" src={logoIcon} className="absolute size-[22.7px] top-[2.3px] left-[3.5px]" />
        <img alt="Cotton Bat" src={logoText} className="absolute h-[19.8px] w-[129.6px] top-[3.7px] left-[29.9px]" />
      </div>
      <div className="relative" ref={tooltipRef}>
        <button
          type="button"
          onClick={() => onToggleTooltip(!showTooltip)}
          className="size-6 flex items-center justify-center text-[#414752] text-[18px]"
        >
          ⓘ
        </button>
        {showTooltip && (
          <div className="absolute right-0 top-8 w-[260px] bg-[#2d333b] text-white text-[12px] leading-[18px] rounded-xl px-4 py-3 z-10 shadow-lg">
            {TOOLTIP_TEXT}
          </div>
        )}
      </div>
    </header>
  )
}

function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 px-3.5 rounded-xl text-[14px] font-medium leading-[16px] transition-colors border ${
        selected
          ? 'bg-[#ffeaef] border-[#ffc7d4] text-[#ef1447]'
          : 'bg-white border-[#e3e4e6] text-[#5a6169]'
      }`}
    >
      {label}
    </button>
  )
}

export default function App() {
  const [text, setText] = useState('')
  const [tone, setTone] = useState('정중')
  const [context, setContext] = useState('직장 상사')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  async function handleSubmit(e) {
    if (e) e.preventDefault()
    if (!text.trim() || loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/purify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone, context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult({ text: data.result, originalText: text, tone, context })
    } catch (err) {
      setError(err.message || '변환에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit()
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function handleReset() {
    setResult(null)
    setError('')
    setText('')
    setCopied(false)
  }

  // 결과 화면
  if (result) {
    const suffix = CONTEXT_SUFFIX[result.context]
    const resultLabel = [result.tone, suffix].filter(Boolean).join(' · ')

    return (
      <div className="min-h-screen bg-white flex flex-col max-w-[375px] mx-auto">
        <AppBar showTooltip={showTooltip} onToggleTooltip={setShowTooltip} />

        <div className="flex-1 flex flex-col gap-9 p-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[26px] font-semibold leading-[34px] text-[#121212]">
              적어준 말을 곱게<br />다듬어 봤어요
            </h3>
            <p className="text-[12px] font-medium leading-[16px] text-[#797d86]">
              복사하기 버튼을 눌러 바로 보내보세요
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold leading-[18px] text-[#414752]">원문</p>
            <div className="bg-[#f8f8f9] border border-[#efeff1] rounded-xl px-4 py-5">
              <p className="text-[16px] leading-[23px] text-[#b5b8bc] whitespace-pre-wrap">{result.originalText}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <p className="text-[10px] font-semibold leading-[14px] text-[#ff3967]">{resultLabel}</p>
              <p className="text-[13px] font-semibold leading-[18px] text-[#414752]">순화된 문장</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-white border border-[#d1d4d8] rounded-xl px-4 py-5">
                <p className="text-[16px] font-medium leading-[23px] text-[#121212] whitespace-pre-wrap">{result.text}</p>
              </div>
              <button
                onClick={handleCopy}
                className="border border-[#ff3967] rounded-xl py-3.5 flex items-center justify-center gap-1.5 w-full transition-opacity active:opacity-70"
              >
                <img src={icCopy} alt="" className="size-4" />
                <span className="text-[14px] font-semibold leading-[16px] text-[#ff3967]">
                  {copied ? '복사됨 ✓' : '복사하기'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 pt-3 shrink-0">
          <button
            onClick={handleReset}
            className="w-full h-12 bg-[#ff3967] text-white text-[16px] font-semibold rounded-lg active:bg-[#ef1447] transition-colors"
          >
            다시하기
          </button>
        </div>
      </div>
    )
  }

  // 입력 화면
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[375px] mx-auto">
      <AppBar showTooltip={showTooltip} onToggleTooltip={setShowTooltip} />

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-9 p-5 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[26px] font-semibold leading-[34px] text-[#121212]">
            어떤 말을<br />다듬어 드릴까요?
          </h3>
          <p className="text-[12px] font-medium leading-[16px] text-[#797d86]">
            거친 문장을 정중하고 건설적인 표현으로 바꿔드려요.
          </p>
        </div>

        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold leading-[18px] text-[#414752]">톤 강도</p>
            <div className="flex gap-1 flex-wrap">
              {TONES.map(t => (
                <Chip key={t} label={t} selected={tone === t} onClick={() => setTone(t)} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold leading-[18px] text-[#414752]">상황 프리셋</p>
            <div className="flex gap-1 flex-wrap">
              {CONTEXTS.map(c => (
                <Chip key={c} label={c} selected={context === c} onClick={() => setContext(c)} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold leading-[18px] text-[#414752]">원문 입력</p>
            <div className="border border-[#e3e4e6] rounded-xl h-[180px] p-4 flex flex-col gap-2 focus-within:border-[#ff3967] transition-colors">
              <textarea
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                onKeyDown={handleKeyDown}
                placeholder="예시) 일정도 똑바로 못 맞추냐? 덜떨어진 놈아 다시 해와"
                className="flex-1 resize-none text-[16px] leading-[23px] text-[#121212] placeholder:text-[#b5b8bc] bg-transparent focus:outline-none w-full"
              />
              <p className="text-[12px] text-[#b5b8bc] text-right shrink-0">{text.length} / {MAX_CHARS}</p>
            </div>
            {error && (
              <p className="text-[13px] text-[#c7002e]">{error}</p>
            )}
          </div>
        </div>
      </form>

      <div className="px-5 pb-5 pt-3 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="w-full h-12 bg-[#ff3967] text-white text-[16px] font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed active:bg-[#ef1447] transition-colors"
        >
          {loading ? '변환 중…' : '순화하기'}
        </button>
      </div>
    </div>
  )
}
