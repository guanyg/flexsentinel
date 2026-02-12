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
    });
  });

})();