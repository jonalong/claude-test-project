import { useState, useEffect, useRef } from 'react'
import logoText from './assets/logo-text.svg'
import logoIcon from './assets/logo-icon.svg'
import icCopy from './assets/ic-copy.svg'

const TONES = ['정중하게', '부드럽게', '단호+예의', '애교', '유머러스', '담백하게', '다정하게', '프로페셔널']
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

export default function App() {
  const [step, setStep] = useState('input') // 'input' | 'tone' | 'loading' | 'result'
  const [text, setText] = useState('')
  const [tone, setTone] = useState('정중하게')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const ctaRef = useRef(null)

  // visualViewport 직접 DOM 조작 — React re-render 없이 transform으로 GPU 합성
  useEffect(() => {
    const el = ctaRef.current
    const vv = window.visualViewport
    if (!el || !vv) return

    function update() {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      el.style.transform = `translateY(-${kb}px)`
    }

    vv.addEventListener('resize', update, { passive: true })
    vv.addEventListener('scroll', update, { passive: true })
    update()

    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [step]) // step 변경 시 새 DOM 엘리먼트에 재바인딩

  async function handleSubmit() {
    if (!text.trim()) return
    setStep('loading')
    setError('')

    try {
      const res = await fetch('/api/purify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '오류가 발생했습니다.')
      setResult({ ...data, originalText: text, tone })
      setStep('result')
    } catch (err) {
      setError(err.message || '변환에 실패했습니다.')
      setStep('tone')
    }
  }

  async function handleCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.refined)
    } catch {
      const el = document.createElement('textarea')
      el.value = result.refined
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function handleReset() {
    setResult(null)
    setError('')
    setText('')
    setTone('정중하게')
    setCopied(false)
    setStep('input')
  }

  // ── 1단계: 분출 입력 ──────────────────────────────
  if (step === 'input') {
    return (
      <div className="h-[100dvh] bg-white flex flex-col max-w-[375px] mx-auto">
        <AppBar showTooltip={showTooltip} onToggleTooltip={setShowTooltip} />

        <div className="flex-1 flex flex-col gap-11 pt-6 pb-24 px-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[26px] font-semibold leading-[34px] text-[#121212]">
              분노의 말을<br />여기에 다 쏟아내세요
            </h3>
            <p className="text-[12px] font-medium leading-[16px] text-[#797d86]">
              검열하지 말고 막 적으시면 정중하게 바꿔드릴게요
            </p>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <p className="text-[13px] font-semibold leading-[18px] text-[#414752]">원문 입력</p>
            <div className="border border-[#e3e4e6] rounded-xl p-4 flex flex-col justify-between min-h-[300px] focus-within:border-[#ff3967] transition-colors">
              <textarea
                className="flex-1 w-full resize-none outline-none text-[16px] leading-[23px] text-[#121212] placeholder-[#b5b8bc] bg-transparent"
                placeholder="예시) 일정도 똑바로 못 맞추냐? 덜떨어진 놈아 다시 해와"
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                rows={10}
              />
              <p className="text-right text-[12px] text-[#b5b8bc] mt-2 shrink-0">
                {text.length} / {MAX_CHARS}
              </p>
            </div>
          </div>
        </div>

        <div ref={ctaRef} className="fixed bottom-0 left-0 right-0 flex justify-center bg-white z-10" style={{ willChange: 'transform' }}>
          <div className="w-full max-w-[375px] px-5 pb-5 pt-3">
            <button
              onClick={() => text.trim() && setStep('tone')}
              className={`w-full h-12 rounded-xl text-[16px] font-semibold transition-colors ${
                text.trim() ? 'bg-[#ff3967] text-white active:bg-[#ef1447]' : 'bg-[#e3e4e6] text-[#b5b8bc]'
              }`}
            >
              다음 단계
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── 2단계: 말투 선택 ──────────────────────────────
  if (step === 'tone') {
    return (
      <div className="h-[100dvh] bg-white flex flex-col max-w-[375px] mx-auto">
        <AppBar showTooltip={showTooltip} onToggleTooltip={setShowTooltip} />

        <div className="flex-1 flex flex-col gap-[52px] pt-6 pb-24 px-5 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[26px] font-semibold leading-[34px] text-[#121212]">
              어떤 스타일로<br />다듬어 드릴까요?
            </h3>
            <p className="text-[12px] font-medium leading-[16px] text-[#797d86]">
              원하는 스타일로 문장을 다듬어 드릴게요
            </p>
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-1.5">
            {TONES.map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`h-10 px-[18px] rounded-[40px] text-[14px] font-medium leading-[16px] transition-colors ${
                  tone === t
                    ? 'bg-[#121212] text-[#f8f8f9]'
                    : 'border border-[#e3e4e6] text-[#5a6169] bg-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {error && <p className="text-[13px] text-[#ff3967]">{error}</p>}
        </div>

        <div ref={ctaRef} className="fixed bottom-0 left-0 right-0 flex justify-center bg-white z-10" style={{ willChange: 'transform' }}>
          <div className="w-full max-w-[375px] px-5 pb-5 pt-3 flex gap-2">
            <button
              onClick={() => setStep('input')}
              className="h-12 px-6 border border-[#ff3967] rounded-xl text-[16px] font-semibold text-[#ff3967] transition-colors active:bg-[#fff0f3] shrink-0"
            >
              뒤로가기
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 h-12 bg-[#ff3967] rounded-xl text-white text-[16px] font-semibold active:bg-[#ef1447] transition-colors"
            >
              순화하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── 3단계: 로딩 ──────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="h-[100dvh] bg-white flex flex-col max-w-[375px] mx-auto">
        <AppBar showTooltip={showTooltip} onToggleTooltip={setShowTooltip} />
        <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-20 px-5">
          <img
            src={logoIcon}
            alt=""
            className="size-[68px] animate-[pulse_1.2s_ease-in-out_infinite]"
          />
          <div className="flex flex-col items-center gap-1.5">
            <h3 className="text-[26px] font-semibold leading-[34px] text-[#121212] text-center">
              잠시만 쉼호흡 하고 계시면<br />변환해 드릴게요
            </h3>
            <p className="text-[13px] leading-[18px] text-[#797d86]">
              보통 30초 이내에 완료돼요
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── 4단계: 결과 ──────────────────────────────────
  if (step === 'result' && result) {
    const scoreBefore = result.scoreBefore ?? 50
    const scoreAfter = result.scoreAfter ?? 10
    const level = result.level ?? ''
    const comment = result.comment ?? ''

    return (
      <div className="h-[100dvh] bg-white flex flex-col max-w-[375px] mx-auto relative">
        <AppBar showTooltip={showTooltip} onToggleTooltip={setShowTooltip} />

        <div className="flex-1 flex flex-col gap-7 pt-6 pb-24 px-5 overflow-y-auto">

          {/* 헤딩 + 분노 게이지 카드 */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[26px] font-semibold leading-[34px] text-[#121212]">
              {level} 분노를 진정시켜 봤어요
            </h3>

            <div className="bg-[#121212] rounded-2xl px-5 pt-5 pb-6 flex flex-col gap-3">
              <div className="flex flex-col">
                <p className="text-[10px] font-semibold leading-[14px] text-[#ffc7d4]">
                  🔥 {level}
                </p>
                <p className="text-[18px] font-semibold leading-[26px] text-[#f8f8f9]">
                  분노 게이지
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {/* 원문 게이지 */}
                <div className="flex items-center gap-2.5 h-4">
                  <div className="w-[34px]">
                    <span className="text-[12px] font-semibold leading-[16px] text-[#ff6488]">원문</span>
                  </div>
                  <div className="flex-1 h-2 bg-[#414752] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 delay-100"
                      style={{
                        width: `${scoreBefore}%`,
                        background: 'linear-gradient(90deg, #ff88a4, #ff3967)',
                      }}
                    />
                  </div>
                  <div className="w-7 flex justify-end">
                    <span className="text-[13px] font-semibold text-[#ff6488]">{scoreBefore}</span>
                  </div>
                </div>

                {/* 순화 게이지 */}
                <div className="flex items-center gap-2.5 h-4">
                  <div className="w-[34px]">
                    <span className="text-[12px] font-semibold leading-[16px] text-[#06d2ee]">순화</span>
                  </div>
                  <div className="flex-1 h-2 bg-[#414752] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 delay-300"
                      style={{
                        width: `${Math.max(scoreAfter, scoreAfter > 0 ? 2 : 0)}%`,
                        background: 'linear-gradient(90deg, #83f0ff, #06d2ee)',
                      }}
                    />
                  </div>
                  <div className="w-7 flex justify-end">
                    <span className="text-[13px] font-semibold text-[#06d2ee]">{scoreAfter}</span>
                  </div>
                </div>

                <p className="text-[10px] leading-[14px] text-[#b5b8bc]">{comment}</p>
              </div>
            </div>
          </div>

          {/* 결과 카드 + 복사 버튼 */}
          <div className="flex flex-col gap-[10px]">
            <div className="border border-[#e3e4e6] rounded-xl px-4 py-6 flex flex-col gap-6">
              <p className="text-[18px] font-medium leading-[26px] text-[#121212] whitespace-pre-wrap">
                {result.refined}
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-[12px] font-semibold leading-[16px] text-[#797d86]">쏟아낸 원문</p>
                <p className="text-[14px] leading-[16px] text-[#b5b8bc]">{result.originalText}</p>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="border border-[#ffc7d4] rounded-xl py-3.5 flex items-center justify-center gap-1.5 w-full transition-opacity active:opacity-70"
            >
              <img src={icCopy} alt="" className="size-4" />
              <span className="text-[14px] font-semibold leading-[16px] text-[#ff3967]">
                {copied ? '복사완료' : '복사하기'}
              </span>
            </button>
          </div>
        </div>

        {/* 복사 토스트 */}
        <div className={`absolute bottom-[88px] left-1/2 -translate-x-1/2 bg-[#121212] text-white text-[14px] font-medium px-4 py-3 rounded-lg whitespace-nowrap pointer-events-none transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
          ✓　클립보드에 복사되었습니다
        </div>

        <div ref={ctaRef} className="fixed bottom-0 left-0 right-0 flex justify-center bg-white z-10" style={{ willChange: 'transform' }}>
          <div className="w-full max-w-[375px] px-5 pb-5 pt-3">
            <button
              onClick={handleReset}
              className="w-full h-12 bg-[#ff3967] text-white text-[16px] font-semibold rounded-xl active:bg-[#ef1447] transition-colors"
            >
              다시하기
            </button>
          </div>
        </div>
      </div>
    )
  }
}
