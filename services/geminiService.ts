import { GoogleGenAI } from "@google/genai";
import { Transaction, Account, Category } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSpendingInsights = async (
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[]
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI services are currently unavailable. Please check your API configuration.";

  // Prepare a concise summary for the AI
  const recentTransactions = transactions.slice(0, 50); // Analyze last 50 for performance
  const summary = recentTransactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId);
    const catName = category ? `${category.name} (${category.type})` : 'Unknown';
    const acc = accounts.find(a => a.id === t.accountId)?.name || 'Unknown';
    return `- ${t.date.split('T')[0]}: Rs. ${t.amount} on ${catName} (${acc})`;
  }).join('\n');

  const prompt = `
    You are a financial advisor. Analyze the following recent expense transactions for a user.
    Identify spending patterns, alert on high non-essential spending, and give 3 brief, actionable tips to save money.
    Keep the tone encouraging but professional. Return the response as a markdown formatted string.
    The currency is Sri Lankan Rupees (Rs.).

    Transactions:
    ${summary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights could be generated at this time.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to retrieve insights. Please try again later.";
  }
};