    // ── Scroll Progress ──
    window.addEventListener('scroll', () => {
        const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.getElementById('scroll-progress').style.width = progress + '%';
    });

    // ── Scroll Reveal ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    // ── Mobile Navigation ──
    document.getElementById('mobileToggle').addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.toggle('open');
    });

    function closeMobile() {
        document.getElementById('mobileMenu').classList.remove('open');
    }

    // ── Copy to Clipboard ──
    function copyToClipboard(text, element) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                const tooltip = element.querySelector('.contact-tooltip');
                if (tooltip) {
                    tooltip.classList.add('show');
                    setTimeout(() => tooltip.classList.remove('show'), 2000);
                }
            });
        }
    }

    // ── CV Modal ──
    document.getElementById('cvTrigger').addEventListener('click', () => {
        const modal = document.getElementById('cvModal');
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        });
    });

    function closeCV() {
        const modal = document.getElementById('cvModal');
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 400);
    }

    function closeCVOnOutside(e) {
        if (e.target.id === 'cvModal') closeCV();
    }

    // ── Close modal on Escape ──
    // ── Keydown events (Escape, ArrowLeft, ArrowRight) ──
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCV();
            closeLightboxDirect();
        }
        
        const lightboxModal = document.getElementById('lightboxModal');
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                document.getElementById('lightboxPrev').click();
            } else if (e.key === 'ArrowRight') {
                document.getElementById('lightboxNext').click();
            }
        }
    });

    // ── Image Carousels Logic ──
    function initCarousels() {
        const carousels = document.querySelectorAll('.project-carousel');
        carousels.forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const dots = carousel.querySelectorAll('.dot');
            const prevBtn = carousel.querySelector('.carousel-btn.prev');
            const nextBtn = carousel.querySelector('.carousel-btn.next');
            let currentIndex = 0;

            function updateCarousel() {
                if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentIndex);
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                    updateCarousel();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                    updateCarousel();
                });
            }

            dots.forEach((dot, idx) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentIndex = idx;
                    updateCarousel();
                });
            });
        });
    }

    // ── Lightbox Logic for Carousel Images with Navigation ──
    let lightboxImages = [];
    let lightboxCurrentIndex = 0;

    function initLightbox() {
        const modal = document.getElementById('lightboxModal');
        const modalImg = document.getElementById('lightboxImg');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        document.querySelectorAll('.project-carousel').forEach(carousel => {
            const imgs = Array.from(carousel.querySelectorAll('.carousel-slide img'));
            imgs.forEach((img, idx) => {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    lightboxImages = imgs.map(i => i.src);
                    lightboxCurrentIndex = idx;
                    openLightbox();
                });
            });
        });

        function openLightbox() {
            modalImg.src = lightboxImages[lightboxCurrentIndex];
            modal.style.display = 'flex';
            
            if (lightboxImages.length > 1) {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }

            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        }

        function changeLightboxImage(newIndex) {
            modalImg.style.opacity = 0;
            modalImg.style.transform = 'scale(0.95)';
            setTimeout(() => {
                lightboxCurrentIndex = newIndex;
                modalImg.src = lightboxImages[lightboxCurrentIndex];
                setTimeout(() => {
                    modalImg.style.opacity = 1;
                    modalImg.style.transform = 'scale(1)';
                }, 50);
            }, 150);
        }

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (lightboxImages.length <= 1) return;
            const newIndex = (lightboxCurrentIndex > 0) ? lightboxCurrentIndex - 1 : lightboxImages.length - 1;
            changeLightboxImage(newIndex);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (lightboxImages.length <= 1) return;
            const newIndex = (lightboxCurrentIndex < lightboxImages.length - 1) ? lightboxCurrentIndex + 1 : 0;
            changeLightboxImage(newIndex);
        });
    }

    function closeLightboxDirect() {
        const modal = document.getElementById('lightboxModal');
        const modalImg = document.getElementById('lightboxImg');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            modalImg.style.opacity = '';
            modalImg.style.transform = '';
        }, 300);
    }

    function closeLightbox(e) {
        if (e.target.id === 'lightboxModal' || e.target.id === 'lightboxImg') {
            closeLightboxDirect();
        }
    }

    // ── Custom Native Audio Player Logic ──
    function initAudioPlayer() {
        const container = document.querySelector('.podcast-player-container');
        if (!container) return;

        const audio = document.getElementById('podcast-audio');
        if (!audio) return;

        const playPauseBtn = container.querySelector('.play-pause-btn');
        const playPauseIcon = playPauseBtn.querySelector('i');
        const progress = container.querySelector('.player-progress');
        const handle = container.querySelector('.player-handle');
        const currentTimeEl = container.querySelector('.current-time');
        const totalTimeEl = container.querySelector('.total-time');
        const timeline = container.querySelector('.player-timeline');
        const volumeBtn = container.querySelector('.volume-btn');
        const volumeIcon = volumeBtn.querySelector('i');
        const volumeSlider = container.querySelector('.volume-slider');

        let isMuted = false;
        let preMutedVolume = 80;

        function formatTime(secs) {
            const mins = Math.floor(secs / 60);
            const remainingSecs = Math.floor(secs % 60);
            return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
        }

        function updateProgress() {
            if (!audio.duration) return;
            const pct = (audio.currentTime / audio.duration) * 100;
            progress.style.width = pct + '%';
            handle.style.left = pct + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }

        audio.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audio.duration);
        });

        if (audio.readyState >= 1) {
            totalTimeEl.textContent = formatTime(audio.duration);
        }

        audio.addEventListener('timeupdate', updateProgress);

        audio.addEventListener('play', () => {
            playPauseIcon.className = 'fas fa-pause';
            container.classList.add('playing');
        });

        audio.addEventListener('pause', () => {
            playPauseIcon.className = 'fas fa-play';
            container.classList.remove('playing');
        });

        audio.addEventListener('ended', () => {
            playPauseIcon.className = 'fas fa-play';
            container.classList.remove('playing');
            audio.currentTime = 0;
            updateProgress();
        });

        playPauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (audio.paused) {
                audio.play().catch(err => console.log("Audio play failed:", err));
            } else {
                audio.pause();
            }
        });

        timeline.addEventListener('click', (e) => {
            const rect = timeline.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            let pct = clickX / width;
            if (pct < 0) pct = 0;
            if (pct > 1) pct = 1;
            if (audio.duration) {
                audio.currentTime = pct * audio.duration;
                updateProgress();
            }
        });

        // Volume control
        audio.volume = volumeSlider.value / 100;

        volumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isMuted = !isMuted;
            audio.muted = isMuted;
            if (isMuted) {
                preMutedVolume = volumeSlider.value;
                volumeSlider.value = 0;
                volumeIcon.className = 'fas fa-volume-mute';
                volumeBtn.style.color = 'var(--muted)';
            } else {
                volumeSlider.value = preMutedVolume;
                audio.volume = preMutedVolume / 100;
                updateVolumeIcon(preMutedVolume);
                volumeBtn.style.color = 'var(--ink)';
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            const vol = e.target.value;
            audio.volume = vol / 100;
            audio.muted = false;
            isMuted = false;
            updateVolumeIcon(vol);
        });

        function updateVolumeIcon(vol) {
            if (vol == 0) {
                volumeIcon.className = 'fas fa-volume-mute';
                volumeBtn.style.color = 'var(--muted)';
                isMuted = true;
                audio.muted = true;
            } else if (vol < 50) {
                volumeIcon.className = 'fas fa-volume-down';
                volumeBtn.style.color = 'var(--ink)';
                isMuted = false;
                audio.muted = false;
            } else {
                volumeIcon.className = 'fas fa-volume-up';
                volumeBtn.style.color = 'var(--ink)';
                isMuted = false;
                audio.muted = false;
            }
        }
    }

    // ── Typing Effect Logic ──
    function initTypingEffect() {
        const textEl = document.getElementById('typing-text');
        if (!textEl) return;

        const phrases = ["bosser ensemble ?", "rendre ca viral ?", "casser les codes ?"];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let delay = 100;

        function type() {
            const currentPhrase = phrases[phraseIdx];
            if (isDeleting) {
                textEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                delay = 50;
            } else {
                textEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                delay = 100;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                isDeleting = true;
                delay = 2000; // Wait before starting to delete
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                delay = 500; // Wait before starting to type next phrase
            }

            setTimeout(type, delay);
        }

        type();
    }

    // ── Scroll Spy Navigation Highlighting ──
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

        function onScroll() {
            let current = '';
            const scrollY = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120; // 120px offset for sticky header
                const sectionHeight = section.offsetHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Force active state to 'contact' when scrolled to the very bottom of the page
            if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50) {
                current = 'contact';
            }

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', onScroll);
        onScroll(); // Highlight initially
    }


    // ── Projects Grid Filter ──
    function initProjectsFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.projects-grid .project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // Smooth scroll back to top of projects section
                const projetsSection = document.getElementById('projets');
                if (projetsSection) {
                    const offset = 80; // height of the sticky header
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = projetsSection.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }

                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        // Force a reflow
                        void card.offsetHeight;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        
                        const handleTransitionEnd = (e) => {
                            if (e.propertyName === 'opacity') {
                                if (card.style.opacity === '0') {
                                    card.style.display = 'none';
                                }
                                card.removeEventListener('transitionend', handleTransitionEnd);
                            }
                        };
                        card.addEventListener('transitionend', handleTransitionEnd);
                        setTimeout(() => {
                            if (card.style.opacity === '0') {
                                card.style.display = 'none';
                            }
                        }, 450);
                    }
                });
            });
        });
    }

    // ── Custom Cursor ──
    function initCustomCursor() {
        const dot = document.querySelector('.custom-cursor-dot');
        const ring = document.querySelector('.custom-cursor-ring');
        if (!dot || !ring) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let dotX = 0, dotY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        });

        window.addEventListener('mouseout', () => {
            dot.style.opacity = '0';
            ring.style.opacity = '0';
        });

        function render() {
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        const interactiveElements = document.querySelectorAll('a, button, .cv-visual, .contact-card, .filter-btn, [role="button"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('custom-cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('custom-cursor-hover');
            });
        });

        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.addEventListener('mouseenter', () => {
                dot.style.opacity = '0';
                ring.style.opacity = '0';
            });
            iframe.addEventListener('mouseleave', () => {
                dot.style.opacity = '1';
                ring.style.opacity = '1';
            });
        });
    }

    // ── Card Spotlight Hover Effect ──
    function initCardSpotlight() {
        if (window.innerWidth <= 1024) return; // Only on desktop

        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // ── Header Scroll Glassmorphism Transition ──
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        function checkScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', checkScroll);
        checkScroll();
    }

    // ── Skills Progress Bars Animation ──
    function initSkillsAnimation() {
        const progressBars = document.querySelectorAll('.skill-card-progress-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const level = bar.getAttribute('data-level');
                    bar.style.width = level;
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // ── Timeline Drawing Progress & Active Bullets ──
    function initTimelineProgress() {
        const timeline = document.querySelector('.timeline');
        const progress = document.querySelector('.timeline-progress');
        if (!timeline || !progress) return;

        function updateTimelineProgress() {
            const rect = timeline.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const startPos = viewportHeight * 0.7;
            const totalHeight = rect.height;
            const currentPosition = startPos - rect.top;
            
            let pct = (currentPosition / totalHeight) * 100;
            pct = Math.max(0, Math.min(100, pct));

            progress.style.height = `${pct}%`;
            
            const items = timeline.querySelectorAll('.timeline-item');
            items.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemTop = itemRect.top + 30;
                if (itemTop < startPos) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        window.addEventListener('scroll', updateTimelineProgress);
        window.addEventListener('resize', updateTimelineProgress);
        updateTimelineProgress();
    }

    // ── Back to Top Button Logic ──
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ── Custom Vertical Video Player Logic ──
    function initCustomVideoPlayer() {
        const player = document.querySelector('.custom-video-player');
        if (!player) return;

        const video = document.getElementById('plaza-video');
        if (!video) return;

        const playPauseBtn = player.querySelector('.play-pause-btn');
        const playPauseIcon = playPauseBtn.querySelector('i');
        const progress = player.querySelector('.video-progress');
        const handle = player.querySelector('.video-handle');
        const currentTimeEl = player.querySelector('.video-current-time');
        const totalTimeEl = player.querySelector('.video-total-time');
        const timeline = player.querySelector('.video-timeline');
        const volumeBtn = player.querySelector('.volume-btn');
        const volumeIcon = volumeBtn.querySelector('i');
        const volumeSlider = player.querySelector('.video-volume-slider');
        const fullscreenBtn = player.querySelector('.fullscreen-btn');

        let isMuted = false;
        let preMutedVolume = 80;

        function formatTime(secs) {
            const mins = Math.floor(secs / 60);
            const remainingSecs = Math.floor(secs % 60);
            return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
        }

        function updateProgress() {
            if (!video.duration) return;
            const pct = (video.currentTime / video.duration) * 100;
            progress.style.width = pct + '%';
            if (handle) handle.style.left = pct + '%';
            currentTimeEl.textContent = formatTime(video.currentTime);
        }

        video.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(video.duration);
        });

        if (video.readyState >= 1) {
            totalTimeEl.textContent = formatTime(video.duration);
        }

        video.addEventListener('timeupdate', updateProgress);

        video.addEventListener('play', () => {
            playPauseIcon.className = 'fas fa-pause';
        });

        video.addEventListener('pause', () => {
            playPauseIcon.className = 'fas fa-play';
        });

        video.addEventListener('ended', () => {
            playPauseIcon.className = 'fas fa-play';
            video.currentTime = 0;
            updateProgress();
        });

        playPauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (video.paused) {
                video.play().catch(err => console.log("Video play failed:", err));
            } else {
                video.pause();
            }
        });

        // Click on video to play/pause
        video.style.cursor = 'pointer';
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(err => console.log("Video play failed:", err));
            } else {
                video.pause();
            }
        });

        timeline.addEventListener('click', (e) => {
            const rect = timeline.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            let pct = clickX / width;
            if (pct < 0) pct = 0;
            if (pct > 1) pct = 1;
            if (video.duration) {
                video.currentTime = pct * video.duration;
                updateProgress();
            }
        });

        // Volume control
        video.volume = volumeSlider.value / 100;

        volumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isMuted = !isMuted;
            video.muted = isMuted;
            if (isMuted) {
                preMutedVolume = volumeSlider.value;
                volumeSlider.value = 0;
                volumeIcon.className = 'fas fa-volume-mute';
                volumeBtn.style.color = 'var(--muted)';
            } else {
                volumeSlider.value = preMutedVolume;
                video.volume = preMutedVolume / 100;
                updateVolumeIcon(preMutedVolume);
                volumeBtn.style.color = 'var(--ink)';
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            const vol = e.target.value;
            video.volume = vol / 100;
            video.muted = false;
            isMuted = false;
            updateVolumeIcon(vol);
        });

        function updateVolumeIcon(vol) {
            if (vol == 0) {
                volumeIcon.className = 'fas fa-volume-mute';
                volumeBtn.style.color = 'var(--muted)';
                isMuted = true;
                video.muted = true;
            } else if (vol < 50) {
                volumeIcon.className = 'fas fa-volume-down';
                volumeBtn.style.color = 'var(--ink)';
                isMuted = false;
                video.muted = false;
            } else {
                volumeIcon.className = 'fas fa-volume-up';
                volumeBtn.style.color = 'var(--ink)';
                isMuted = false;
                video.muted = false;
            }
        }

        // Fullscreen
        fullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });
    }

    // Initialize all components on load
    window.addEventListener('DOMContentLoaded', () => {
        initCarousels();
        initLightbox();
        initAudioPlayer();
        initTypingEffect();
        initScrollSpy();
        initProjectsFilter();
        initCustomCursor();
        initSkillsAnimation();
        initCardSpotlight();
        initHeaderScroll();
        initTimelineProgress();
        initBackToTop();
        initCustomVideoPlayer();
    });

    // Page Loader Fade Out
    window.addEventListener('load', () => {
        const loader = document.getElementById('page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 1600);
        }
    });
