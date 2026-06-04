const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {setGlobalOptions} = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk").default;

setGlobalOptions({maxInstances: 10});

const anthropicApiKey = defineSecret("ANTHROPIC_API_KEY");

const TONE_PROMPT = {
  "정중한 톤": "매우 정중하고 격식 있게",
  "부드럽게": "부드럽고 따뜻하게",
  "단호+예의": "단호하지만 예의 바르게",
  "간결하게": "핵심만 간결하고 짧게",
  "애교 톤": "귀엽고 애교스럽게",
  "이모지톤😊": "이모지를 적절히 사용하여 친근하게",
  "상사 보고체": "상사에게 보고하는 격식 있는 어체로",
  "다정한 선배체": "다정하고 따뜻한 선배처럼",
};

// 고정 시스템 프롬프트 (캐싱 대상)
const STABLE_SYSTEM_PROMPT = [
  "당신은 사용자가 입력한 문장을 순화하여 JSON으로만 반환하는 문장 변환기입니다.",
  "핵심 임무: 입력된 문장을 순화하여 다시 쓰는 것입니다. 절대로 입력에 대한 답변이나 반응을 생성하지 마십시오.",
  "",
  "반드시 아래 JSON 형식으로만 출력하세요. JSON 이외 다른 텍스트는 절대 포함하지 마세요:",
  // eslint-disable-next-line max-len
  "{\"refined\":\"순화된 문장\",\"scoreBefore\":원문점수(0~100),\"scoreAfter\":순화점수(0~100),\"level\":\"등급명\",\"comment\":\"위트 코멘트\"}",
  "",
  "scoreBefore 등급 기준 (점수에 맞는 등급명 그대로 사용):",
  "0-9: 평온 그 자체 😇 / 10-19: 살짝 뾰로통 🙂 / 20-29: 까칠 주의보 😏 / 30-39: 부글 시작 😤",
  "40-49: 욱! 😠 / 50-59: 뚜껑 들썩 🌶️ / 60-69: 활활 모드 🔥 / 70-79: 이성 가출 🥵",
  "80-89: 눈 돌아감 🌋 / 90-100: 핵불닭급 ☢️",
  "",
  "규칙:",
  "1. 비속어·인신공격·비하 표현을 모두 제거한다.",
  "2. 입력 문장의 핵심 감정과 의도를 유지하여 순화된 표현으로 재작성한다.",
  "3. 명령·질책을 정중한 요청과 사실 기반 표현으로 바꾼다.",
  "4. 절대로 입력에 대한 답변, 위로, 조언, 반응을 하지 않는다.",
  "5. 한국어 매너에 맞는 자연스러운 어투를 사용한다.",
  "6. refined 필드에 순화된 문장만 담고, 부연 설명은 하지 않는다.",
].join("\n");

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.post("/api/purify", async (req, res) => {
  const {text, tone = "정중한 톤"} = req.body;

  if (!text?.trim()) {
    return res.status(400).json({error: "텍스트를 입력해주세요."});
  }

  const toneDesc = TONE_PROMPT[tone] ?? "정중하고 격식 있게";
  const dynamicRule = `말투: ${toneDesc} 어투로 순화할 것`;

  try {
    const anthropic = new Anthropic({apiKey: anthropicApiKey.value()});
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: STABLE_SYSTEM_PROMPT,
          cache_control: {type: "ephemeral"},
        },
        {
          type: "text",
          text: dynamicRule,
        },
      ],
      messages: [{role: "user", content: text}],
    });

    const usage = message.usage;
    console.log(
        `[Cache] read=${usage.cache_read_input_tokens ?? 0}` +
        ` write=${usage.cache_creation_input_tokens ?? 0}` +
        ` input=${usage.input_tokens} output=${usage.output_tokens}`,
    );

    const raw = message.content[0].text.trim();
    let parsed;

    try {
      // eslint-disable-next-line max-len
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/({[\s\S]*})/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[1] : raw);
    } catch {
      parsed = {
        refined: raw,
        scoreBefore: 50,
        scoreAfter: 10,
        level: "욱! 😠",
        comment: "변환이 완료되었어요.",
      };
    }

    res.json(parsed);
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({error: "변환에 실패했습니다."});
  }
});

exports.api = onRequest({secrets: [anthropicApiKey], invoker: "public"}, app);
