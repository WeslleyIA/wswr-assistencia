/**
 * WSWR Assistência Técnica - Interatividades & Conversão
 * Código leve em Vanilla JS (0 dependências, alta performance)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initFaqAccordion();
  initSimulator();
  initSmoothScroll();
  initWhatsAppTracking();
});

/* ==========================================================================
   1. Sticky Header & Active Nav on Scroll
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Sombra no header
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
    } else {
      header.style.boxShadow = 'none';
    }

    // Identificar seção visível
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. Menu Mobile
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Fecha o menu ao clicar em qualquer link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Accordion do FAQ (Dúvidas Frequentes)
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros itens para um efeito sanfona limpo
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   4. Simulador Interativo de Orçamento com WhatsApp Link Builder
   ========================================================================== */
function initSimulator() {
  const devicePills = document.querySelectorAll('#devicePills .pill-btn');
  const problemPills = document.querySelectorAll('#problemPills .pill-btn');
  const deliveryPills = document.querySelectorAll('#deliveryPills .pill-btn');
  const modelInput = document.getElementById('modelInput');
  const sendBtn = document.getElementById('simulatorSendBtn');

  let selectedDevice = 'Celular';
  let selectedProblem = 'Troca de Tela / Visor Quebrado';
  let selectedDelivery = 'Balcão';

  // Seleção de dispositivo
  devicePills.forEach(btn => {
    btn.addEventListener('click', () => {
      devicePills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDevice = btn.getAttribute('data-device');
      updateWhatsappLink();
    });
  });

  // Seleção de defeito
  problemPills.forEach(btn => {
    btn.addEventListener('click', () => {
      problemPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedProblem = btn.getAttribute('data-problem');
      updateWhatsappLink();
    });
  });

  // Seleção de forma de atendimento (Leva e Traz ou Balcão)
  deliveryPills.forEach(btn => {
    btn.addEventListener('click', () => {
      deliveryPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDelivery = btn.getAttribute('data-delivery');
      updateWhatsappLink();
    });
  });

  // Atualização em tempo real conforme digita o modelo
  if (modelInput) {
    modelInput.addEventListener('input', updateWhatsappLink);
  }

  function updateWhatsappLink() {
    const modelText = modelInput && modelInput.value.trim() ? ` (Modelo: ${modelInput.value.trim()})` : '';
    const phone = '5519998480403';
    
    let expert = 'equipe WSWR';
    if (selectedDevice.includes('Celular')) {
      expert = 'Werlley';
    } else if (selectedDevice.includes('Notebook') || selectedDevice.includes('Computador')) {
      expert = 'Weslley';
    }

    const deliveryNote = selectedDelivery === 'Leva e Traz' 
      ? ' Gostaria de solicitar o serviço Leva e Traz (coleta no meu endereço)!' 
      : ' Pretendo levar até a loja física.';

    const message = `Olá ${expert}! Vim pelo site da WSWR e gostaria de um orçamento para meu ${selectedDevice}${modelText}. O problema é: ${selectedProblem}.${deliveryNote}`;
    const encoded = encodeURIComponent(message);
    
    if (sendBtn) {
      sendBtn.href = `https://wa.me/${phone}?text=${encoded}`;
      sendBtn.setAttribute('data-whatsapp-track', 'simulador');
      sendBtn.setAttribute('data-whatsapp-service', `${selectedDevice} - ${selectedProblem} (${selectedDelivery})`);
    }
  }

  // Inicializa o link logo no carregamento
  updateWhatsappLink();
}



/* ==========================================================================
   5. Rolagem Suave Personalizada
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   6. Rastreamento de Cliques no WhatsApp (Google Analytics 4 / GA4)
   ========================================================================== */
function trackWhatsAppClick(origin, serviceLabel) {
  const eventLabel = origin || 'geral';
  const service = serviceLabel || 'Geral';

  // Disparo para o Google Analytics 4 se configurado
  if (typeof window.gtag === 'function') {
    // 1. Evento recomendado oficial do Google para Geração de Leads
    window.gtag('event', 'generate_lead', {
      event_category: 'WhatsApp',
      event_label: eventLabel,
      service_type: service,
      currency: 'BRL',
      value: 1
    });

    // 2. Evento customizado específico para filtros e métricas no GA4
    window.gtag('event', 'whatsapp_click', {
      click_origin: eventLabel,
      service_type: service,
      page_location: window.location.href
    });
  }

  // Log no Console para auditoria e teste imediato em desenvolvimento
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.search.includes('debug=true')) {
    console.log('[GA4 Event] WhatsApp Click Disparado:', { origin: eventLabel, service: service });
  }
}

function initWhatsAppTracking() {
  // Captura todos os links de WhatsApp na página
  document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (!targetLink) return;

    let origin = targetLink.getAttribute('data-whatsapp-track');
    let service = targetLink.getAttribute('data-whatsapp-service') || 'Geral';

    if (!origin) {
      if (targetLink.id === 'heroWhatsappCta') origin = 'hero_banner';
      else if (targetLink.id === 'headerWhatsappBtn') origin = 'header';
      else if (targetLink.id === 'floatingWhatsapp') origin = 'botao_flutuante';
      else if (targetLink.id === 'simulatorSendBtn') origin = 'simulador';
      else if (targetLink.id === 'btnOrcarCelular') origin = 'card_celular';
      else if (targetLink.id === 'btnOrcarPC') origin = 'card_computadores';
      else if (targetLink.classList.contains('top-badge-link')) origin = 'barra_aviso_topo';
      else if (targetLink.closest('.contact-info-card')) origin = 'secao_contato';
      else origin = 'link_geral_whatsapp';
    }

    trackWhatsAppClick(origin, service);
  });
}
