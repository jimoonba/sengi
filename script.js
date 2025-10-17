// 메뉴 데이터 정의
const menuData = [
  {
    title: "재생원료인증",
    link: "overview.html",
    items: [
      { label: "제도개요", link: "overview.html" },
      { label: "법령 및 운영규정", link: "regulations.html" },
      { label: "제도 운영체계", link: "operations.html" },
      { label: "인증표시 소개", link: "certification-mark.html" }
    ]
  },
  {
    title: "인증절차",
    link: "application.html",
    items: [
      { label: "신청방법", link: "application.html" },
      { label: "인증기준", link: "standards.html" },
      { label: "사후관리", link: "post-management.html" },
      { label: "인증기관", link: "cert-bodies.html" }
    ]
  },
  {
    title: "연속성 관리",
    link: "continuity-overview.html",
    items: [
      { label: "연속성 관리 개요", link: "continuity-overview.html" },
      { label: "절차 및 방법", link: "continuity-procedures.html" }
    ]
  },
  {
    title: "인증현황",
    link: "certified-companies.html",
    items: [
      { label: "인증기업", link: "certified-companies.html" },
      { label: "인증제품", link: "certified-products.html" },
      { label: "인증통계", link: "stats.html" }
    ]
  },
  {
    title: "정보마당",
    link: "notices.html",
    items: [
      { label: "공지사항", link: "notices.html" },
      { label: "자료실", link: "downloads.html" },
      { label: "심사원 교육일정", link: "training.html" },
      { label: "FAQ", link: "faq.html" }
    ]
  }
];

// 모바일 메뉴 렌더링
function renderMobileMenu(data) {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  let html = '<ul>';
  data.forEach(section => {
    const sectionLink = section.link || '#';
    const sectionActive = (section.link === currentFile || (section.items && section.items.some(it => it.link === currentFile)));
    html += `<li class="mobile-section${sectionActive ? ' active' : ''}"><strong><a href="${sectionLink}">${section.title}</a></strong><ul>`;
    section.items.forEach(item => {
      const itemLink = item.link || '#';
      const isActive = (itemLink === currentFile);
      html += `<li class="mobile-item${isActive ? ' active' : ''}"><a href="${itemLink}">${item.label}</a></li>`;
    });
    html += '</ul></li>';
  });
  html += '</ul>';
  const el = document.querySelector('.nav-mobile');
  if (el) el.innerHTML = html;
}

// PC 메뉴 렌더링
function renderPCMenu(data) {
  const navUl = document.querySelector('.nav ul');
  if (!navUl) return;
  navUl.innerHTML = data.map(section => {
    const sectionLink = section.link || '#';
    return `<li class="main-menu-item" data-menu="${section.title}"><a href="${sectionLink}">${section.title}</a></li>`;
  }).join('');
}

// 메가메뉴 초기화
function initMegaMenu() {
  const megaMenu = document.querySelector('.mega-menu');
  const navItems = document.querySelectorAll('.nav ul li');
  let menuOpen = false;
  let activeNavItem = null;

  navItems.forEach((li) => {
    li.addEventListener('mouseenter', () => {
      if (!megaMenu) return;
      megaMenu.innerHTML = '<div class="mega-menu-columns" style="margin:auto;display:flex; gap:0px; justify-content:flex-end; align-items:flex-start; max-width:1440px; padding:16px 0px;">' +
        menuData.map(section =>
          `<div style="min-width:111px; text-align:center;"><ul class="submenu" style="margin:0; padding:0; list-style:none;">` +
          section.items.map(item => {
            const href = item.link || '#';
            const label = item.label || '';
            return `<li style="text-align:center; padding:4px 0;"><a href="${href}">${label}</a></li>`;
          }).join('') +
          '</ul></div>'
        ).join('') +
        '</div>';
      megaMenu.classList.add('active');
      li.classList.add('active');
      activeNavItem = li;
      menuOpen = true;
    });

    li.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!menuOpen) {
          if (megaMenu) {
            megaMenu.classList.remove('active');
            megaMenu.innerHTML = '';
          }
          li.classList.remove('active');
          activeNavItem = null;
        }
      }, 50);
    });
  });

  megaMenu.addEventListener('mouseenter', () => {
    menuOpen = true;
    if (activeNavItem) activeNavItem.classList.add('active');
  });
  megaMenu.addEventListener('mouseleave', () => {
    menuOpen = false;
    megaMenu.classList.remove('active');
    megaMenu.innerHTML = '';
    if (activeNavItem) {
      activeNavItem.classList.remove('active');
      activeNavItem = null;
    }
  });

  const header = document.querySelector('header');
  if (header) {
    header.addEventListener('mouseleave', () => {
      if (megaMenu) {
        megaMenu.classList.remove('active');
        megaMenu.innerHTML = '';
      }
      if (activeNavItem) {
        activeNavItem.classList.remove('active');
        activeNavItem = null;
      }
    });
  }
}

// 햄버거 메뉴 토글
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  const overlay = document.querySelector('.nav-overlay');
  if (hamburger && navMobile && overlay) {
    hamburger.addEventListener('click', () => {
      navMobile.classList.toggle('active');
      overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', () => {
      navMobile.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
}

// 사이드바 활성화 토글 함수
function setSidebarActive(index) {
  document.querySelectorAll('.menu button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}


// 사이드바 렌더링
function renderSidebarForCurrentSection() {
  try {
    const menuEl = document.querySelector('.menu');
    if (!menuEl) return;
    const fullPath = window.location.pathname;
    const currentFile = fullPath.split('/').pop().toLowerCase().trim() || 'index.html';


   //const currentFile = window.location.pathname.split('/').pop().toLowerCase().trim() || 'index.html';

    let section = menuData.find(s => {
      if (s.link === currentFile) return true;
      if (s.items && s.items.some(it => it.link === currentFile)) return true;
      return false;
    });

    if (!section) section = menuData[0];

    let html = `<div class="sidebar-section"><ul>`;
    section.items.forEach(item => {
      const href = item.link || '#';
      const isActive = (currentFile === href.toLowerCase().trim());
      html += `<li><button onclick="location.href='${href}'"${isActive ? ' class="active"' : ''}>${item.label}</button></li>`;
    });
    html += '</ul></div>';
    menuEl.innerHTML = html;
  } catch (e) {
    console.warn('renderSidebarForCurrentSection error', e);
  }
}

// 해시에서 탭 숫자 읽기 및 변경
function initTabFromHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const match = hash.match(/tab=(\d+)/);
  if (match) {
    const idx = parseInt(match[1], 10);
    if (!isNaN(idx)) changeTab(idx);
  }
}

 

// 탭 변경 함수 (content 로드 등에서 사용)
function changeTab(index) {
  const content = document.getElementById('tab-content');
  if (!content) return;
  const tabFiles = menuData.reduce((acc, section) => {
    if (section.items && section.items.length) {
      section.items.forEach(it => acc.push(it));
    }
    return acc;
  }, []).map(it => `content/${it.link}`);

  const file = tabFiles[index];
  if (file) {
    fetch(file)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load ' + file);
        return r.text();
      })
      .then(html => {
        content.innerHTML = html;
        setSidebarActive(index);
      })
      .catch(err => {
        console.warn('Could not fetch fragment, falling back to inline content if present', err);
        if (typeof tabContent !== 'undefined' && tabContent[index]) {
          content.innerHTML = tabContent[index];
          setSidebarActive(index);
        } else {
          content.innerHTML = '<p>콘텐츠를 불러올 수 없습니다.</p>';
        }
      });
  } else {
    if (typeof tabContent !== 'undefined' && tabContent[index]) {
      content.innerHTML = tabContent[index];
      setSidebarActive(index);
    } else {
      content.innerHTML = '<p>콘텐츠가 없습니다.</p>';
    }
  }
}



// 초기화: DOM 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
  renderMobileMenu(menuData);
  renderPCMenu(menuData);
  initMegaMenu();
  initHamburgerMenu();
  renderSidebarForCurrentSection();
  autoSetSidebarActive();
  initTabFromHash();

  // 직접 페이지 접근시 자동 탭 변경
  try {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    const flattenedItems = menuData.reduce((acc, section) => {
      if (section.items && section.items.length) {
        section.items.forEach(it => acc.push(it));
      }
      return acc;
    }, []);
    const matchedIndex = flattenedItems.findIndex(it => it.link === file);
    if (matchedIndex >= 0) {
      if (window.location.protocol === 'file:') {
        setSidebarActive(matchedIndex);
      } else {
        changeTab(matchedIndex);
      }
    }
  } catch (e) {
    console.warn('auto-load direct page fragment failed', e);
  }
});
