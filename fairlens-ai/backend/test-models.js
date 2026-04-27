const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const models = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-2.5-flash'];

async function testModels() {
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      await model.generateContent('Say hello');
      console.log(`✅ ${m} works!`);
    } catch (e) {
      console.log(`❌ ${m} failed: ${e.message}`);
    }
  }
}
testModels();
