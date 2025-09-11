const OpenAI = require('openai');

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If OpenAI is not configured, return a helpful mock response
    if (!openai) {
      const mockResponse = generateMockResponse(message);
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: mockResponse }
      ].slice(-20);

      return res.json({
        success: true,
        response: mockResponse,
        conversationHistory: updatedHistory,
        demo: true
      });
    }

    // System prompt to guide the AI's behavior for alumni/career guidance
    const systemPrompt = {
      role: 'system',
      content: `You are an AI career advisor and alumni mentor assistant for an Alumni Connect platform. Your role is to:

1. Provide career guidance and professional advice
2. Help users formulate good questions for mentorship conversations
3. Offer networking tips and strategies
4. Assist with professional development planning
5. Answer questions about career transitions, job searching, and skill development

Keep your responses:
- Professional yet friendly
- Practical and actionable
- Encouraging and supportive
- Focused on career and professional growth
- Appropriate for an alumni networking context

If asked about topics unrelated to careers, professional development, or mentorship, politely redirect the conversation back to these topics.`
    };

    // Build conversation context
    const messages = [
      systemPrompt,
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Return the AI response along with updated conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    ].slice(-20); // Keep only last 20 messages to manage context length

    res.json({
      success: true,
      response: aiResponse,
      conversationHistory: updatedHistory
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'AI service quota exceeded. Please try again later.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'AI service configuration error.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to get AI response. Please try again.' 
    });
  }
};

// Mock response generator for demo purposes
function generateMockResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('networking')) {
    return `Great question about networking! Here are some key strategies for improving your networking skills as a recent graduate:

1. **Start with your existing network** - Reach out to classmates, professors, and family friends
2. **Join professional organizations** - Look for industry-specific groups and local chapters
3. **Attend virtual and in-person events** - Conferences, meetups, and webinars are excellent opportunities
4. **Use LinkedIn effectively** - Optimize your profile and engage with industry content
5. **Follow up consistently** - Always send a thank-you message after meeting someone new
6. **Offer value first** - Think about how you can help others before asking for assistance

Remember, networking is about building genuine relationships, not just collecting contacts. Quality connections matter more than quantity!

*Note: This is a demo response. Configure your OpenAI API key to enable full AI functionality.*`;
  }
  
  if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
    return `I'd be happy to help with your career questions! Here are some general tips for career development:

1. **Define your goals** - Be clear about what you want to achieve short-term and long-term
2. **Develop relevant skills** - Stay updated with industry trends and required competencies
3. **Build a strong online presence** - Professional social media profiles and portfolio
4. **Seek mentorship** - Connect with experienced professionals in your field
5. **Stay curious and keep learning** - Continuous education is key in today's market

What specific aspect of your career would you like to explore further?

*Note: This is a demo response. Configure your OpenAI API key to enable full AI functionality.*`;
  }
  
  return `Thank you for your question! As your AI Career Assistant, I'm here to help with:

- Career guidance and planning
- Networking strategies
- Professional development advice
- Mentorship preparation
- Job search tips
- Skill development recommendations

Could you share more details about what specific career or professional development topic you'd like guidance on?

*Note: This is a demo response. Configure your OpenAI API key to enable full AI functionality.*`;
}

module.exports = {
  chatWithAI
};