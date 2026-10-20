// Scoped demonstration only. Configure a backend before collecting real submissions.
document.addEventListener('submit',e=>{const form=e.target.closest('[data-reference-form]');if(!form)return;e.preventDefault();const status=form.querySelector('[data-reference-status]');status.textContent='Briefing preparado nesta demonstração. Nenhum dado foi enviado.';});
