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

  /* ----------- scroll reveal ----------- */
  const revealTargets = document.querySelectorAll(
    '.servico-card, .projeto-item, .processo-step, .sobre-media, .sobre-content, .checklist li'
  );

  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // pequeno atraso escalonado para itens dentro do mesmo grid
          setTimeout(() => entry.target.classList.add('in-view'), i * 40);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ----------- validação do formulário de contato ----------- */
  const form = document.getElementById('contatoForm');
  const formStatus = document.getElementById('formStatus');

  const validators = {
    nome: (v) => v.trim().length >= 3 ? '' : 'Informe seu nome completo.',
    telefone: (v) => /^[\d\s()+-]{8,}$/.test(v.trim()) ? '' : 'Informe um telefone válido.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Informe um e-mail válido.',
    tipo: (v) => v ? '' : 'Selecione o tipo de obra.'
  };

  function showFieldError(field, message) {
    const input = form.elements[field];
    const errorEl = form.querySelector(`.form-error[data-for="${field}"]`);
    if (message) {
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
    }
  }

  Object.keys(validators).forEach(field => {
    const input = form.elements[field];
    if (!input) return;
    input.addEventListener('blur', () => {
      showFieldError(field, validators[field](input.value));
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

    // Aqui entraria a integração real (ex.: envio para um endpoint, EmailJS, etc.)
    // Por enquanto, simula o envio para fins de demonstração do site.
    const submitBtn = form.querySelector('.form-submit');

submitBtn.disabled = true;
submitBtn.textContent = 'Enviando...';

fetch('enviar.php', {
    method: 'POST',
    body: new FormData(form)
})
.then(response => response.json())
.then(data => {

    if(data.success){

        formStatus.textContent =
        'Solicitação enviada! Entraremos em contato em breve.';

        formStatus.className = 'form-status success';

        form.reset();

    }else{

        formStatus.textContent =
        data.message;

        formStatus.className = 'form-status error';

    }

})
.catch(() => {

    formStatus.textContent =
    'Erro ao enviar a solicitação.';

    formStatus.className = 'form-status error';

})
.finally(() => {

    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar solicitação';

});
  });

});
