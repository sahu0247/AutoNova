/* Global interactivity for AutoNova site (final) */

// Modal (login/signup)
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const authClose = document.getElementById('authClose');
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if(loginBtn){
  loginBtn.addEventListener('click', ()=>{
    authModal.classList.remove('hidden');
    authModal.setAttribute('aria-hidden', 'false');
    showTab('login');
  });
}
if(authClose){
  authClose.addEventListener('click', ()=>{
    authModal.classList.add('hidden');
    authModal.setAttribute('aria-hidden', 'true');
  });
}
tabs.forEach(t=> t.addEventListener('click', ()=> showTab(t.dataset.tab)));

function showTab(name){
  tabs.forEach(x=> x.classList.remove('active'));
  document.querySelectorAll('[data-tab]').forEach(b=> {
    if(b.dataset.tab===name) b.classList.add('active');
  });
  if(name==='login'){
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

// Simple local auth (demo only) - stores user in localStorage
if(signupForm){
  signupForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const pass = document.getElementById('signupPassword').value;
    const users = JSON.parse(localStorage.getItem('autonova_users')||'{}');
    if(users[email]){
      alert('Account already exists for this email.');
      return;
    }
    users[email] = {name, pass};
    localStorage.setItem('autonova_users', JSON.stringify(users));
    alert('Account created. You may now login.');
    showTab('login');
  });
}

if(loginForm){
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('autonova_users')||'{}');
    if(users[email] && users[email].pass === pass){
      alert('Login successful. Welcome ' + (users[email].name||email) + '!');
      authModal.classList.add('hidden');
      // in a real app, you would set a proper session / token
    } else {
      alert('Invalid credentials.');
    }
  });
}

// Countdown timer (4 months)
(function(){
  const el = document.getElementById('countdown');
  if(!el) return;
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth()+4, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
  function refresh(){
    const diff = target - new Date();
    if(diff <= 0){ el.textContent = 'Product Launched!'; return; }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff/(1000*60*60)) % 24);
    const minutes = Math.floor((diff/(1000*60)) % 60);
    const seconds = Math.floor((diff/1000) % 60);
    el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  refresh();
  setInterval(refresh, 1000);
})();

// Product search (on products section)
(function(){
  const input = document.getElementById('productSearch');
  const globalSearch = document.getElementById('globalSearch');
  const cards = document.querySelectorAll('.product-card');
  function filter(q){
    const s = q.trim().toLowerCase();
    cards.forEach(c=> {
      const name = c.dataset.name.toLowerCase();
      c.style.display = name.includes(s) ? 'block' : 'none';
    });
  }
  if(input){
    input.addEventListener('input', (e)=> filter(e.target.value));
  }
  if(globalSearch){
    globalSearch.addEventListener('keyup', (e)=>{
      // If user presses enter on global search, jump to products and filter
      if(e.key === 'Enter'){
        const q = e.target.value;
        window.location.href = '#products';
        setTimeout(()=>{
          const prodInput = document.getElementById('productSearch');
          prodInput.value = q;
          prodInput.dispatchEvent(new Event('input'));
        }, 250);
      }
    });
  }
})();
