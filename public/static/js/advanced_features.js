// ============================================
// ADVANCED FEATURES: Chatbot, Emergency Alert, Multi-Report
// ============================================

// ===== CHATBOT FUNCTIONALITY =====
let chatbotOpen = false;

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot-container');
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbot.style.display = 'flex';
        setTimeout(() => chatbot.classList.add('active'), 10);
    } else {
        chatbot.classList.remove('active');
        setTimeout(() => chatbot.style.display = 'none', 300);
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to backend
    fetch('/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        hideTypingIndicator();
        if (data.response) {
            addChatMessage(data.response, 'bot');
            
            // Voice alert for critical responses
            if (data.response.includes('emergency') || data.response.includes('immediately')) {
                speakText(data.response);
            }
        }
    })
    .catch(error => {
        hideTypingIndicator();
        addChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
    });
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = message;
    
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typing = document.createElement('div');
    typing.className = 'chat-message bot-message typing-indicator';
    typing.id = 'typing-indicator';
    typing.innerHTML = '<div class="message-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

// ===== EMERGENCY ALERT SYSTEM =====
function checkEmergency(data) {
    if (data.risk_level === 'High' || data.risk_score >= 80) {
        showEmergencyAlert(data.risk_score);
    }
}

function showEmergencyAlert(riskScore) {
    const alertHTML = `
        <div id="emergency-overlay" class="emergency-overlay">
            <div class="emergency-alert">
                <div class="emergency-icon">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h1>🚨 EMERGENCY DETECTED</h1>
                <h2>DO NOT WASTE TIME</h2>
                <p class="risk-score-big">Risk Score: ${riskScore}/100</p>
                <p class="emergency-message">Your medical report indicates a critical health risk. Immediate medical attention is required.</p>
                <div class="emergency-actions">
                    <a href="https://www.google.com/maps/search/nearest+hospital" target="_blank" class="btn-emergency">
                        📍 FIND NEAREST HOSPITAL
                    </a>
                    <button onclick="callEmergency()" class="btn-emergency-secondary">
                        📞 EMERGENCY SERVICES
                    </button>
                    <button onclick="closeEmergency()" class="btn-emergency-dismiss">
                        I Understand (Close)
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    // Speak emergency message
    speakText("Emergency detected. Your health report shows critical values. Please seek immediate medical attention.");
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

function closeEmergency() {
    const overlay = document.getElementById('emergency-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = '';
    }
}

function callEmergency() {
    // In India, common emergency numbers
    alert('Emergency Numbers:\n\n🚑 Ambulance: 102 / 108\n👮 Police: 100\n🔥 Fire: 101\n\nPlease call immediately or visit the nearest hospital.');
}

// ===== VOICE ALERT SYSTEM =====
function speakText(text) {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
}

// ===== RISK SCORE GAUGE =====
function displayRiskGauge(score, color) {
    const gauge = document.getElementById('risk-gauge');
    if (!gauge) return;
    
    const percentage = score;
    const circumference = 2 * Math.PI * 70; // radius = 70
    const offset = circumference - (percentage / 100) * circumference;
    
    gauge.innerHTML = `
        <svg width="180" height="180" class="gauge-svg">
            <circle cx="90" cy="90" r="70" fill="none" stroke="#e5e7eb" stroke-width="12"></circle>
            <circle cx="90" cy="90" r="70" fill="none" stroke="${color}" stroke-width="12" 
                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" 
                    stroke-linecap="round" transform="rotate(-90 90 90)"
                    style="transition: stroke-dashoffset 1s ease;">
            </circle>
            <text x="90" y="85" text-anchor="middle" font-size="36" font-weight="bold" fill="${color}">${score}</text>
            <text x="90" y="110" text-anchor="middle" font-size="14" fill="#6b7280">/ 100</text>
        </svg>
    `;
}

// ===== MULTIPLE REPORT UPLOAD =====
function uploadMultipleReports() {
    const input = document.getElementById('multi-file-input');
    const files = input.files;
    
    if (!files || files.length === 0) {
        alert('Please select at least one file');
        return;
    }
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    
    // Show loading
    document.getElementById('multi-upload-section').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    
    fetch('/analyze-multiple', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        
        if (data.error) {
            alert('Error: ' + data.error);
            document.getElementById('multi-upload-section').style.display = 'block';
            return;
        }
        
        displayMultiReportResults(data);
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        alert('Error analyzing reports: ' + error);
        document.getElementById('multi-upload-section').style.display = 'block';
    });
}

function displayMultiReportResults(data) {
    const container = document.getElementById('multi-report-results');
    container.style.display = 'block';
    
    // Display individual reports
    const reportsHTML = data.reports.map((report, index) => `
        <div class="report-card">
            <h4>Report ${index + 1}: ${report.filename}</h4>
            <div class="report-summary">
                <span class="risk-badge-small risk-${report.risk_level.toLowerCase()}">${report.risk_level}</span>
                <span class="risk-score-small">${report.risk_score}/100</span>
            </div>
            <div class="report-values">
                <span>Hb: ${report.values.hemoglobin || '--'}</span>
                <span>Sugar: ${report.values.blood_sugar || '--'}</span>
                <span>Chol: ${report.values.cholesterol || '--'}</span>
            </div>
        </div>
    `).join('');
    
    document.getElementById('individual-reports').innerHTML = reportsHTML;
    
    // Display trends
    if (data.trends) {
        displayTrends(data.trends);
    }
    
    // Check for emergency in any report
    const hasEmergency = data.reports.some(r => r.risk_level === 'High' || r.risk_score >= 80);
    if (hasEmergency) {
        const maxScore = Math.max(...data.reports.map(r => r.risk_score));
        showEmergencyAlert(maxScore);
    }
}

function displayTrends(trends) {
    const trendsContainer = document.getElementById('trends-display');
    
    let trendsHTML = '<h3>📊 Health Trends Analysis</h3>';
    
    if (trends.overall) {
        const direction = trends.overall.direction;
        const icon = direction === 'improving' ? '📈' : direction === 'worsening' ? '📉' : '➡️';
        const color = direction === 'improving' ? '#16a34a' : direction === 'worsening' ? '#dc2626' : '#f59e0b';
        
        trendsHTML += `
            <div class="trend-item" style="border-left: 4px solid ${color}">
                <h4>${icon} Overall Health Trend: ${direction.toUpperCase()}</h4>
                <p>Risk Score: ${trends.overall.first_score} → ${trends.overall.latest_score} 
                   (Change: ${trends.overall.change > 0 ? '+' : ''}${trends.overall.change})</p>
            </div>
        `;
    }
    
    if (trends.hemoglobin) {
        trendsHTML += `
            <div class="trend-item">
                <strong>Hemoglobin:</strong> ${trends.hemoglobin.first} → ${trends.hemoglobin.latest} g/dL
                <span class="trend-${trends.hemoglobin.direction}">(${trends.hemoglobin.direction})</span>
            </div>
        `;
    }
    
    if (trends.blood_sugar) {
        trendsHTML += `
            <div class="trend-item">
                <strong>Blood Sugar:</strong> ${trends.blood_sugar.first} → ${trends.blood_sugar.latest} mg/dL
                <span class="trend-${trends.blood_sugar.direction}">(${trends.blood_sugar.direction})</span>
            </div>
        `;
    }
    
    if (trends.cholesterol) {
        trendsHTML += `
            <div class="trend-item">
                <strong>Cholesterol:</strong> ${trends.cholesterol.first} → ${trends.cholesterol.latest} mg/dL
                <span class="trend-${trends.cholesterol.direction}">(${trends.cholesterol.direction})</span>
            </div>
        `;
    }
    
    trendsContainer.innerHTML = trendsHTML;
}
