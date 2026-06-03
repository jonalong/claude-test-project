const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {setGlobalOptions} = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk").default;

setGlobalOptions({maxInstances: 10});

const anthropicApiKey = defineSecret("ANTHROPIC_API_KEY");

const TONE_PROMPT = {
  "정중": "매우 정중하고 격식 있게",
  "부드럽게": "부드럽고 따뜻하게",
  "단호+예의": "단호하지만 예의 바르게",
  "짧게": "핵심만 간결하고 짧게",
};

const CONTEXT_PROMPT = {
  "직장 상사": "직장 상사에게 보내는 메시지로 적합하게",
  "직장 동료": "직장 동료에게 보내는 메시지로 적합하게",
  "외부 고객": "외부 고객에게 보내는 비즈니스 메시지로 적합하게",
  "기타": "",
};

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.post("/api/purify", async (req, res) => {
  const {text, tone = "정중", context = "기타"} = req.body;

  if (!text?.trim()) {
    return res.status(400).json({error: "텍스트를 입력해주세요."});
  }

  const toneDesc = TONE_PROMPT[tone] ?? "정중하게";
  const contextDesc = CONTEXT_PROMPT[context] ?? "";

  const systemPrompt = [
    "당신은 사용자가 상대방에게 보낼 메시지를 정중하고 건설적으로 다듬어주는 어시스턴트입니다.",
    "중요: 사용자가 직접 상대방에게 보내는 메시지를 작성하는 것입니다. 사용자가 발신자이고 상대방이 수신자입니다.",
    "규칙:",
    "1. 비속어·인신공격·비하 표현을 모두 제거한다.",
    "2. 원문의 핵심 의도와 요청 사항은 그대로 유지한다. (예: '왜 연락이 안되냐' → 상대방에게 연락을 요청하는 메시지로 변환)",
    "3. 명령·질책을 정중한 요청과 사실 기반 피드백으로 바꾼다.",
    `4. ${toneDesc} 어투를 사용한다.`,
    contextDesc ? `5. ${contextDesc}.` : "",
    "6. 한국어 비즈니스 매너에 맞는 자연스러운 어투를 사용한다.",
    "7. 결과 문장만 출력하고, 부연 설명은 하지 않는다.",
  ].filter(Boolean).join("\n");

  try {
    const anthropic = new Anthropic({apiKey: anthropicApiKey.value()});
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{role: "user", content: text}],
    });

    res.json({result: message.content[0].text});
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({error: "변환에 실패했습니다."});
  }
});

exports.api = onRequest({secrets: [anthropicApiKey], invoker: "public"}, app);
