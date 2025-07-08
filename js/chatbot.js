// ===== CHATBOT FUNCTIONALITY =====

class Chatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isTyping = false;
    this.currentContext = 'general';
    this.userName = '';
    this.userPhone = '';
    this.isCallRequested = false;
    
    // Datos dummy más realistas
    this.dummyData = {
      doctors: {
        maxilofacial: [
          { name: 'Dr. Carlos Méndez', specialty: 'Cirugía Maxilofacial', experience: '15 años', availability: 'Lun-Vie 9:00-17:00', rating: 4.9 },
          { name: 'Dra. Ana Rodríguez', specialty: 'Ortodoncia', experience: '12 años', availability: 'Mar-Jue 8:00-16:00', rating: 4.8 }
        ],
        neurologia: [
          { name: 'Dr. Miguel Torres', specialty: 'Neurología Clínica', experience: '20 años', availability: 'Lun-Vie 10:00-18:00', rating: 4.9 },
          { name: 'Dra. Laura Sánchez', specialty: 'Neurocirugía', experience: '18 años', availability: 'Mar-Sáb 9:00-15:00', rating: 4.7 }
        ],
        cardiologia: [
          { name: 'Dr. Roberto Jiménez', specialty: 'Cardiología Intervencionista', experience: '22 años', availability: 'Lun-Vie 8:00-16:00', rating: 4.9 },
          { name: 'Dra. Patricia López', specialty: 'Electrofisiología', experience: '16 años', availability: 'Mar-Jue 9:00-17:00', rating: 4.8 }
        ],
        oncologia: [
          { name: 'Dr. Fernando Ruiz', specialty: 'Oncología Médica', experience: '25 años', availability: 'Lun-Vie 9:00-17:00', rating: 4.9 },
          { name: 'Dra. Carmen Vega', specialty: 'Radioterapia', experience: '19 años', availability: 'Mar-Sáb 8:00-16:00', rating: 4.8 }
        ]
      },
      appointments: {
        available: [
          { date: '2024-01-15', time: '10:00', doctor: 'Dr. Carlos Méndez', specialty: 'Maxilofacial' },
          { date: '2024-01-15', time: '14:30', doctor: 'Dra. Ana Rodríguez', specialty: 'Ortodoncia' },
          { date: '2024-01-16', time: '11:00', doctor: 'Dr. Miguel Torres', specialty: 'Neurología' },
          { date: '2024-01-16', time: '15:00', doctor: 'Dr. Roberto Jiménez', specialty: 'Cardiología' },
          { date: '2024-01-17', time: '09:30', doctor: 'Dra. Patricia López', specialty: 'Cardiología' },
          { date: '2024-01-17', time: '13:00', doctor: 'Dr. Fernando Ruiz', specialty: 'Oncología' }
        ]
      },
      prices: {
        consulta: { general: 800, especialista: 1200, primera_vez: 600 },
        estudios: {
          'Radiografía': 350,
          'Tomografía': 2500,
          'Resonancia Magnética': 4500,
          'Electrocardiograma': 450,
          'Ecocardiograma': 1200,
          'Análisis de Sangre': 800
        }
      },
      insurance: ['IMSS', 'ISSSTE', 'Seguro Popular', 'Seguros Privados', 'Pago Particular']
    };
    
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.bindEvents();
    this.loadInitialMessage();
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <div id="chatbot" class="chatbot-container">
        <!-- Floating Action Button -->
        <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Abrir chat">
          <svg class="chatbot-icon" viewBox="0 0 24 24">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          <span class="chatbot-notification" id="chatbot-notification"></span>
        </button>

        <!-- Chat Window -->
        <div id="chatbot-window" class="chatbot-window">
          <!-- Header -->
          <div class="chatbot-header">
            <h3>Centro Médico Vitalis</h3>
            <button class="chatbot-close" aria-label="Cerrar chat">×</button>
          </div>

          <!-- Messages -->
          <div class="chatbot-messages" id="chatbot-messages">
            <!-- Messages will be added here -->
          </div>

          <!-- Quick Actions -->
          <div class="chatbot-quick-actions" id="chatbot-quick-actions">
            <button class="quick-action-btn" data-action="cita">Agendar Cita</button>
            <button class="quick-action-btn" data-action="llamame">📞 Llamame</button>
            <button class="quick-action-btn" data-action="horarios">Horarios</button>
            <button class="quick-action-btn" data-action="precios">Precios</button>
          </div>

          <!-- Input -->
          <div class="chatbot-input">
            <form class="chatbot-input-form" id="chatbot-form">
              <input 
                type="text" 
                class="chatbot-input-field" 
                id="chatbot-input" 
                placeholder="Escribe tu mensaje..."
                maxlength="500"
              >
              <button type="submit" class="chatbot-send-btn" id="chatbot-send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  bindEvents() {
    // Toggle chatbot
    document.getElementById('chatbot-toggle').addEventListener('click', () => {
      this.toggleChat();
    });

    // Close chatbot
    document.querySelector('.chatbot-close').addEventListener('click', () => {
      this.closeChat();
    });

    // Send message
    document.getElementById('chatbot-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // Quick actions
    document.getElementById('chatbot-quick-actions').addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-action-btn')) {
        const action = e.target.dataset.action;
        this.handleQuickAction(action);
      }
    });

    // Enter key to send
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    document.getElementById('chatbot-window').classList.add('active');
    document.getElementById('chatbot-input').focus();
    this.hideNotification();
  }

  closeChat() {
    this.isOpen = false;
    document.getElementById('chatbot-window').classList.remove('active');
  }

  showNotification(count = 1) {
    const notification = document.getElementById('chatbot-notification');
    notification.textContent = count;
    notification.style.display = 'flex';
  }

  hideNotification() {
    document.getElementById('chatbot-notification').style.display = 'none';
  }

  loadInitialMessage() {
    setTimeout(() => {
      this.addBotMessage('¡Hola! Soy el asistente virtual de Centro Médico Vitalis. ¿En qué puedo ayudarte hoy? Puedo ayudarte con citas, información médica, precios y más.');
    }, 1000);
  }

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;

    this.addUserMessage(message);
    input.value = '';

    // Simulate typing
    this.showTyping();
    
    setTimeout(() => {
      this.hideTyping();
      this.processUserMessage(message);
    }, 1000 + Math.random() * 1000);
  }

  addUserMessage(text) {
    const message = {
      type: 'user',
      text: text,
      time: new Date()
    };
    
    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();
  }

  addBotMessage(text) {
    const message = {
      type: 'bot',
      text: text,
      time: new Date()
    };
    
    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();
  }

  renderMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message ${message.type}`;
    
    const time = message.time.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    messageElement.innerHTML = `
      <div class="message-bubble ${message.type}">
        ${message.text}
        <div class="message-time">${time}</div>
      </div>
    `;

    messagesContainer.appendChild(messageElement);
  }

  showTyping() {
    this.isTyping = true;
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingElement = document.createElement('div');
    typingElement.className = 'chatbot-message bot';
    typingElement.id = 'typing-indicator';
    
    typingElement.innerHTML = `
      <div class="chatbot-typing">
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;

    messagesContainer.appendChild(typingElement);
    this.scrollToBottom();
  }

  hideTyping() {
    this.isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific keywords
    if (lowerMessage.includes('cita') || lowerMessage.includes('agendar') || lowerMessage.includes('reservar')) {
      this.handleAppointmentRequest();
    } else if (lowerMessage.includes('llamar') || lowerMessage.includes('teléfono') || lowerMessage.includes('marcar')) {
      this.handleCallRequest();
    } else if (lowerMessage.includes('horario') || lowerMessage.includes('hora')) {
      this.handleScheduleRequest();
    } else if (lowerMessage.includes('ubicación') || lowerMessage.includes('dirección') || lowerMessage.includes('dónde')) {
      this.handleLocationRequest();
    } else if (lowerMessage.includes('contacto')) {
      this.handleContactRequest();
    } else if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto')) {
      this.handlePricingRequest();
    } else if (lowerMessage.includes('doctor') || lowerMessage.includes('médico') || lowerMessage.includes('especialista')) {
      this.handleDoctorRequest();
    } else if (lowerMessage.includes('maxilofacial') || lowerMessage.includes('dental') || lowerMessage.includes('diente')) {
      this.handleSpecialtyRequest('maxilofacial');
    } else if (lowerMessage.includes('neurología') || lowerMessage.includes('neurológico') || lowerMessage.includes('cerebro')) {
      this.handleSpecialtyRequest('neurologia');
    } else if (lowerMessage.includes('cardiología') || lowerMessage.includes('cardiaco') || lowerMessage.includes('corazón')) {
      this.handleSpecialtyRequest('cardiologia');
    } else if (lowerMessage.includes('oncología') || lowerMessage.includes('cáncer') || lowerMessage.includes('tumor')) {
      this.handleSpecialtyRequest('oncologia');
    } else if (lowerMessage.includes('seguro') || lowerMessage.includes('imss') || lowerMessage.includes('issste')) {
      this.handleInsuranceRequest();
    } else {
      this.handleGeneralInquiry(message);
    }
  }

  handleQuickAction(action) {
    switch (action) {
      case 'cita':
        this.handleAppointmentRequest();
        break;
      case 'llamame':
        this.handleCallRequest();
        break;
      case 'horarios':
        this.handleScheduleRequest();
        break;
      case 'precios':
        this.handlePricingRequest();
        break;
    }
  }

  handleCallRequest() {
    if (!this.userPhone) {
      this.addBotMessage('Para llamarte, necesito tu número de teléfono. ¿Podrías proporcionármelo?');
      this.currentContext = 'waiting_for_phone';
    } else {
      this.simulateCall();
    }
  }

  simulateCall() {
    this.addBotMessage('📞 Iniciando llamada...');
    setTimeout(() => {
      this.addBotMessage('📞 Llamando al (443) 900 - 5382...');
    }, 1000);
    setTimeout(() => {
      this.addBotMessage('✅ Llamada conectada. Un especialista te atenderá en breve.');
    }, 3000);
    setTimeout(() => {
      this.addBotMessage('💬 Mientras tanto, ¿hay algo más en lo que pueda ayudarte?');
    }, 5000);
  }

  handleAppointmentRequest() {
    this.addBotMessage('¡Perfecto! Te ayudo a agendar tu cita. Tenemos las siguientes opciones disponibles:');
    
    setTimeout(() => {
      const appointments = this.dummyData.appointments.available.slice(0, 3);
      let appointmentText = '';
      appointments.forEach((apt, index) => {
        appointmentText += `\n📅 ${apt.date} - ${apt.time} con ${apt.doctor} (${apt.specialty})`;
      });
      this.addBotMessage(appointmentText);
    }, 800);
    
    setTimeout(() => {
      this.addBotMessage('¿Cuál de estas opciones te parece mejor? O si prefieres, puedo llamarte para agendar personalmente.');
    }, 2000);
  }

  handleScheduleRequest() {
    this.addBotMessage('Nuestros horarios de atención son:');
    setTimeout(() => {
      this.addBotMessage('🕐 Lunes a Viernes: 8:00 AM - 10:00 PM');
    }, 800);
    setTimeout(() => {
      this.addBotMessage('🕐 Sábados y Domingos: 7:00 AM - 9:00 PM');
    }, 1600);
    setTimeout(() => {
      this.addBotMessage('🆘 Emergencias: 24/7');
    }, 2400);
    setTimeout(() => {
      this.addBotMessage('¿Te gustaría agendar una cita en algún horario específico?');
    }, 3200);
  }

  handleLocationRequest() {
    this.addBotMessage('📍 Nos encuentras en:');
    setTimeout(() => {
      this.addBotMessage('Remigio Yarza 99 Col, Agustín Arriaga Rivera, Morelia, Mich.');
    }, 800);
    setTimeout(() => {
      this.addBotMessage('🗺️ Puedes ver nuestra ubicación en Google Maps o usar Waze para llegar.');
    }, 1600);
    setTimeout(() => {
      this.addBotMessage('🚗 Estacionamiento gratuito disponible en el lugar.');
    }, 2400);
  }

  handleContactRequest() {
    this.addBotMessage('📞 Teléfono: (443) 900 - 5382');
    setTimeout(() => {
      this.addBotMessage('📧 Email: connect@docabyte.com');
    }, 800);
    setTimeout(() => {
      this.addBotMessage('📱 WhatsApp: +52 443 900 5382');
    }, 1600);
    setTimeout(() => {
      this.addBotMessage('📱 Redes sociales: Facebook, Instagram, LinkedIn');
    }, 2400);
  }

  handlePricingRequest() {
    this.addBotMessage('💵 Nuestros precios aproximados:');
    setTimeout(() => {
      this.addBotMessage('🏥 Consulta general: $600 (primera vez)');
    }, 800);
    setTimeout(() => {
      this.addBotMessage('👨‍⚕️ Consulta especialista: $1,200');
    }, 1600);
    setTimeout(() => {
      this.addBotMessage('🔬 Estudios desde: $350 (Radiografía) hasta $4,500 (Resonancia)');
    }, 2400);
    setTimeout(() => {
      this.addBotMessage('✅ Aceptamos seguros: IMSS, ISSSTE, Seguro Popular y privados.');
    }, 3200);
    setTimeout(() => {
      this.addBotMessage('¿Te gustaría que te ayude a verificar tu cobertura de seguro?');
    }, 4000);
  }

  handleDoctorRequest() {
    this.addBotMessage('👨‍⚕️ Nuestros especialistas destacados:');
    setTimeout(() => {
      this.addBotMessage('🏥 Dr. Carlos Méndez - Maxilofacial (15 años exp.) ⭐4.9');
    }, 800);
    setTimeout(() => {
      this.addBotMessage('🏥 Dr. Miguel Torres - Neurología (20 años exp.) ⭐4.9');
    }, 1600);
    setTimeout(() => {
      this.addBotMessage('🏥 Dr. Roberto Jiménez - Cardiología (22 años exp.) ⭐4.9');
    }, 2400);
    setTimeout(() => {
      this.addBotMessage('🏥 Dr. Fernando Ruiz - Oncología (25 años exp.) ⭐4.9');
    }, 3200);
    setTimeout(() => {
      this.addBotMessage('¿Con qué especialista te gustaría agendar una cita?');
    }, 4000);
  }

  handleSpecialtyRequest(specialty) {
    const specialties = {
      'maxilofacial': {
        name: 'Maxilofacial',
        description: 'Especialistas en cirugía oral y maxilofacial, implantes dentales y tratamientos estéticos faciales.',
        services: 'Implantes dentales, cirugía ortognática, extracciones complejas, cirugía estética facial.',
        doctors: this.dummyData.doctors.maxilofacial
      },
      'neurologia': {
        name: 'Neurología',
        description: 'Especialistas en el diagnóstico y tratamiento de enfermedades del sistema nervioso.',
        services: 'Evaluación neurológica, tratamiento de migrañas, epilepsia, enfermedades neurodegenerativas.',
        doctors: this.dummyData.doctors.neurologia
      },
      'cardiologia': {
        name: 'Cardiología',
        description: 'Especialistas en el diagnóstico y tratamiento de enfermedades del corazón y sistema cardiovascular.',
        services: 'Electrocardiogramas, ecocardiogramas, pruebas de esfuerzo, tratamiento de arritmias.',
        doctors: this.dummyData.doctors.cardiologia
      },
      'oncologia': {
        name: 'Oncología',
        description: 'Especialistas en el diagnóstico y tratamiento del cáncer con tecnología de última generación.',
        services: 'Quimioterapia, radioterapia, inmunoterapia, seguimiento oncológico personalizado.',
        doctors: this.dummyData.doctors.oncologia
      }
    };

    const specialtyInfo = specialties[specialty];
    
    this.addBotMessage(`🏥 Departamento de ${specialtyInfo.name}:`);
    setTimeout(() => {
      this.addBotMessage(specialtyInfo.description);
    }, 800);
    setTimeout(() => {
      this.addBotMessage(`Servicios: ${specialtyInfo.services}`);
    }, 1600);
    setTimeout(() => {
      let doctorsText = '👨‍⚕️ Nuestros especialistas:\n';
      specialtyInfo.doctors.forEach(doctor => {
        doctorsText += `• ${doctor.name} - ${doctor.specialty} (${doctor.experience})\n`;
        doctorsText += `  ⭐${doctor.rating} | ${doctor.availability}\n`;
      });
      this.addBotMessage(doctorsText);
    }, 2400);
    setTimeout(() => {
      this.addBotMessage('¿Te gustaría agendar una consulta con alguno de nuestros especialistas?');
    }, 4000);
  }

  handleInsuranceRequest() {
    this.addBotMessage('🏥 Aceptamos los siguientes seguros:');
    setTimeout(() => {
      this.addBotMessage('✅ IMSS - Cobertura completa');
    }, 800);
    setTimeout(() => {
      this.addBotMessage('✅ ISSSTE - Cobertura completa');
    }, 1600);
    setTimeout(() => {
      this.addBotMessage('✅ Seguro Popular - Cobertura básica');
    }, 2400);
    setTimeout(() => {
      this.addBotMessage('✅ Seguros Privados - Verificar cobertura');
    }, 3200);
    setTimeout(() => {
      this.addBotMessage('✅ Pago Particular - Descuentos disponibles');
    }, 4000);
    setTimeout(() => {
      this.addBotMessage('¿Con qué seguro cuentas? Puedo ayudarte a verificar tu cobertura.');
    }, 4800);
  }

  handleGeneralInquiry(message) {
    const responses = [
      'Entiendo tu consulta. ¿Te gustaría que te ayude con información sobre citas, horarios, precios o alguna especialidad específica?',
      'Gracias por tu mensaje. ¿En qué puedo ayudarte específicamente? Puedo asistirte con agendar citas, información médica o precios.',
      'Estoy aquí para ayudarte. ¿Necesitas información sobre nuestros servicios médicos, especialistas o precios?',
      'Perfecto, ¿te gustaría conocer más sobre alguna de nuestras especialidades médicas o agendar una cita?'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    this.addBotMessage(randomResponse);
  }

  // Public methods for external integration
  openWithAppointmentConfirmation() {
    this.openChat();
    setTimeout(() => {
      this.addBotMessage('¡Perfecto! Veo que quieres agendar una cita. Te ayudo con eso:');
    }, 500);
    setTimeout(() => {
      this.handleAppointmentRequest();
    }, 1500);
  }

  openWithCustomMessage(message) {
    this.openChat();
    setTimeout(() => {
      this.addBotMessage(message);
    }, 500);
  }

  openWithFormData(formData) {
    this.openChat();
    setTimeout(() => {
      this.addBotMessage('Gracias por completar el formulario. Un especialista se pondrá en contacto contigo pronto.');
    }, 500);
    setTimeout(() => {
      this.addBotMessage('Mientras tanto, ¿hay algo más en lo que pueda ayudarte?');
    }, 2000);
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new Chatbot();
});

// Global functions for external access
window.openChatbot = function(type = 'general') {
  if (window.chatbot) {
    switch (type) {
      case 'appointment':
        window.chatbot.openWithAppointmentConfirmation();
        break;
      case 'contact':
        window.chatbot.openWithCustomMessage('¡Hola! ¿En qué puedo ayudarte con información de contacto?');
        break;
      case 'call':
        window.chatbot.openWithCustomMessage('¡Hola! ¿Te gustaría que te llame? Solo necesito tu número de teléfono.');
        break;
      default:
        window.chatbot.openChat();
    }
  }
};

window.openChatbotWithMessage = function(message) {
  if (window.chatbot) {
    window.chatbot.openWithCustomMessage(message);
  }
};

window.openChatbotWithFormData = function(formData) {
  if (window.chatbot) {
    window.chatbot.openWithFormData(formData);
  }
}; 