// Script pour la bannière d'installation PWA
document.addEventListener('DOMContentLoaded', function() {
  // Créer la bannière d'installation
  const installBanner = document.createElement('div');
  installBanner.id = 'pwa-install-banner';
  installBanner.innerHTML = `
    <div class="install-content">
      <div class="install-icon">
        <i class="fas fa-mobile-alt"></i>
      </div>
      <div class="install-text">
        <strong>Ajoutez Yonko Business à votre écran d'accueil</strong>
        <p>Pour une expérience optimale et un accès rapide</p>
      </div>
      <div class="install-actions">
        <button id="installBtn" class="btn btn-primary">Installer</button>
        <button id="dismissBtn" class="btn btn-secondary">Plus tard</button>
      </div>
      <button id="closeInstallBanner" class="close-btn"><i class="fas fa-times"></i></button>
    </div>
  `;
  
  // Ajouter le style pour la bannière
  const style = document.createElement('style');
  style.textContent = `
    #pwa-install-banner {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--light-card, #ffffff);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
      z-index: 1001;
      padding: 12px 20px;
      transform: translateY(100%);
      transition: transform 0.3s ease-in-out;
      border-top: 3px solid var(--primary-color, #f39e21);
    }
    
    body.dark-mode #pwa-install-banner {
      background-color: var(--dark-card, #1e1e1e);
      color: var(--dark-text, #e0e0e0);
    }
    
    #pwa-install-banner.show {
      transform: translateY(0);
    }
    
    .install-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .install-icon {
      font-size: 2rem;
      color: var(--primary-color, #f39e21);
      margin-right: 15px;
    }
    
    .install-text {
      flex: 1;
    }
    
    .install-text p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.9rem;
    }
    
    .install-actions {
      display: flex;
      gap: 10px;
      margin-left: 15px;
    }
    
    .btn-secondary {
      background-color: transparent;
      border: 1px solid var(--border-light, #dddddd);
      color: var(--light-text, #333333);
    }
    
    body.dark-mode .btn-secondary {
      border-color: var(--border-dark, #444444);
      color: var(--dark-text, #e0e0e0);
    }
    
    .btn-secondary:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: var(--light-text, #333333);
      margin-left: 10px;
      padding: 5px;
    }
    
    body.dark-mode .close-btn {
      color: var(--dark-text, #e0e0e0);
    }
    
    @media (max-width: 768px) {
      .install-content {
        flex-wrap: wrap;
      }
      
      .install-text {
        order: 1;
        width: calc(100% - 80px);
        margin-bottom: 10px;
      }
      
      .install-icon {
        order: 0;
      }
      
      .install-actions {
        order: 2;
        margin-left: 0;
      }
      
      .close-btn {
        order: 0;
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(installBanner);
  
  // Variables pour gérer l'installation
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');
  const dismissBtn = document.getElementById('dismissBtn');
  const closeBtn = document.getElementById('closeInstallBanner');
  const banner = document.getElementById('pwa-install-banner');
  
  // Vérifier si l'utilisateur a déjà rejeté l'invitation
  const checkDismissed = () => {
    const lastDismissed = localStorage.getItem('pwaBannerDismissed');
    if (lastDismissed) {
      const now = new Date().getTime();
      const dismissedTime = parseInt(lastDismissed);
      // Attendre 3 jours (259200000 ms) avant de montrer à nouveau
      if (now - dismissedTime < 259200000) {
        return true;
      }
    }
    return false;
  };
  
  // Capture de l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    
    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }
    
    // Vérifier si l'invite a été rejetée récemment
    if (checkDismissed()) {
      return;
    }
    
    // Afficher la bannière après un délai de 2 secondes
    setTimeout(() => {
      banner.classList.add('show');
    }, 2000);
  });
  
  // Gérer le clic sur le bouton d'installation
  installBtn.addEventListener('click', () => {
    if (!deferredPrompt) {
      return;
    }
    
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installée avec succès');
        // Montrer une notification de succès avec le toast existant
        if (typeof showToast === 'function') {
          showToast('Application installée avec succès!', 'success');
        }
      }
      deferredPrompt = null;
      banner.classList.remove('show');
    });
  });
  
  // Gérer le clic sur "Plus tard"
  dismissBtn.addEventListener('click', () => {
    banner.classList.remove('show');
    // Enregistrer l'heure du rejet
    localStorage.setItem('pwaBannerDismissed', new Date().getTime().toString());
  });
  
  // Gérer le clic sur le bouton de fermeture
  closeBtn.addEventListener('click', () => {
    banner.classList.remove('show');
    // Enregistrer l'heure du rejet
    localStorage.setItem('pwaBannerDismissed', new Date().getTime().toString());
  });
  
  // Détecter si l'application est déjà installée après l'installation
  window.addEventListener('appinstalled', (event) => {
    console.log('Application installée');
    banner.classList.remove('show');
  });
});
