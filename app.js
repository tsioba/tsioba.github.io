class Component extends DCLogic {
  state = {
    theme: this.props.theme || 'dark',
    palette: this.props.palette || 'aurora',
    page: this.props.startPage || 'home',
    activeProject: null,
    form: { name: '', email: '', message: '' },
    errors: {},
    modal: false,
    sending: false,
    formError: false,
    copied: null,
    cart: {},
    shopPage: 'browse',
    projClosing: false,
    modalClosing: false,
    seats: 9,
    booked: false,
    dateSel: null,
    calYear: 2026,
    calMonth: 5,
    photoSel: 1,
    boatStep: 0,
    selectedBoat: null,
    selectedTime: '09:00',
    boatTimeOpen: false,
    financePeriod: 'month',
    financeTab: 'overview',
    financeForm: { type: 'income', amount: '', label: '', cat: 'Tech' },
    financeAdded: false,
    financeTransactions: [
      { id:  1, type: 'income',  label: 'New Client Deposit',  cat: 'Freelance',  amount: 500,  date: '2026-06-15' },
      { id:  2, type: 'income',  label: 'Client Invoice #001', cat: 'Freelance',  amount: 2400, date: '2026-06-14' },
      { id:  3, type: 'expense', label: 'AWS Hosting',         cat: 'Tech',       amount: 89,   date: '2026-06-13' },
      { id:  4, type: 'income',  label: 'Consulting Session',  cat: 'Consulting', amount: 750,  date: '2026-06-12' },
      { id:  5, type: 'expense', label: 'Adobe CC',            cat: 'Software',   amount: 55,   date: '2026-06-11' },
      { id:  6, type: 'income',  label: 'Project Milestone',   cat: 'Freelance',  amount: 1800, date: '2026-06-08' },
      { id:  7, type: 'expense', label: 'Office Supplies',     cat: 'Office',     amount: 120,  date: '2026-06-05' },
      { id:  8, type: 'expense', label: 'GitHub Pro',          cat: 'Tech',       amount: 4,    date: '2026-06-01' },
      { id:  9, type: 'income',  label: 'SaaS License',        cat: 'Freelance',  amount: 960,  date: '2026-05-28' },
      { id: 10, type: 'expense', label: 'Domain Renewal',      cat: 'Tech',       amount: 15,   date: '2026-05-20' },
      { id: 11, type: 'income',  label: 'Training Workshop',   cat: 'Consulting', amount: 1200, date: '2026-05-15' },
      { id: 12, type: 'expense', label: 'Figma License',       cat: 'Software',   amount: 15,   date: '2026-04-22' },
      { id: 13, type: 'income',  label: 'App Development',     cat: 'Freelance',  amount: 3200, date: '2026-04-10' },
      { id: 14, type: 'expense', label: 'Cloud Storage',       cat: 'Tech',       amount: 25,   date: '2026-03-18' },
      { id: 15, type: 'income',  label: 'Design Contract',     cat: 'Freelance',  amount: 1500, date: '2026-03-05' },
      { id: 16, type: 'expense', label: 'Marketing Tools',     cat: 'Software',   amount: 89,   date: '2026-02-14' },
      { id: 17, type: 'income',  label: 'API Integration',     cat: 'Consulting', amount: 2100, date: '2026-02-01' },
      { id: 18, type: 'expense', label: 'Laptop Repair',       cat: 'Office',     amount: 180,  date: '2026-01-20' },
      { id: 19, type: 'income',  label: 'Yearly Retainer',     cat: 'Consulting', amount: 4800, date: '2026-01-05' },
    ],
    chatInput: '',
    chatTyping: false,
    chatMessages: [
      { id: 1, from: 'them', text: "Hey! Just checked your portfolio — love the work! 🔥", time: '14:32' },
      { id: 2, from: 'me',   text: "Thank you! Really glad you liked it 😊", time: '14:33' },
      { id: 3, from: 'them', text: "Would love to collaborate on something. Are you available?", time: '14:33' },
    ],
  };

  componentDidMount() {
    this.readAccent();
    this.initParticles();
    this._key = (e) => { if (e.key !== 'Escape') return; if (this.state.activeProject) this.closeProject(); else if (this.state.modal) this.closeModal(); };
    window.addEventListener('keydown', this._key);
    let _tx = 0, _ty = 0;
    this._touchStart = (e) => { _tx = e.touches[0].clientX; _ty = e.touches[0].clientY; };
    this._touchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - _tx;
      const dy = e.changedTouches[0].clientY - _ty;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
      if (this.state.activeProject || this.state.modal) return;
      const pages = ['home', 'projects', 'contact'];
      const idx = pages.indexOf(this.state.page);
      if (dx < 0 && idx < pages.length - 1) this.go(pages[idx + 1])();
      else if (dx > 0 && idx > 0) this.go(pages[idx - 1])();
    };
    window.addEventListener('touchstart', this._touchStart, { passive: true });
    window.addEventListener('touchend', this._touchEnd, { passive: true });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.palette !== this.state.palette) this.readAccent();
    if (prevState.page !== this.state.page) {
      const doScroll = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        try { document.querySelector('[data-app]').scrollTop = 0; } catch (_) {}
        try { document.querySelector('x-dc').scrollTop = 0; } catch (_) {}
      };
      doScroll();
      requestAnimationFrame(() => { requestAnimationFrame(doScroll); });
      setTimeout(doScroll, 100);
    }
  }
  componentWillUnmount() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._resize) window.removeEventListener('resize', this._resize);
    if (this._key) window.removeEventListener('keydown', this._key);
    if (this._touchStart) window.removeEventListener('touchstart', this._touchStart);
    if (this._touchEnd) window.removeEventListener('touchend', this._touchEnd);
    clearTimeout(this._ct);
    clearTimeout(this._pc);
    clearTimeout(this._mc);
    clearTimeout(this._fet);
    clearTimeout(this._fat);
    clearTimeout(this._chatT);
    clearTimeout(this._chatRT);
    clearInterval(this._boatInt);
  }

  hexToRgb(h) {
    if (!h) return null;
    h = h.trim().replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length < 6) return null;
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  readAccent() {
    const root = document.querySelector('[data-app]');
    if (!root) return;
    const cs = getComputedStyle(root);
    this._rgb1 = this.hexToRgb(cs.getPropertyValue('--a1')) || [16, 185, 129];
    this._rgb3 = this.hexToRgb(cs.getPropertyValue('--a3')) || [34, 211, 238];
  }

  initParticles() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };
    resize();
    window.addEventListener('resize', resize);
    this._resize = resize;
    const N = window.innerWidth < 700 ? 42 : 84;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35 * dpr, vy: (Math.random() - 0.5) * 0.35 * dpr,
      r: (Math.random() * 1.6 + 0.6) * dpr,
    }));
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const light = this.state.theme === 'light';
      const c1 = this._rgb1 || [16, 185, 129];
      const c3 = this._rgb3 || [34, 211, 238];
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      const max = 140 * dpr;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            const al = (1 - d / max) * (light ? 0.14 : 0.2);
            ctx.strokeStyle = 'rgba(' + c3[0] + ',' + c3[1] + ',' + c3[2] + ',' + al + ')';
            ctx.lineWidth = dpr * 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = 'rgba(' + c1[0] + ',' + c1[1] + ',' + c1[2] + ',' + (light ? 0.5 : 0.72) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      this._raf = requestAnimationFrame(loop);
    };
    loop();
  }

  toggleTheme = () => this.setState((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' }));
  cyclePalette = () => {
    const order = ['aurora', 'ember', 'champagne', 'crimson'];
    this.setState((s) => ({ palette: order[(order.indexOf(s.palette) + 1) % order.length] }));
  };
  go = (page) => () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    this.setState({ page });
  };

  tilt = (e) => {
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    c.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 9).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 11).toFixed(2) + 'deg) translateY(-6px)';
    const sh = c.querySelector('[data-shine]');
    if (sh) sh.style.background = 'radial-gradient(circle at ' + (px * 100).toFixed(1) + '% ' + (py * 100).toFixed(1) + '%, rgba(255,255,255,0.16), transparent 55%)';
  };
  untilt = (e) => {
    const c = e.currentTarget;
    c.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    const sh = c.querySelector('[data-shine]');
    if (sh) sh.style.background = 'transparent';
  };

  heroParallax = (e) => {
    const el = document.getElementById('hero-name');
    if (!el) return;
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    el.style.transform = 'perspective(800px) rotateX(' + ((cy - e.clientY) / cy * 5).toFixed(2) + 'deg) rotateY(' + ((e.clientX - cx) / cx * 7).toFixed(2) + 'deg)';
  };
  heroReset = () => {
    const el = document.getElementById('hero-name');
    if (el) el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
  };
  toggleBoatTime = () => this.setState((s) => ({ boatTimeOpen: !s.boatTimeOpen }));
  getBaseSeats(year, month, day, timeStr) {
    const ti = ['09:00','12:00','15:00','18:00'].indexOf(timeStr);
    const v = (year % 100) * 7 + (month + 1) * 13 + day * 17 + (ti + 1) * 11;
    return (v % 13) + 2;
  }
  prevCalMonth = () => this.setState((s) => { let m = s.calMonth - 1, y = s.calYear; if (m < 0) { m = 11; y--; } return { calMonth: m, calYear: y }; });
  nextCalMonth = () => this.setState((s) => { let m = s.calMonth + 1, y = s.calYear; if (m > 11) { m = 0; y++; } return { calMonth: m, calYear: y }; });

  openProject = (p) => {
    clearInterval(this._boatInt);
    clearTimeout(this._pc);
    document.body.style.overflow = 'hidden';
    const now = new Date(); const ty = now.getFullYear(), tm = now.getMonth(), td = now.getDate();
    this.setState({ activeProject: p, projClosing: false, cart: {}, shopPage: 'browse', seats: this.getBaseSeats(ty, tm, td, '09:00'), booked: false, dateSel: { year: ty, month: tm, day: td }, calYear: ty, calMonth: tm, photoSel: 1, boatStep: 0, selectedBoat: null, selectedTime: '09:00', boatTimeOpen: false, financeTab: 'overview' });
  };
  closeProject = () => {
    if (this.state.projClosing) return;
    this.setState({ projClosing: true });
    clearTimeout(this._pc);
    this._pc = setTimeout(() => {
      clearInterval(this._boatInt);
      document.body.style.overflow = '';
      this.setState({ activeProject: null, projClosing: false, cart: {}, shopPage: 'browse' });
    }, 330);
  };
  closeModal = () => {
    if (this.state.modalClosing) return;
    this.setState({ modalClosing: true });
    clearTimeout(this._mc);
    this._mc = setTimeout(() => this.setState({ modal: false, modalClosing: false }), 320);
  };

  addItem = (id) => () => this.setState((st) => ({ cart: { ...st.cart, [id]: (st.cart[id] || 0) + 1 } }));
  decItem = (id) => () => this.setState((st) => {
    const n = (st.cart[id] || 0) - 1;
    const c = { ...st.cart };
    if (n <= 0) delete c[id]; else c[id] = n;
    return { cart: c };
  });
  openCart = () => {
    if (Object.values(this.state.cart).reduce((a, b) => a + b, 0) > 0) this.setState({ shopPage: 'cart' });
  };
  goBackToBrowse = () => this.setState({ shopPage: 'browse' });
  checkout = () => this.setState({ shopPage: 'done' });
  continueShopping = () => this.setState({ shopPage: 'browse', cart: {} });
  stop = (e) => e.stopPropagation();

  setField = (k) => (e) => {
    const v = e.target.value;
    this.setState((s) => ({ form: { ...s.form, [k]: v }, errors: { ...s.errors, [k]: undefined } }));
  };
  validate() {
    const f = this.state.form;
    const er = {};
    if (!f.name.trim()) er.name = 'Please enter your name';
    if (!f.email.trim()) er.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) er.email = "That doesn't look like a valid email";
    if (!f.message.trim()) er.message = 'Please write a short message';
    return er;
  }
  submit = (e) => {
    e.preventDefault();
    if (this.state.sending) return;
    const er = this.validate();
    if (Object.keys(er).length) { this.setState({ errors: er }); return; }
    const f = this.state.form;
    this.setState({ sending: true, formError: false });
    const params = { user_name: f.name, user_email: f.email, message: f.message };
    Promise.all([
      emailjs.send('service_53keozf', 'template_j0jxj9v', params),
      emailjs.send('service_53keozf', 'template_svik4jl', params),
    ])
      .then(() => {
        this.setState({ modal: true, sending: false, form: { name: '', email: '', message: '' }, errors: {} });
      })
      .catch(() => {
        this.setState({ sending: false, formError: true });
        clearTimeout(this._fet);
        this._fet = setTimeout(() => this.setState({ formError: false }), 4000);
      });
  };

  copy = (text, name) => () => {
    try { navigator.clipboard.writeText(text); } catch (_) {}
    this.setState({ copied: name });
    clearTimeout(this._ct);
    this._ct = setTimeout(() => this.setState({ copied: null }), 1700);
  };

  dockStyle(active) {
    const base = 'width:56px;height:48px;border-radius:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;transition:all .35s cubic-bezier(.22,1,.36,1);';
    if (active) return base + 'background:linear-gradient(135deg,var(--a1),var(--a2));color:#fff;transform:translateY(-4px);box-shadow:0 12px 26px color-mix(in srgb, var(--a2) 48%, transparent);';
    return base + 'background:transparent;color:var(--muted);transform:none;box-shadow:none;';
  }

  filterFinanceTx(txs, period) {
    const today = new Date(2026, 5, 15);
    return txs.filter(tx => {
      const p = tx.date.split('-').map(Number);
      const d = new Date(p[0], p[1] - 1, p[2]);
      const diffDays = (today - d) / 86400000;
      if (period === 'today') return diffDays >= 0 && diffDays < 1;
      if (period === 'week') return diffDays >= 0 && diffDays <= 7;
      if (period === 'month') return diffDays >= 0 && diffDays <= 30;
      return diffDays >= 0 && diffDays <= 365;
    });
  }
  setFinancePeriod = (p) => () => this.setState({ financePeriod: p });
  setFinanceTab = (t) => () => this.setState({ financeTab: t });
  setFinanceFormType = (t) => () => this.setState((s) => ({ financeForm: { ...s.financeForm, type: t } }));
  onFinanceAmount = (e) => { const v = e.target.value; this.setState((s) => ({ financeForm: { ...s.financeForm, amount: v } })); };
  onFinanceLabel = (e) => { const v = e.target.value; this.setState((s) => ({ financeForm: { ...s.financeForm, label: v } })); };
  setFinanceCat = (c) => () => this.setState((s) => ({ financeForm: { ...s.financeForm, cat: c } }));
  removeFinanceTx = (id) => () => this.setState((s) => ({ financeTransactions: s.financeTransactions.filter(t => t.id !== id) }));
  addFinanceTx = () => {
    const f = this.state.financeForm;
    const amt = parseFloat(f.amount);
    if (!f.label.trim() || isNaN(amt) || amt <= 0) return;
    this.setState((s) => ({
      financeTransactions: [{ id: Date.now(), type: f.type, label: f.label.trim(), cat: f.cat, amount: amt, date: (() => { const n = new Date(); return n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-' + String(n.getDate()).padStart(2,'0'); })() }, ...s.financeTransactions],
      financeForm: { type: 'income', amount: '', label: '', cat: 'Tech' },
      financeTab: 'overview',
      financeAdded: true,
    }));
    clearTimeout(this._fat);
    this._fat = setTimeout(() => this.setState({ financeAdded: false }), 2500);
  };

  getChatReply = (msg) => {
    const m = msg.toLowerCase();
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    if (/\b(hi|hello|hey|heya|sup|hiya)\b/.test(m))
      return pick(["Hey! 👋 Loving the portfolio!", "Hey! Great to connect 😊", "Hi! Your work is seriously impressive!"]);
    if (/collab|collaborate|work together|team up|join forces/.test(m))
      return pick(["Absolutely, let's make something awesome! 🔥", "100% in — what kind of project are you thinking?", "Yes! Send me the details and let's get started 💪", "Love it — I'm ready when you are 🚀"]);
    if (/\b(hire|job|freelance|rate|price|cost|budget|pay|fee)\b/.test(m))
      return pick(["Let's discuss — what's the scope of the project?", "Happy to talk rates! DM me the project details 📩", "Sounds interesting — what's the timeline and stack?"]);
    if (/\b(react|spring|java|websocket|mysql|kafka|node|api|backend|frontend|fullstack|code|tech|stack|typescript|docker)\b/.test(m))
      return pick(["Nice stack! 👌 React + Spring Boot is seriously solid.", "Love the tech choices — very production-ready!", "That's exactly the kind of setup I enjoy working with!"]);
    if (/\b(meet|call|zoom|talk|schedule|available|free|busy|when|sync)\b/.test(m))
      return pick(["I'm flexible! Drop your availability and we'll sync 📅", "Let's set something up — when works for you?", "Always down for a quick call — just say when ☎️"]);
    if (/\b(project|portfolio|app|site|build|built|made|created|demo)\b/.test(m))
      return pick(["The demos are super clean — great attention to detail! 🎯", "Love how interactive everything is 🔥", "The projects show real production thinking — impressed!"]);
    if (/\b(nice|great|love|awesome|cool|sick|fire|amazing|incredible|good|wow|impressive)\b/.test(m))
      return pick(["Thanks, that means a lot! 🙏", "Appreciate it! Took a lot of iterations to get right 😄", "That honestly made my day — thank you ✨"]);
    if (/\?/.test(m))
      return pick(["Good question! 🤔 Tell me more about what you have in mind.", "Hmm, depends on the context — what are you thinking?", "Interesting! What's the use case?", "Great point — let's dig into it 👀"]);
    return pick(["That sounds great! 🚀", "Absolutely, let's do it! 💪", "Love the energy! 🔥", "Let's make it happen 🎉", "Noted — what's the next step?", "Can't wait to see where this goes ⚡"]);
  };

  scrollChatToBottom = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector('[data-chat-msgs]');
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  onChatInput = (e) => this.setState({ chatInput: e.target.value });
  onChatKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendChatMsg(); } };
  sendChatMsg = () => {
    const text = (this.state.chatInput || '').trim();
    if (!text) return;
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { id: Date.now(), from: 'me', text, time: t };
    this.setState({ chatInput: '', chatMessages: [...this.state.chatMessages, msg] });
    this.scrollChatToBottom();
    clearTimeout(this._chatT); clearTimeout(this._chatRT);
    this._chatT = setTimeout(() => { this.setState({ chatTyping: true }); this.scrollChatToBottom(); }, 500);
    this._chatRT = setTimeout(() => {
      const t2 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const reply = { id: Date.now() + 1, from: 'them', text: this.getChatReply(text), time: t2 };
      this.setState({ chatTyping: false, chatMessages: [...this.state.chatMessages, reply] });
      this.scrollChatToBottom();
    }, 1400 + Math.random() * 800);
  };

  renderVals() {
    const s = this.state;
    const rawProjects = [
      { id: 'eshop', title: 'E-commerce App', blurb: 'A full-stack online store built with React and Java Spring Boot — product catalog, cart and checkout in one fast, mobile-first experience.', tags: ['React', 'Java', 'Spring Boot', 'MySQL'], detail: 'A full-stack e-commerce platform with a React frontend and a Java Spring Boot REST API. Customers browse the catalog, manage their cart and complete purchases in a few taps. Data is stored in MySQL for reliable product and order management. Designed mobile-first and easy to theme for any brand.' },
      { id: 'coffee', title: 'Coffee Shop App', blurb: 'A React Native app for a local coffee shop — browse the menu, customise your order and collect loyalty rewards.', tags: ['React Native', 'Expo', 'JavaScript'], detail: 'A cross-platform mobile app for a neighbourhood coffee shop. Customers build their drink, save favourites, track loyalty points and reorder in two taps. Designed mobile-first with warm, friendly motion and offline-friendly menu caching.' },
      { id: 'boat', title: 'Boat Booking App', blurb: 'A boat reservation system built with React and Java. The system updates dynamically with real-time changes, allowing users to seamlessly navigate through the entire booking workflow.', tags: ['React', 'Java', 'Spring Boot', 'Kafka'], detail: 'A boat reservation system built with React and Java. The system updates dynamically with real-time changes, allowing users to seamlessly navigate through the entire booking workflow. Experience a modern, intuitive interface that demonstrates how technology streamlines the process of reserving vessels with precision and elegance.' },
      { id: 'finance', title: 'Business Finance Tracker', blurb: 'A business finance dashboard to track income, expenses and net profit in real time — with interactive charts, transaction logging and category breakdowns.', tags: ['React', 'Spring Boot', 'Chart.js', 'MySQL'], detail: 'A business finance tracker built with React and Java Spring Boot. Features KPI cards for total income, expenses and net profit, a form for logging transactions by category, an interactive bar chart showing monthly trends, and a donut chart for expense breakdown. Designed for freelancers and small businesses who need clarity on cash flow at a glance.' },
      { id: 'photo', title: 'Landing Page', blurb: 'The landing page for our company. Built with HTML, CSS, and JavaScript with interactive elements that engage visitors immediately and create an immersive first impression.', tags: ['JavaScript', 'CSS', 'HTML'], detail: 'A fully responsive landing page built with HTML, CSS, and JavaScript. Features smooth animations, responsive design principles, and user-centric interactive components that create an immersive first impression. Optimised for performance with zero dependencies.' },
      { id: 'chat', title: 'Real-Time Chat App', blurb: 'A full-stack messaging app with real-time WebSocket communication — private rooms, live typing indicators and instant message delivery.', tags: ['React', 'Spring Boot', 'WebSocket', 'MySQL'], detail: 'A real-time chat application built with React and Java Spring Boot. Uses WebSocket (STOMP over SockJS) for instant message delivery across private and group rooms. Features live typing indicators, online presence badges, message timestamps and persistent conversation history backed by MySQL. Designed for speed and clarity.' },
    ];
    const projects = rawProjects.map((p) => ({
      ...p,
      isEshop: p.id === 'eshop', isCoffee: p.id === 'coffee', isBoat: p.id === 'boat', isFinance: p.id === 'finance', isPhoto: p.id === 'photo', isChat: p.id === 'chat',
      open: () => this.openProject(p),
    }));

    const rawSocials = [
      { name: 'GitHub', glyph: 'GH', handle: 'github.com/tsioba', href: 'https://github.com/tsioba' },
      { name: 'Instagram', glyph: 'IG', handle: '@tsioba_', href: 'https://www.instagram.com/tsioba_/' },
      { name: 'LinkedIn', glyph: 'in', handle: 'in/giannis-tsioympanoydis', href: 'https://www.linkedin.com/in/giannis-tsioympanoydis/' },
      { name: 'Facebook', glyph: 'Fb', handle: '/giannis.ts10', href: 'https://www.facebook.com/giannis.ts10/' },
    ];
    const socials = rawSocials.map((so) => ({ ...so, copy: this.copy(so.href, so.name) }));

    const ap0 = s.activeProject;
    const eshopCatalog = [
      { id: 'hood', name: 'Hoodie',   price: 79,  iconColor: '#f59e0b', bgGrad: 'linear-gradient(135deg,rgba(245,158,11,0.22),rgba(239,68,68,0.14))' },
      { id: 'snkr', name: 'Sneakers', price: 149, iconColor: '#d4a574', bgGrad: 'linear-gradient(135deg,rgba(212,165,116,0.22),rgba(146,64,14,0.14))' },
      { id: 'bag',  name: 'Backpack', price: 58,  iconColor: '#86efac', bgGrad: 'linear-gradient(135deg,rgba(134,239,172,0.22),rgba(22,163,74,0.14))' },
      { id: 'wtch', name: 'Watch',    price: 112, iconColor: '#c4b5fd', bgGrad: 'linear-gradient(135deg,rgba(196,181,253,0.22),rgba(109,40,217,0.14))' },
    ];
    const coffeeCatalog = [
      { id: 'esp',    name: 'Espresso',          price: 2.0 },
      { id: 'cap',    name: 'Cappuccino',         price: 3.2 },
      { id: 'fred_e', name: 'Fredo Espresso',     price: 3.6 },
      { id: 'fred_c', name: 'Fredo Cappuccino',   price: 3.8 },
      { id: 'moc',    name: 'Mocha',              price: 4.0 },
    ];
    const isCoffeeShop = !!ap0 && ap0.id === 'coffee';
    const isShop = !!ap0 && (ap0.id === 'eshop' || ap0.id === 'coffee');
    const catalog = ap0 && ap0.id === 'eshop' ? eshopCatalog : (isCoffeeShop ? coffeeCatalog : []);
    const productSvgs = {
      hood: React.createElement('svg',{width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('path',{d:'M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z'})),
      snkr: React.createElement('svg',{width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('path',{d:'M2 16.5C2 14.5 4 12.5 7.5 12L12 11l3-.5C17.5 10 21 11.5 21 14v.5c0 1.5-1 2-3 2H5c-2.5 0-3-.5-3-1.5z'}),React.createElement('path',{d:'M2 17.5h20'}),React.createElement('path',{d:'M7.5 12l.3 4.5'}),React.createElement('path',{d:'M12 11l.3 5.5'})),
      bag: React.createElement('svg',{width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('path',{d:'M9 2a3 3 0 0 1 6 0v3H9V2z'}),React.createElement('rect',{x:'4',y:'5',width:'16',height:'15',rx:'3'}),React.createElement('rect',{x:'8',y:'11',width:'8',height:'6',rx:'1.5'}),React.createElement('path',{d:'M12 2v4'})),
      wtch: React.createElement('svg',{width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('circle',{cx:'12',cy:'13',r:'6'}),React.createElement('path',{d:'M12 10.5v2.5l1.5 1.5'}),React.createElement('path',{d:'M10 4h4'}),React.createElement('path',{d:'M10 22h4'})),
    };
    const shopItems = catalog.map((p) => {
      const count = s.cart[p.id] || 0;
      const thumbEl = isCoffeeShop ? null : React.createElement('span',{
        style:{width:'46px',height:'46px',flexShrink:0,borderRadius:'13px',display:'flex',alignItems:'center',justifyContent:'center',background:p.bgGrad||'var(--glass)',border:'1px solid var(--glass-border)',color:p.iconColor||'var(--a3)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 12px rgba(0,0,0,0.2)'}
      }, productSvgs[p.id]);
      return {
        id: p.id, name: p.name, priceLabel: '€' + p.price.toFixed(2),
        count, isEmpty: count === 0, hasItems: count > 0,
        isCoffee: isCoffeeShop, isProduct: !isCoffeeShop,
        thumbEl,
        add: this.addItem(p.id), inc: this.addItem(p.id), dec: this.decItem(p.id),
      };
    });
    const cartLines = catalog.filter((p) => s.cart[p.id]).map((p) => ({
      name: p.name, count: s.cart[p.id], lineLabel: '€' + (p.price * s.cart[p.id]).toFixed(2),
      inc: this.addItem(p.id), dec: this.decItem(p.id),
    }));
    const cartCount = catalog.reduce((n, p) => n + (s.cart[p.id] || 0), 0);
    const cartTotal = catalog.reduce((t, p) => t + p.price * (s.cart[p.id] || 0), 0);
    const cartCountLabel = cartCount + (cartCount === 1 ? ' item' : ' items');
    const viewCartBase = "margin-top:4px;width:100%;padding:13px;border-radius:13px;font-family:'Manrope',sans-serif;font-weight:600;font-size:14.5px;display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .3s var(--ease),box-shadow .3s var(--ease);";
    const viewCartStyle = cartCount
      ? viewCartBase + 'border:none;color:#fff;background:linear-gradient(110deg,var(--a1),var(--a2));box-shadow:0 12px 30px color-mix(in srgb,var(--a2) 38%,transparent);cursor:pointer;'
      : viewCartBase + 'border:1px dashed var(--glass-border);color:var(--muted);background:var(--glass);cursor:default;';
    const viewCartLabel = cartCount ? 'View cart · ' + cartCountLabel + ' · €' + cartTotal.toFixed(2) : 'Your cart is empty';

    const rawBoats = [
      { id: 'pos', name: 'Poseidon',    type: 'Classic Yacht',  cap: '12 guests' },
      { id: 'hel', name: 'Helios',      type: 'Speedboat',      cap: '6 guests'  },
      { id: 'aeg', name: 'Aegean Star', type: 'Catamaran',      cap: '10 guests' },
      { id: 'oly', name: 'Olympus',     type: 'Sailing Boat',   cap: '8 guests'  },
    ];
    const boatList = rawBoats.map((b) => ({
      ...b,
      pick: () => this.setState({ selectedBoat: b, boatStep: 1 }),
      style: 'display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:13px;cursor:pointer;transition:all .25s var(--ease);border:1px solid ' + (s.selectedBoat && s.selectedBoat.id === b.id ? 'var(--a3);background:color-mix(in srgb,var(--a3) 12%,var(--glass));' : 'var(--glass-border);background:var(--glass);'),
    }));

    const boatTimeList = ['09:00', '12:00', '15:00', '18:00'];
    const boatTimes = boatTimeList.map((t, i) => ({
      label: t,
      pick: () => { const d = s.dateSel; const ns = d ? this.getBaseSeats(d.year, d.month, d.day, t) : s.seats; this.setState({ selectedTime: t, boatTimeOpen: false, seats: ns }); },
      style: 'padding:9px 16px;border-radius:11px;font-family:JetBrains Mono,monospace;font-size:12px;cursor:pointer;transition:all .3s cubic-bezier(.22,1,.36,1);' + (s.selectedTime === t ? 'border:none;background:linear-gradient(110deg,var(--a1),var(--a2));color:#fff;' : 'border:1px solid var(--glass-border);background:var(--glass);color:var(--muted);'),
      dropStyle: 'padding:11px 14px;font-family:JetBrains Mono,monospace;font-size:13px;cursor:pointer;display:block;transition:background .15s;' + (s.selectedTime === t ? 'background:color-mix(in srgb,var(--a1) 14%,transparent);color:var(--text);font-weight:700;' : 'background:transparent;color:var(--text);') + (i < boatTimeList.length - 1 ? 'border-bottom:1px solid var(--glass-border);' : ''),
    }));
    const _tod = new Date(); const todayY = _tod.getFullYear(), todayM = _tod.getMonth(), todayD = _tod.getDate();
    const calY = s.calYear, calM = s.calMonth;
    const calFirstDow = (new Date(calY, calM, 1).getDay() + 6) % 7;
    const calDaysInMonth = new Date(calY, calM + 1, 0).getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const canGoPrev = calY > todayY || (calY === todayY && calM > todayM);
    const dayBase = 'display:flex;align-items:center;justify-content:center;height:28px;border-radius:8px;font-size:11px;border:none;padding:0;';
    const calDays = [];
    for (let i = 0; i < calFirstDow; i++) calDays.push({ dayLabel: '', pick: () => {}, style: dayBase + 'background:transparent;visibility:hidden;' });
    for (let d = 1; d <= calDaysInMonth; d++) {
      const past = (calY < todayY) || (calY === todayY && calM < todayM) || (calY === todayY && calM === todayM && d < todayD);
      const isToday = calY === todayY && calM === todayM && d === todayD;
      const isSel = s.dateSel && s.dateSel.year === calY && s.dateSel.month === calM && s.dateSel.day === d;
      let ds;
      if (past) ds = dayBase + 'background:transparent;opacity:.3;color:var(--muted);cursor:default;font-weight:400;';
      else if (isSel) ds = dayBase + 'background:linear-gradient(135deg,var(--a1),var(--a2));color:#fff;font-weight:700;box-shadow:0 4px 10px color-mix(in srgb,var(--a2) 35%,transparent);cursor:pointer;';
      else if (isToday) ds = dayBase + 'background:transparent;border:1.5px solid var(--a3);color:var(--a3);font-weight:600;cursor:pointer;';
      else ds = dayBase + 'background:transparent;color:var(--text);font-weight:500;cursor:pointer;';
      const dd = d;
      calDays.push({ dayLabel: String(d), style: ds, pick: past ? () => {} : () => { const ns = this.getBaseSeats(calY, calM, dd, this.state.selectedTime); this.setState({ dateSel: { year: calY, month: calM, day: dd }, seats: ns }); } });
    }

    const selRow = 'display:flex;justify-content:space-between;padding:10px 12px;border-radius:11px;background:var(--glass);border:1px solid var(--glass-border);animation:rowIn .3s var(--ease) both;';

    const photoGrads = [
      'linear-gradient(135deg, oklch(0.72 0.09 60), oklch(0.45 0.06 50))',
      'linear-gradient(135deg, oklch(0.68 0.09 230), oklch(0.4 0.07 250))',
      'linear-gradient(135deg, oklch(0.7 0.1 140), oklch(0.42 0.07 160))',
      'linear-gradient(135deg, oklch(0.75 0.07 20), oklch(0.5 0.08 350))',
      'linear-gradient(135deg, oklch(0.8 0.05 90), oklch(0.55 0.05 70))',
      'linear-gradient(135deg, oklch(0.6 0.03 270), oklch(0.35 0.03 280))',
    ];
    const photos = photoGrads.map((g, i) => ({
      pick: () => this.setState({ photoSel: i }),
      style: 'height:36px;border-radius:9px;cursor:pointer;background:' + g + ';transition:transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s;border:' + (s.photoSel === i ? '2px solid var(--a3)' : '1px solid var(--glass-border)') + ';' + (s.photoSel === i ? 'transform:scale(1.1);box-shadow:0 6px 16px rgba(0,0,0,.3);' : ''),
    }));

    const landingBase = 'cursor:pointer;border-radius:10px;transition:all .25s var(--ease);';
    const landingNavStyle = landingBase + 'display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border:1px solid ' + (s.photoSel === 0 ? 'var(--a3)' : 'var(--glass-border)') + ';background:' + (s.photoSel === 0 ? 'color-mix(in srgb,var(--a3) 10%,var(--glass-strong))' : 'var(--glass-strong)') + ';';
    const landingHeroStyle = landingBase + 'padding:14px;border:1px solid ' + (s.photoSel === 1 ? 'var(--a3)' : 'var(--glass-border)') + ';background:linear-gradient(135deg,' + (s.photoSel === 1 ? 'color-mix(in srgb,var(--a1) 22%,transparent),color-mix(in srgb,var(--a3) 18%,transparent)' : 'color-mix(in srgb,var(--text) 6%,transparent),color-mix(in srgb,var(--text) 3%,transparent)') + ');';
    const landingCard1Style = landingBase + 'padding:10px;border:1px solid ' + (s.photoSel === 2 ? 'var(--a3)' : 'var(--glass-border)') + ';background:' + (s.photoSel === 2 ? 'color-mix(in srgb,var(--a1) 12%,var(--glass))' : 'var(--glass)') + ';';
    const landingCard2Style = landingBase + 'padding:10px;border:1px solid ' + (s.photoSel === 3 ? 'var(--a3)' : 'var(--glass-border)') + ';background:' + (s.photoSel === 3 ? 'color-mix(in srgb,var(--a2) 12%,var(--glass))' : 'var(--glass)') + ';';
    const landingCard3Style = landingBase + 'padding:10px;border:1px solid ' + (s.photoSel === 4 ? 'var(--a3)' : 'var(--glass-border)') + ';background:' + (s.photoSel === 4 ? 'color-mix(in srgb,var(--a3) 12%,var(--glass))' : 'var(--glass)') + ';';

    // ── Finance tracker ─────────────────────────────────────────────
    const filteredFin = this.filterFinanceTx(s.financeTransactions, s.financePeriod);
    const totalIncome  = filteredFin.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const totalExpenses = filteredFin.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const fpStyle = (p) => `padding:5px 12px;border-radius:999px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;cursor:pointer;border:none;font-weight:600;transition:all .2s var(--ease);${s.financePeriod === p ? 'background:linear-gradient(110deg,var(--a1),var(--a2));color:#fff;box-shadow:0 4px 12px color-mix(in srgb,var(--a2) 35%,transparent);' : 'background:var(--glass-strong);color:var(--muted);border:1px solid var(--glass-border);'}`;

    const mLabels = ['Jan','Feb','Mar','Apr','May','Jun'];
    const monthlyRaw = [0,1,2,3,4,5].map(mi => {
      const txs = s.financeTransactions.filter(tx => { const d = new Date(tx.date); return d.getFullYear() === 2026 && d.getMonth() === mi; });
      return { label: mLabels[mi], inc: txs.filter(t => t.type === 'income').reduce((a,t)=>a+t.amount,0), exp: txs.filter(t => t.type === 'expense').reduce((a,t)=>a+t.amount,0) };
    });
    const maxBar = Math.max(...monthlyRaw.map(m => Math.max(m.inc, m.exp)), 1);
    const chartMonths = monthlyRaw.map(m => ({
      label: m.label,
      incStyle: `flex:1;border-radius:3px 3px 0 0;min-height:2px;background:linear-gradient(180deg,var(--a1),color-mix(in srgb,var(--a1) 40%,transparent));height:${Math.round(m.inc/maxBar*100)}%;`,
      expStyle: `flex:1;border-radius:3px 3px 0 0;min-height:2px;background:linear-gradient(180deg,#ef4444,color-mix(in srgb,#ef4444 40%,transparent));height:${Math.round(m.exp/maxBar*100)}%;`,
    }));

    const expCatColors = { Tech:'#10b981', Software:'#22d3ee', Office:'#a78bfa', Consulting:'#f59e0b', Freelance:'#f97316', Other:'#6b7280' };
    const expCatMap = {};
    filteredFin.filter(t => t.type === 'expense').forEach(t => { expCatMap[t.cat] = (expCatMap[t.cat] || 0) + t.amount; });
    const circum = 2 * Math.PI * 30;
    let ofLen = 0;
    const pieSVGSlices = Object.entries(expCatMap).map(([cat, amt]) => {
      const dash = totalExpenses > 0 ? (amt / totalExpenses) * circum : 0;
      const el = React.createElement('circle', { key: cat, cx:'40', cy:'40', r:'30', fill:'none', stroke: expCatColors[cat]||'#6b7280', strokeWidth:'14', strokeDasharray:`${dash.toFixed(1)} ${circum.toFixed(1)}`, strokeDashoffset:`${(-ofLen).toFixed(1)}` });
      ofLen += dash;
      return el;
    });
    const pieChartEl = React.createElement('svg', { viewBox:'0 0 80 80', style:{ transform:'rotate(-90deg)', display:'block', width:'100%', height:'100%' } },
      React.createElement('circle', { cx:'40', cy:'40', r:'30', fill:'none', stroke:'rgba(255,255,255,0.06)', strokeWidth:'14' }),
      ...pieSVGSlices
    );
    const pieLegend = Object.entries(expCatMap).map(([cat, amt]) => ({
      cat, dotStyle: `width:7px;height:7px;border-radius:50%;flex:none;background:${expCatColors[cat]||'#6b7280'};`,
      pct: totalExpenses > 0 ? Math.round(amt/totalExpenses*100) + '%' : '0%',
      amtLbl: '€' + amt,
    }));

    const recentTxs = [...filteredFin]
      .sort((a,b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(tx => ({
        ...tx,
        amtLbl: (tx.type==='income' ? '+' : '−') + '€' + tx.amount,
        dateLbl: tx.date.slice(5).replace('-','/'),
        isIncome: tx.type === 'income',
        isExpense: tx.type === 'expense',
        amtStyle: `font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:${tx.type==='income' ? '#10b981' : '#ef4444'};white-space:nowrap;`,
        iconEl: React.createElement('span',
          { style: { width:'22px', height:'22px', borderRadius:'6px', background: tx.type==='income' ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flex:'none' } },
          React.createElement('svg', { width:'10', height:'10', viewBox:'0 0 24 24', fill:'none', stroke: tx.type==='income' ? '#10b981' : '#ef4444', strokeWidth:'3', strokeLinecap:'round', strokeLinejoin:'round' },
            React.createElement('polyline', { points: tx.type==='income' ? '18 15 12 9 6 15' : '6 9 12 15 18 9' })
          )
        ),
        remove: this.removeFinanceTx(tx.id),
      }));

    const finCats = ['Tech','Software','Office','Consulting','Freelance','Other'];
    const financeCatPills = finCats.map(c => ({
      label: c,
      pick: this.setFinanceCat(c),
      style: `padding:5px 11px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;${s.financeForm.cat===c ? 'background:linear-gradient(110deg,var(--a1),var(--a2));color:#fff;border:none;' : 'background:var(--glass-strong);color:var(--muted);border:1px solid var(--glass-border);'}`,
    }));

    const finTypeIncomeStyle = `flex:1;padding:8px;border-radius:9px;border:none;font-family:'Manrope',sans-serif;font-weight:${s.financeForm.type==='income'?'700':'500'};font-size:13px;${s.financeForm.type==='income'?'background:linear-gradient(110deg,#10b981,#059669);color:#fff;':'background:transparent;color:var(--muted);'}cursor:pointer;transition:all .2s;`;
    const finTypeExpenseStyle = `flex:1;padding:8px;border-radius:9px;border:none;font-family:'Manrope',sans-serif;font-weight:${s.financeForm.type==='expense'?'700':'500'};font-size:13px;${s.financeForm.type==='expense'?'background:linear-gradient(110deg,#ef4444,#dc2626);color:#fff;':'background:transparent;color:var(--muted);'}cursor:pointer;transition:all .2s;`;
    const finNetStyle = `font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(13px,2.5vw,17px);color:${netProfit>=0?'var(--a3)':'#ef4444'};letter-spacing:-0.02em;`;

    const page = s.page;
    const ap = s.activeProject;
    return {
      theme: s.theme,
      palette: s.palette,
      isDark: s.theme === 'dark',
      isLight: s.theme === 'light',
      toggleTheme: this.toggleTheme,
      cyclePalette: this.cyclePalette,
      isHome: page === 'home',
      isProjects: page === 'projects',
      isContact: page === 'contact',
      goHome: this.go('home'),
      goProjects: this.go('projects'),
      goContact: this.go('contact'),
      homeStyle: this.dockStyle(page === 'home'),
      projStyle: this.dockStyle(page === 'projects'),
      contactStyle: this.dockStyle(page === 'contact'),
      projects,
      techs: ['React', 'React Native', 'Spring Boot', 'Kafka', 'JavaScript', 'CSS', 'PWA'],
      ghHref: 'https://github.com/tsioba',
      igHref: 'https://www.instagram.com/tsioba_/',
      liHref: 'https://www.linkedin.com/in/giannis-tsioympanoydis/',
      fbHref: 'https://www.facebook.com/giannis.ts10/',
      tilt: this.tilt,
      untilt: this.untilt,
      heroParallax: this.heroParallax,
      heroReset: this.heroReset,
      activeProject: ap,
      isShopOpen: isShop,
      isCoffeeShop,
      isBoatOpen: !!ap && ap.id === 'boat',
      isPhotoOpen: !!ap && ap.id === 'photo',
      isFinanceOpen: !!ap && ap.id === 'finance',
      isChatOpen: !!ap && ap.id === 'chat',
      chatMessages: s.chatMessages.map((m) => ({
        ...m,
        wrapStyle: m.from === 'me' ? 'display:flex;flex-direction:column;align-items:flex-end;' : 'display:flex;flex-direction:column;align-items:flex-start;',
        bubbleStyle: m.from === 'me'
          ? 'padding:8px 12px;border-radius:14px 14px 3px 14px;background:linear-gradient(110deg,var(--a1),var(--a2));color:#fff;font-size:13px;line-height:1.5;max-width:80%;word-break:break-word;'
          : 'padding:8px 12px;border-radius:14px 14px 14px 3px;background:var(--glass-strong);border:1px solid var(--glass-border);color:var(--text);font-size:13px;line-height:1.5;max-width:80%;word-break:break-word;',
        timeStyle: m.from === 'me'
          ? "font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);margin-top:3px;text-align:right;"
          : "font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);margin-top:3px;",
      })),
      chatTyping: s.chatTyping,
      chatInput: s.chatInput,
      onChatInput: this.onChatInput,
      onChatKeyDown: this.onChatKeyDown,
      sendChatMsg: this.sendChatMsg,
      closeProject: this.closeProject,
      stop: this.stop,
      projOverlayAnim: s.projClosing ? 'overlayOut .3s var(--ease) forwards' : 'overlayIn .3s var(--ease)',
      projModalAnim: s.projClosing ? 'modalOut .32s var(--ease) forwards' : 'modalIn .45s var(--ease)',
      shopItems,
      openCart: this.openCart,
      viewCartStyle,
      viewCartLabel,
      shopBrowse: s.shopPage === 'browse',
      shopCartPage: s.shopPage === 'cart',
      shopDonePage: s.shopPage === 'done',
      goBackToBrowse: this.goBackToBrowse,
      cartLines,
      cartTotalLabel: '€' + cartTotal.toFixed(2),
      cartCountLabel,
      checkout: this.checkout,
      continueShopping: this.continueShopping,
      doneSummary: cartCountLabel + ' · €' + cartTotal.toFixed(2),
      boatList,
      boatTimes,
      boatTimeOpen: !!ap && ap.id === 'boat' && s.boatStep === 1 && s.boatTimeOpen,
      toggleBoatTime: this.toggleBoatTime,
      calDays,
      calMonthLabel: monthNames[calM] + ' ' + calY,
      prevCalMonth: this.prevCalMonth,
      nextCalMonth: this.nextCalMonth,
      calPrevStyle: 'width:24px;height:24px;border-radius:7px;border:1px solid var(--glass-border);background:var(--glass);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--muted);' + (canGoPrev ? 'cursor:pointer;' : 'opacity:.3;pointer-events:none;cursor:default;'),
      calNextStyle: 'width:24px;height:24px;border-radius:7px;border:1px solid var(--glass-border);background:var(--glass);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--muted);cursor:pointer;',
      boatStep0: !!ap && ap.id === 'boat' && s.boatStep === 0,
      boatStep1: !!ap && ap.id === 'boat' && s.boatStep === 1,
      boatStep2: !!ap && ap.id === 'boat' && s.boatStep === 2,
      boatStep3: !!ap && ap.id === 'boat' && s.boatStep === 3,
      goBoatStep0: () => this.setState({ boatStep: 0 }),
      goBoatStep1: () => this.setState({ boatStep: 1 }),
      goBoatStep2: () => this.setState({ boatStep: 2 }),
      confirmBoat: () => this.setState({ boatStep: 3, booked: true }),
      resetBoat: () => { const n = new Date(); const ry = n.getFullYear(), rm = n.getMonth(), rd = n.getDate(); this.setState({ boatStep: 0, selectedBoat: null, selectedTime: '09:00', booked: false, dateSel: { year: ry, month: rm, day: rd }, calYear: ry, calMonth: rm, seats: this.getBaseSeats(ry, rm, rd, '09:00') }); },
      selectedBoatName: s.selectedBoat ? s.selectedBoat.name : '',
      selectedBoatType: s.selectedBoat ? s.selectedBoat.type : '',
      selectedBoatCap: s.selectedBoat ? s.selectedBoat.cap : '',
      selectedDateLabel: (() => { const d = s.dateSel; if (!d) return '—'; const dn = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d.year, d.month, d.day).getDay()]; const mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.month]; return dn + ' ' + d.day + ' ' + mn; })(),
      selectedTime: s.selectedTime || '09:00',
      seats: s.seats,
      seatsBarStyle: 'height:100%;width:' + Math.round((s.seats / 14) * 100) + '%;background:linear-gradient(90deg,var(--a1),var(--a3));border-radius:5px;transition:width .6s cubic-bezier(.22,1,.36,1);',
      selRow,
      photos,
      bigPhotoStyle: 'height:150px;border-radius:14px;border:1px solid var(--glass-border);background:' + photoGrads[s.photoSel] + ';transition:background .45s cubic-bezier(.22,1,.36,1);',
      landingNavStyle,
      landingHeroStyle,
      landingCard1Style,
      landingCard2Style,
      landingCard3Style,
      landingPickNav: () => this.setState({ photoSel: 0 }),
      landingPickHero: () => this.setState({ photoSel: 1 }),
      landingPick1: () => this.setState({ photoSel: 2 }),
      landingPick2: () => this.setState({ photoSel: 3 }),
      landingPick3: () => this.setState({ photoSel: 4 }),
      form: s.form,
      errors: s.errors,
      onName: this.setField('name'),
      onEmail: this.setField('email'),
      onMessage: this.setField('message'),
      submit: this.submit,
      sendBtnLabel: s.sending ? 'Sending…' : 'Send Message',
      formError: s.formError,
      modal: s.modal,
      okOverlayAnim: s.modalClosing ? 'overlayOut .3s var(--ease) forwards' : 'overlayIn .3s var(--ease)',
      okModalAnim: s.modalClosing ? 'modalOut .3s var(--ease) forwards' : 'modalIn .45s var(--ease)',
      closeModal: this.closeModal,
      copied: s.copied,
      copiedMsg: s.copied ? s.copied + ' link copied to clipboard' : '',
      // Finance
      finPeriodTodayStyle: fpStyle('today'),
      finPeriodWeekStyle: fpStyle('week'),
      finPeriodMonthStyle: fpStyle('month'),
      finPeriodYearStyle: fpStyle('year'),
      setFinPeriodToday: this.setFinancePeriod('today'),
      setFinPeriodWeek: this.setFinancePeriod('week'),
      setFinPeriodMonth: this.setFinancePeriod('month'),
      setFinPeriodYear: this.setFinancePeriod('year'),
      finTabOverview: s.financeTab === 'overview',
      finTabAdd: s.financeTab === 'add',
      openFinTabOverview: this.setFinanceTab('overview'),
      openFinTabAdd: this.setFinanceTab('add'),
      finIncomeLbl: '€' + totalIncome.toLocaleString(),
      finExpensesLbl: '€' + totalExpenses.toLocaleString(),
      finNetLbl: (netProfit >= 0 ? '+€' : '−€') + Math.abs(netProfit).toLocaleString(),
      finNetStyle,
      chartMonths,
      recentTxs,
      pieChartEl,
      pieLegend,
      financeCatPills,
      financeForm: s.financeForm,
      onFinanceAmount: this.onFinanceAmount,
      onFinanceLabel: this.onFinanceLabel,
      setFinTypeIncome: this.setFinanceFormType('income'),
      setFinTypeExpense: this.setFinanceFormType('expense'),
      finTypeIncomeStyle,
      finTypeExpenseStyle,
      addFinanceTx: this.addFinanceTx,
      financeAdded: s.financeAdded,
    };
  }
}
