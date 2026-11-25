let deferredInstallPrompt = null;

const installButton = document.getElementById('installButton');
const installBanner = document.getElementById('install-banner');
const installYes = document.getElementById('install-yes');
const installDismiss = document.getElementById('install-dismiss');
const installBannerText = installBanner?.querySelector('span');

const isIos = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

function showInstallOption() {
  if (isStandalone()) return;
  if (installButton) installButton.hidden = false;
  if (installBanner) installBanner.classList.remove('hidden');
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  showInstallOption();
});

async function installApp() {
  if (deferredInstallPrompt) {
    await deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;

    if (choice.outcome === 'accepted') {
      hideInstallOption();
    }
    console.log(`PWA install prompt outcome: ${choice.outcome}`);
    return;
  }

  if (isIos()) {
    if (installBannerText) {
      installBannerText.textContent = 'Tap Share, then “Add to Home Screen” to install NASA Explorer.';
    }
    if (installBanner) installBanner.classList.remove('hidden');
  } else {
    alert('To install NASA Explorer, open this page in Chrome or Edge and choose “Install app” from the browser menu.');
  }
}

function hideInstallOption() {
  if (installButton) installButton.hidden = true;
  if (installBanner) installBanner.classList.add('hidden');
}

installButton?.addEventListener('click', installApp);
installYes?.addEventListener('click', installApp);
installDismiss?.addEventListener('click', hideInstallOption);

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  hideInstallOption();
  console.log('NASA Explorer was installed on this device.');
});

// iOS and browsers that do not support beforeinstallprompt need a visible install option.
if (isIos() && !isStandalone()) {
  showInstallOption();
  if (installBannerText) {
    installBannerText.textContent = 'Install NASA Explorer for quick access.';
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}
