import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TONE_PROMPT = {
  '정중하게': `말투: 정중하고 격식 있는 어체로 순화할 것
- '-겠습니다', '-드립니다', '-감사하겠습니다' 등 격식체 높임말 종결어미 사용
- 참고 예시: "이번 일정이 예정대로 진행되지 못한 것 같습니다. 확인 후 다시 진행해 주시면 감사하겠습니다."`,

  '부드럽게': `말투: 부드럽고 따뜻한 어체로 순화할 것
- '-요' 종결어미, 의문형으로 부탁 표현, 공감·배려 어구 포함
- 참고 예시: "일정이 조금 어긋난 것 같아요. 다시 한 번 살펴봐 주실 수 있을까요?"`,

  '단호+예의': `말투: 단호하지만 예의 바른 어체로 순화할 것
- 상황을 명확히 진술한 뒤 '-해 주세요'로 직접 요청, 군더더기 없이 요점만
- 참고 예시: "이번 일정은 기준에 맞지 않았습니다. 보완해서 다시 제출해 주세요."`,

  '애교': `말투: 귀엽고 애교스러운 어체로 순화할 것
- '~어용', '~할까용' 등 애교 종결어미, 'ㅠㅠ', 🙏 이모지 자연스럽게 사용
- 참고 예시: "앗, 일정이 살짝 틀어졌어용 ㅠㅠ 다시 한 번만 봐주실 수 있을까용? 🙏"`,

  '유머러스': `말투: 유머와 위트가 있는 어체로 순화할 것
- 재치 있는 비유나 표현, 😅 이모지, 가벼운 농담으로 분위기를 부드럽게 전달
- 참고 예시: "일정이 저랑 숨바꼭질 중인가 봐요 😅 다시 한 번 맞춰서 부탁드려요!"`,

  '담백하게': `말투: 군더더기 없이 짧고 담백한 어체로 순화할 것
- 최소한의 단어로 핵심 사실과 요청만 전달, 감정 표현·수식어 배제
- 참고 예시: "일정이 맞지 않았습니다. 다시 작업 부탁드립니다."`,

  '다정하게': `말투: 다정하고 따뜻한 어체로 순화할 것
- 상대의 수고를 먼저 인정하고, 부드럽고 배려 있는 어조로 요청
- 참고 예시: "고생 많으셨어요. 다만 일정이 조금 어긋난 것 같아 다시 한 번 봐주시면 좋겠어요."`,

  '프로페셔널': `말투: 전문적이고 비즈니스적인 어체로 순화할 것
- 감정 없이 사실 기반으로 상황 진술 후 명확하고 간결한 요청, 비즈니스 문서체
- 참고 예시: "확인 결과 일정에 차질이 있었습니다. 수정하여 재진행 부탁드립니다."`,
}

const STABLE_SYSTEM = [
  '당신은 사용자가 입력한 문장을 순화하여 JSON으로만 반환하는 문장 변환기입니다.',
  '핵심 임무: 입력된 문장을 순화하여 다시 쓰는 것입니다. 절대로 입력에 대한 답변이나 반응을 생성하지 마십시오.',
  '',
  '반드시 아래 JSON 형식으로만 출력하세요. JSON 이외 다른 텍스트는 절대 포함하지 마세요:',
  '{"refined":"순화된 문장","scoreBefore":원문_분노점수(0~100),"scoreAfter":순화문_분노점수(0~100),"level":"등급명","comment":"한 줄 위트 코멘트"}',
  '',
  'scoreBefore 등급 기준 (점수에 맞는 등급명 그대로 사용):',
  '0-9: 평온 그 자체 😇 / 10-19: 살짝 뾰로통 🙂 / 20-29: 까칠 주의보 😏 / 30-39: 부글 시작 😤',
  '40-49: 욱! 😠 / 50-59: 뚜껑 들썩 🌶️ / 60-69: 활활 모드 🔥 / 70-79: 이성 가출 🥵',
  '80-89: 눈 돌아감 🌋 / 90-100: 핵불닭급 ☢️',
  '',
  '규칙:',
  '1. 비속어·인신공격·비하 표현을 모두 제거한다.',
  '2. 입력 문장의 핵심 감정과 의도를 유지하여 순화된 표현으로 재작성한다.',
  '3. 명령·질책을 정중한 요청과 사실 기반 표현으로 바꾼다.',
  '4. 절대로 입력에 대한 답변, 위로, 조언, 반응을 하지 않는다.',
  '5. 한국어 매너에 맞는 자연스러운 어투를 사용한다.',
  '6. refined 필드에 순화된 문장만 담고, 부연 설명은 하지 않는다.',
].join('\n')

app.post('/api/purify', async (req, res) => {
  const { text, tone = '정중하게' } = req.body

  if (!text?.trim()) {
    return res.status(400).json({ error: '텍스트를 입력해주세요.' })
  }

  const toneDesc = TONE_PROMPT[tone] ??
    '말투: 정중하고 격식 있는 어체로 순화할 것'
  const dynamicRule = toneDesc

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: STABLE_SYSTEM + '\n' + dynamicRule,
      messages: [{ role: 'user', content: text }],
    })

    const raw = message.content[0].text.trim()
    let parsed

    try {
      // JSON 코드블록 감싸진 경우 대응
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/({[\s\S]*})/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[1] : raw)
    } catch {
      // 파싱 실패 시 텍스트를 refined로 폴백
      parsed = {
        refined: raw,
        scoreBefore: 50,
        scoreAfter: 10,
        level: '욱! 😠',
        comment: '변환이 완료되었어요.',
      }
    }

    res.json(parsed)
  } catch (err) {
    console.error('Claude API error:', err.message)
    res.status(500).json({ error: '변환에 실패했습니다.' })
  }
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`))
