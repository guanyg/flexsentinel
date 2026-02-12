(function(){
  // Reveal on scroll
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if(!prefersReduced && 'IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      })
    },{threshold:0.12});
    reveals.forEach(r=>obs.observe(r));
  } else {
    reveals.forEach(r=>r.classList.add('in-view'));
  }

  // Auto-update hash on scroll
  if('IntersectionObserver' in window){
    const sections = document.querySelectorAll('section[id]');
    let isManualScroll = true;
    
    const hashObs = new IntersectionObserver((entries)=>{
      if(!isManualScroll) return;
      
      entries.forEach(e=>{
        if(e.isIntersecting && e.intersectionRatio >= 0.5){
          const id = e.target.id;
          if(id && location.hash !== '#' + id){
            history.replaceState(null, null, '#' + id);
          }
        }
      });
    },{threshold:[0.5], rootMargin: '-80px 0px -40% 0px'});
    
    sections.forEach(s=>hashObs.observe(s));
    
    // Temporarily disable auto-update when user clicks nav links
    document.querySelectorAll('a[href^="#"]').forEach(link=>{
      link.addEventListener('click', ()=>{
        isManualScroll = false;
        setTimeout(()=>{ isManualScroll = true; }, 1000);
      });
    });
  }

  // Use cases gallery pagination
  const paginatorDots = document.querySelectorAll('.paginator-dot');
  const slides = document.querySelectorAll('.use-case-slide');
  
  paginatorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide);
      
      // Update active states
      paginatorDots.forEach(d => d.classList.remove('active'));
      slides.forEach(s => s.classList.remove('active'));
      
      dot.classList.add('active');
      slides[slideIndex].classList.add('active');

      // Track use case view in GA
      if (typeof gtag !== 'undefined') {
        const useCaseTitles = ['Class 8 Monitoring', 'Post-Event Checks', 'RV Fleet Safety'];
        gtag('event', 'view_use_case', {
          use_case_name: useCaseTitles[slideIndex],
          use_case_index: slideIndex
        });
      }
    });
  });

  // Track section navigation (hash changes)
  window.addEventListener('hashchange', () => {
    if (typeof gtag !== 'undefined') {
      const section = location.hash.replace('#', '') || 'home';
      gtag('event', 'page_view', {
        page_title: section.charAt(0).toUpperCase() + section.slice(1),
        page_location: location.href,
        page_path: location.pathname + location.hash
      });
    }
  });

  // Track CTA clicks
  document.querySelectorAll('a[href*="scheduler.zoom.us"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click_cta', {
          cta_location: link.closest('section')?.id || 'header',
          cta_type: 'zoom_scheduler'
        });
      }
    });
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click_cta', {
          cta_location: link.closest('section')?.id || 'unknown',
          cta_type: 'email'
        });
      }
    });
  });

  // Track external link clicks (EMU profiles, LinkedIn, etc.)
  document.querySelectorAll('a[target="_blank"]:not([href*="scheduler.zoom.us"])').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        const url = link.href;
        let linkType = 'other';
        if (url.includes('linkedin.com')) linkType = 'linkedin';
        else if (url.includes('emich.edu')) linkType = 'emu_profile';
        
        gtag('event', 'click_external_link', {
          link_url: url,
          link_type: linkType,
          link_text: link.textContent.trim(),
          section: link.closest('section')?.id || 'unknown'
        });
      }
    });
  });

})();