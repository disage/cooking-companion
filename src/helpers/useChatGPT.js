const apiKey = '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';
const endpoint = 'https://api.openai.com/v1/chat/completions';

export const generateChatMessage = async (prompt) => {
    const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: prompt }
        ],
        max_tokens: 3800,  // Set the maximum number of tokens in the response
        // temperature: 0.7,  // Control the randomness of the generated response
        // n: 1,  // Generate a single response
        // stop: '\n'  // Stop generating tokens at a new line
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(endpoint, requestOptions);
        const data = await response.json();
        const chatMessage = data.choices[0].message.content;
        return chatMessage;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
