/* ============================================================
   FADONI ENGENHARIA & CONSTRUÇÕES — SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------- ano atual no footer ----------- */
  const anoEl = document.getElementById('anoAtual');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* ----------- header com fundo ao rolar ----------- */
  const header = document.getElementById('header');
  const onScrollHeader = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ----------- menu mobile ----------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ----------- botão voltar ao topo ----------- */
  const backToTop = document.getElementById('backToTop');
  const onScrollTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  onScrollTop();
  window.addEventListener('scroll', onScrollTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------- scroll reveal (otimizado) ----------- */
  const revealTargets = document.querySelectorAll(
    '.servico-card, .projeto-item, .processo-step, .sobre-media, .sobre-content, .checklist li'
  );

  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    let revealedCount = 0; // Contador global para criar o delay sequencial perfeito

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          // Aplica o delay sequencial apenas aos elementos que aparecem juntos
          setTimeout(() => {
            target.classList.add('in-view');
          }, revealedCount * 60);

          revealedCount++;
          observer.unobserve(target);
        }
      });

      // Reseta o contador de delay após o lote de elementos visíveis ser processado
      setTimeout(() => { revealedCount = 0; }, 100);
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ----------- máscara de telefone inteligente ----------- */
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }

  /* ----------- validação do formulário de contato ----------- */
  const form = document.getElementById('contatoForm');
  const formStatus = document.getElementById('formStatus');

  const validators = {
    nome: (v) => v.trim().split(/\s+/).length >= 2 && v.trim().length >= 6 
      ? '' 
      : 'Informe seu nome e sobrenome.',
    telefone: (v) => v.replace(/\D/g, '').length >= 10 
      ? '' 
      : 'Informe um número com DDD (ex: 14 99999-9999).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) 
      ? '' 
      : 'Informe um e-mail válido.',
    tipo: (v) => v 
      ? '' 
      : 'Selecione o tipo de obra.'
  };

  function showFieldError(field, message) {
    const input = form.elements[field];
    const errorEl = form.querySelector(`.form-error[data-for="${field}"]`);
    if (message) {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      if (errorEl) errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      if (errorEl) errorEl.textContent = '';
    }
  }

  // Validação dinâmica: blur para ativar o erro, input para corrigir em tempo real
  Object.keys(validators).forEach(field => {
    const input = form.elements[field];
    if (!input) return;

    let hasBeenBlurred = false;

    input.addEventListener('blur', () => {
      hasBeenBlurred = true;
      showFieldError(field, validators[field](input.value));
    });

    input.addEventListener('input', () => {
      // Se o usuário já saiu do campo uma vez e gerou erro, valida em tempo real enquanto ele digita
      if (hasBeenBlurred || input.classList.contains('invalid')) {
        showFieldError(field, validators[field](input.value));
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;
    Object.keys(validators).forEach(field => {
      const input = form.elements[field];
      const message = validators[field](input.value);
      showFieldError(field, message);
      if (message) hasError = true;
    });

    if (hasError) {
      formStatus.textContent = 'Verifique os campos destacados antes de enviar.';
      formStatus.className = 'form-status error';
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';

    // Simulação do envio real
    setTimeout(() => {
      formStatus.textContent = 'Solicitação enviada! Entraremos em contato em breve.';
      formStatus.className = 'form-status success';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }, 1200);
  });

  /* ----------- filtro do portfólio ----------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projetos = document.querySelectorAll('.projeto-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Altera classe ativa do botão
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projetos.forEach(projeto => {
        const category = projeto.getAttribute('data-cat');
        
        if (filterValue === 'all' || category === filterValue) {
          projeto.classList.remove('hide');
          // Pequena animação de fade-in ao reexibir
          setTimeout(() => {
            projeto.style.opacity = '1';
            projeto.style.transform = 'scale(1)';
          }, 50);
        } else {
          projeto.style.opacity = '0';
          projeto.style.transform = 'scale(0.95)';
          // Aguarda a transição de fade antes de dar display: none
          setTimeout(() => {
            projeto.classList.add('hide');
          }, 300);
        }
      });
    });
  });

});
