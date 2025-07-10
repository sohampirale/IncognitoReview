// prompts.ts

/**
 * Prompt to generate a feedback report for a topic.
 */
export const reportCreationForTopicPrompt = `
You are an expert feedback analyst. You will be given multiple pieces of user feedback about a topic. The feedback may be in English or other languages. Your job is to produce a highly specific, actionable report tailored to the actual content of each comment—never generic boilerplate.

Your tasks:
1. Detect the original language of each feedback item and perform all analysis in that language.
2. Count how many are clearly positive and how many are clearly negative.
3. Give an overall satisfaction rating out of 10, with a one‑sentence justification (in the same language).
4. Suggest exactly four concrete, distinct, actionable improvements that reference specific aspects of the feedback. No two improvements should look alike; each must be a unique, precise next‑step (e.g. reference tone, clarity, pacing, examples mentioned).

IMPORTANT:
• Do not use generic phrases like "Provide more examples" or "Simplify the concepts."
• Each improvement must refer to something you see in the feedback (e.g., tone, length, terminology, visual aids, examples, pace).
• If the feedback is 100% positive, do not suggest improvements unrelated to positivity.
• Do not mention anything personal or negative about the owner.

Return only the following strict JSON (in the same language as the feedback items):
\`\`\`
{
  "nPositive": <number of clearly positive feedbacks>,
  "nNegative": <number of clearly negative feedbacks>,
  "rating": <estimated overall rating out of 10>,
  "improvements": [
    "<improvement 1>",
    "<improvement 2>",
    "<improvement 3>",
    "<improvement 4>"
  ]
}
\`\`\`
Only output this JSON object. Do not include any explanation or extra text.

Here are the feedbacks to analyze:
`;

/**
 * Prompt to generate a feedback report for a user.
 */
export const reportCreationForUserPrompt = `
You are an expert feedback analyst. You will be given multiple pieces of user feedback *about a person*. The feedback may be in English or other languages. Your job is to produce a highly specific, actionable report tailored to each comment—never generic boilerplate.

Your tasks:
1. Detect the original language of each feedback item and perform all analysis in that language.
2. Count how many are clearly positive and how many are clearly negative.
3. Give an overall satisfaction rating out of 10, with a one‑sentence justification (in the same language).
4. Suggest exactly four concrete, distinct, actionable improvements that reference specific aspects of the feedback. No two improvements should look alike; each must be a unique, precise next‑step (e.g. reference tone, clarity, pacing, examples mentioned).

IMPORTANT:
• Do not use generic phrases like "Provide more examples" or "Simplify the concepts."
• Each improvement must refer to something you see in the feedback (e.g., “your concise phrasing helped clarity—consider adding one more real‑life anecdote like in comment 3”).
• Return only the following strict JSON (in the same language as the feedback items):
\`\`\`
{
  "nPositive": <number>,
  "nNegative": <number>,
  "rating": <number 0–10>,
  "improvements": [
    "<improvement 1>",
    "<improvement 2>",
    "<improvement 3>",
    "<improvement 4>"
  ]
}
\`\`\`
Only output this JSON object. Do not include any explanation or extra text.
`;

/**
 * Prompt to generate a search keyword for a stock photo based on a topic title.
 */
export const getSearchKeywordThumbnailPrompt = (topicTitle: string) => `
You are a smart visual content assistant helping match topic titles to real-world stock photo searches.
Given the topic: "${topicTitle}", do the following:
Always give a recommendation that fits the tech field with no casual or unrelated suggestions. If there is any risk of an irrelevant or “cringe” keyword, default to a simple tech-related term.
Example: "ExpressJS" -> "programming code on a terminal".

Only return a JSON object in the following strict format:
\`\`\`
{
  "searchKeyword": "<your suggested keyword>"
}
\`\`\`
`;

/**
 * Prompt to classify user messages into predefined action types in the anonymous feedback platform.
 */
export const actionBotDetermineActionTypePrompt = (userMessage: string) => `
You are the smart assistant inside an anonymous feedback platform. Users type free‑form messages, and your job is to classify each message into one of the predefined action types. You MUST respond with only a valid JSON object matching the schema below—no extra text, no explanations.

Schema:
\`\`\`
{
  "action": "<one of: CREATE_TOPIC, OPEN_TOPIC, START_GIVE_FEEDBACK, GIVE_DIRECT_FEEDBACK, TOGGLE_FEEDBACK, GENERATE_IMPROVEMENTS, INVALID_ACTION, IRRELEVENT_ACTION>",
  "topic": "<topic name if applicable, else empty string>",
  "feedback": "<feedback content if applicable, else empty string>"
}
\`\`\`

Action Types:
- CREATE_TOPIC: Create a new topic with the given title.
- OPEN_TOPIC: Open/view an existing topic.
- START_GIVE_FEEDBACK: Navigate user to the feedback UI for a topic.
- GIVE_DIRECT_FEEDBACK: Immediately submit feedback on a topic.
- TOGGLE_FEEDBACK: Enable or disable feedback for a topic.
- GENERATE_IMPROVEMENTS: Produce AI-generated improvement suggestions based on feedback history.
- INVALID_ACTION: The message does not match any supported action.
- IRRELEVENT_ACTION: The message is completely irrelevant to this application.

Examples:
\`\`\`
User: create topic on "Team Communication"
Response:
{
  "action": "CREATE_TOPIC",
  "topic": "Team Communication",
  "feedback": ""
}
\`\`\`

NOW, classify the following user message and return only the JSON:

\`\`\`
${userMessage}
\`\`\`
`;

/**
 * Prompt to select the best topic from a list of found topics.
 */
export function findBestTopicFromFoundTopicsPrompt(
  userId: string | undefined,
  userMessage: string,
  topicsArray: Array<{
    topicId: string;
    topicName: string;
    owner: { _id: string; username: string };
  }>
): string {
  return `
You are a smart assistant in an anonymous feedback platform.

The user wants to open a topic. You are given:
- A list of topic candidates (max 10)
- The ID of the currently logged-in user (if available)
- The user's original message

Your job:
1. Analyze the message and return the most relevant topic from the list.
2. Prefer the user's own topic if it matches closely.
3. Otherwise, return the best match based on title similarity.
4. Respond with only a JSON object—no explanation, no extra text.
   SEND EXACTLY CORRECT topicId, not even a minor mistake.
   You should prioritize the user's message as well.

Schema:
\`\`\`
{
  "topicId": "<topicId>",
  "reason": "<brief reason>"
}
\`\`\`

User ID:
${userId}

User message:
${userMessage}

Topics:
${JSON.stringify(topicsArray, null, 2)}
`.trim();
}



















/*export const reportCreationForTopicPrompt=`
You are an expert feedback analyst. You will be given multiple pieces of user feedback about a topic. The feedback may be in English or other languages. Your job is to produce a highly specific, actionable report tailored to the actual content of each comment—never generic boilerplate.

Your tasks:
1. Detect the original language of each feedback item and perform all analysis in that language.
2. Count how many are clearly positive and how many are clearly negative.
3. Give an overall satisfaction rating out of 10, with a one‑sentence justification (in the same language).
4. Suggest **at least four** concrete, actionable improvements that reference **specific aspects** of the feedback. For example, if a comment praises “the instructor’s clear slides,” you might suggest “Use more real‑world diagrams like slide 3 to illustrate key concepts” rather than “Provide more examples.”

Give the improvements in short simple way yet professional and with supportive tone and 
if the feedback is 100% positive no need to consider anything out of it 
we want to figure out practical steps the user can take to improve
do not mention anything personal negative markings and actual negative feedbacks in improvement about the owner 

**IMPORTANT:**  
• Do _not_ use generic phrases like “Provide more examples” or “Simplify the concepts.”  
• Each improvement must refer to something you see in the feedback (e.g. tone, length, terminology, visual aids, examples, pace).  
• Return only the following **strict JSON** (in the same language as the feedback items):
• No 2 improvements should look similar the owner shall get the actuall actionable steps 

Return the result in the **strict JSON** format below:

{
  "nPositive": <number of clearly positive feedbacks>,
  "nNegative": <number of clearly negative feedbacks>,
  "rating": <estimated overall rating out of 10>,
  "improvements": [
    "<suggested improvement 1>",
    "<suggested improvement 2>",
    ]
}

Only output this JSON object. Do not include any explanation or extra text.

Here are the feedbacks to analyze:`;

export const reportCreationForUserPrompt = `
You are an expert feedback analyst. You will be given multiple pieces of user feedback *about a person*. The feedback may be in English or other languages. Your job is to produce a highly specific, actionable report tailored to each comment—never generic boilerplate.

Your tasks:
1. Detect the original language of each feedback item and perform all analysis in that language.
2. Count how many are clearly positive and how many are clearly negative.
3. Give an overall satisfaction rating out of 10, with a one‑sentence justification (in the same language).
4. Suggest **exactly four** concrete, distinct, actionable improvements that reference **specific aspects** of the feedback. No two improvements should look alike; each must be a unique, precise next‑step (e.g. reference tone, clarity, pacing, examples mentioned).

**IMPORTANT:**  
• Do _not_ use generic phrases like “Provide more examples” or “Simplify the concepts.”  
• Each improvement must refer to something you see in the feedback (e.g., “your concise phrasing helped clarity—consider adding one more real‑life anecdote like in comment 3”).  
• Return only the following **strict JSON** (in the same language as the feedback items):


{
  "nPositive": <number>,
  "nNegative": <number>,
  "rating": <number 0–10>,
  "improvements": [
    "<improvement 1>",
    "<improvement 2>",
    "<improvement 3>",
    "<improvement 4>"
  ]
}`

export const getSearchKeywordThumbnailPrompt = (topicTitle: string) => `
You are a smart visual content assistant helping match topic titles to real-world stock photo searches.
Given the topic: "${topicTitle}", do the following:
Always give a recommendation that fits to tech field and NO CASUAL or unrelated cringe recommendations
and even if 20%+ you feel that this might give any irreavent or cring suggestion then give a simple recommendation related to Tech industry
ex : "ExpressJS" -> its tech field so you can give something like coding or programming 

Only return a JSON object in the following strict format:

{
  "searchKeyword": "<your suggested keyword>"
}
`;


export const actionBotDetermineActionTypePrompt=(userMessage:string)=>`You are the smart assistant inside an anonymous feedback platform. Users type free‑form messages, and your job is to classify each message into one of the predefined action types. You MUST respond with **only** a valid JSON object matching the schema below—no extra text, no explanations.

Schema:
{
  "action": "<one of: CREATE_TOPIC, OPEN_TOPIC, START_GIVE_FEEDBACK, GIVE_DIRECT_FEEDBACK, TOGGLE_FEEDBACK, GENERATE_IMPROVEMENTS, INVALID_ACTION,IRRELEVENT_ACTION>",
  "topic": "<topic name if applicable, else empty string>",
  "feedback": "<feedback content if applicable, else empty string>"
}

Action Types:
- CREATE_TOPIC         : Create a new topic with the given title.
- OPEN_TOPIC           : Open/view an existing topic.
- START_GIVE_FEEDBACK  : Navigate user to the feedback UI for a topic (no feedback text provided yet).
- GIVE_DIRECT_FEEDBACK : Immediately submit the provided feedback on a topic.
- TOGGLE_FEEDBACK      : Enable or disable feedback for a topic.
- GENERATE_IMPROVEMENTS: Produce AI‑generated improvement suggestions based on a topic’s feedback history.
- INVALID_ACTION       : The message does not match any supported action.
-IRRELEVENT_ACTION      : The message is completely irrelevent of what this application does 

Examples:

User: create topic on "Team Communication"  
Response:
{
  "action": "CREATE_TOPIC",
  "topic": "Team Communication",
  "feedback": ""
}

User: open topic named "Career Growth"  
Response:
{
  "action": "OPEN_TOPIC",
  "topic": "Career Growth",
  "feedback": ""
}

User: give feedback on React  
Response:
{
  "action": "START_GIVE_FEEDBACK",
  "topic": "React",
  "feedback": ""
}

User: give feedback on topic React — "It was a fantastic session!"  
Response:
{
  "action": "GIVE_DIRECT_FEEDBACK",
  "topic": "React",
  "feedback": "It was a fantastic session!"
}

User: disable feedbacks for topic "UX Design"  
Response:
{
  "action": "TOGGLE_FEEDBACK",
  "topic": "UX Design",
  "feedback": ""
}

User: what can be improved in "Time Management"?  
Response:
{
  "action": "GENERATE_IMPROVEMENTS",
  "topic": "Time Management",
  "feedback": ""
}

User: tell me a joke  
Response:
{
  "action": "INVALID_ACTION",
  "topic": "",
  "feedback": ""
}

User: I created a topic called "ExpressJS" earlier. Can you tell me feedbacks ?(here user means improvemnts when he says feedback with context of his created topic)
Response:
{
  "action": "GENERATE_IMPROVEMENTS",
  "topic": "ExpressJS",
  "feedback": ""
}

User: I want your feedback on my topic "JavaScript Basics"
Response:
{
  "action": "GENERATE_IMPROVEMENTS",
  "topic": "JavaScript Basics",
  "feedback": ""
}

---

NOW, classify the following user message and return **only** the JSON:

The message received from user is ${userMessage} 
work on this
`

export function findBestTopicFromFoundTopicsPrompt(
  userId: string | undefined,
  userMessage: string,
  topicsArray: Array<{
    topicId: string;
    topicName: string;
    owner: { _id: string; username: string };
  }>
): string {
  return `
You are a smart assistant in an anonymous feedback platform.

The user wants to open a topic. You are given:
- A list of topic candidates (max 10)
- The ID of the currently logged-in user (if available)
- The user's original message

Your job:
1. Analyze the message and return the most relevant topic from the list.
2. Prefer the user's own topic if it matches closely.
3. Otherwise, return the best match based on title similarity.
4. Respond with **only a JSON object**—no explanation, no extra text.
SEND EXACTLY CORRECT topicID NOT EVEN MINOR MISTAKE
YOU SHOULD PRIORATIZE USERS MESSAGE AS WELL
Schema:
{
  "topicId": "<topicId>",
  "reason": "<brief reason>"
}

User ID:
${userId}

User message:
${userMessage}

Topics:
${JSON.stringify(topicsArray, null, 2)}

Return your answer strictly following the schema.
  `.trim();
}*/