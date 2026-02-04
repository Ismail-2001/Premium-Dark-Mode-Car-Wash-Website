// AI-Powered Live Chat with DeepSeek API
class EliteChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.apiKey = null;
        this.init();
    }

    init() {
        this.createChatUI();
        this.loadApiKey();
        this.setupEventListeners();
    }

    loadApiKey() {
        // In production, this should be loaded from secure backend
        this.apiKey = localStorage.getItem('deepseek_api_key') || null;
    }

    createChatUI() {
        // Chat button
        const chatButton = document.createElement('div');
        chatButton.id = 'elite-chat-button';
        chatButton.className = 'fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all duration-300 animate-pulse-glow';
        chatButton.innerHTML = `
            <span class="material-symbols-outlined text-black text-2xl">chat</span>
        `;

        // Chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'elite-chat-window';
        chatWindow.className = 'fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-obsidian border border-white/10 rounded-lg shadow-2xl hidden flex flex-col';
        chatWindow.innerHTML = `
            <div class="premium-gradient p-4 rounded-t-lg flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-black">smart_toy</span>
                    </div>
                    <div>
                        <h3 class="text-black font-bold text-sm">Elite Assistant</h3>
                        <p class="text-black/70 text-xs">Always here to help</p>
                    </div>
                </div>
                <button id="close-chat" class="text-black/70 hover:text-black transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="flex gap-3">
                    <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-primary text-sm">smart_toy</span>
                    </div>
                    <div class="bg-white/5 p-3 rounded-lg max-w-[80%]">
                        <p class="text-white/80 text-sm">👋 Welcome to Elite Mobile Detailing! I'm here to help you with:</p>
                        <ul class="text-white/60 text-xs mt-2 space-y-1">
                            <li>• Service recommendations</li>
                            <li>• Booking appointments</li>
                            <li>• Pricing information</li>
                            <li>• Service areas</li>
                        </ul>
                        <p class="text-white/60 text-xs mt-2">How can I assist you today?</p>
                    </div>
                </div>
            </div>
            
            <div class="p-4 border-t border-white/10">
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        id="chat-input" 
                        placeholder="Type your message..." 
                        class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                    >
                    <button 
                        id="send-message" 
                        class="bg-primary text-black px-4 py-3 rounded-lg hover:bg-white transition-colors"
                    >
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </div>
                <div class="mt-2 text-center">
                    <button id="set-api-key" class="text-primary/60 text-xs hover:text-primary transition-colors">
                        Configure API Key
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(chatButton);
        document.body.appendChild(chatWindow);
    }

    setupEventListeners() {
        // Chat button
        document.getElementById('elite-chat-button').addEventListener('click', () => this.toggleChat());
        
        // Close chat
        document.getElementById('close-chat').addEventListener('click', () => this.closeChat());
        
        // Send message
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // API key setup
        document.getElementById('set-api-key').addEventListener('click', () => this.showApiKeySetup());
    }

    toggleChat() {
        const chatWindow = document.getElementById('elite-chat-window');
        const chatButton = document.getElementById('elite-chat-button');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.remove('hidden');
            chatButton.classList.add('hidden');
            this.isOpen = true;
            document.getElementById('chat-input').focus();
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('elite-chat-window');
        const chatButton = document.getElementById('elite-chat-button');
        
        chatWindow.classList.add('hidden');
        chatButton.classList.remove('hidden');
        this.isOpen = false;
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await this.getAIResponse(message);
            this.removeTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage(this.getFallbackResponse(message), 'bot');
        }
    }

    async getAIResponse(message) {
        if (!this.apiKey) {
            return this.getFallbackResponse(message);
        }

        const systemPrompt = `You are an elite assistant for Elite Mobile Detailing, a luxury car detailing service. You are professional, helpful, and knowledgeable about automotive detailing services.

Key information:
- Services: Interior Restoration, Surface Correction, Nanotech Shield
- Service areas: Beverly Hills, Malibu, Greater Los Angeles
- Contact: +1 (310) 555-0198, concierge@elitestudio.com
- Pricing: Premium luxury services (Tier I: $299+, Tier II: $599+, Tier III: $999+)

Guidelines:
- Be professional and sophisticated
- Provide specific, helpful information
- Recommend appropriate services based on customer needs
- Always offer to help with booking
- Keep responses concise but informative`;

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek API Error:', error);
            return this.getFallbackResponse(message);
        }
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return "Our premium detailing services start at $299 for Interior Restoration, $599 for Surface Correction, and $999 for Nanotech Shield. Each service is customized to your vehicle's needs. Would you like a detailed quote?";
        }
        
        if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
            return "I'd be happy to help you book an appointment! You can click the 'Book Your Experience' button or use our contact form. What service are you interested in and when would be convenient?";
        }
        
        if (lowerMessage.includes('service') || lowerMessage.includes('detail')) {
            return "We offer three premium tiers: Interior Restoration (deep cleaning), Surface Correction (paint perfection), and Nanotech Shield (ceramic protection). Which service interests you most?";
        }
        
        if (lowerMessage.includes('area') || lowerMessage.includes('location')) {
            return "We serve Beverly Hills, Malibu, and all of Greater Los Angeles. Our mobile service comes directly to your location! Is your vehicle within our service area?";
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
            return "You can reach us at +1 (310) 555-0198 or concierge@elitestudio.com. I can also help you book directly here. What would you prefer?";
        }
        
        return "Thank you for your interest in Elite Mobile Detailing! I'm here to help with service recommendations, booking, or any questions about our premium detailing services. What specific information can I provide?";
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex gap-3 ${sender === 'user' ? 'justify-end' : ''}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="bg-primary/20 p-3 rounded-lg max-w-[80%]">
                    <p class="text-white text-sm">${message}</p>
                </div>
                <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-primary text-sm">person</span>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-primary text-sm">smart_toy</span>
                </div>
                <div class="bg-white/5 p-3 rounded-lg max-w-[80%]">
                    <p class="text-white/80 text-sm">${message}</p>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex gap-3';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-primary text-sm">smart_toy</span>
            </div>
            <div class="bg-white/5 p-3 rounded-lg">
                <div class="flex gap-1">
                    <div class="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    showApiKeySetup() {
        const existingKey = localStorage.getItem('deepseek_api_key') || '';
        const newKey = prompt('Enter your DeepSeek API Key:', existingKey);
        
        if (newKey && newKey.trim()) {
            localStorage.setItem('deepseek_api_key', newKey.trim());
            this.apiKey = newKey.trim();
            this.addMessage('API key configured successfully! I can now provide AI-powered responses.', 'bot');
        }
    }
}

// Initialize chat bot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new EliteChatBot();
});
