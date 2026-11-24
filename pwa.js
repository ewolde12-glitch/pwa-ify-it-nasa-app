let deferredInstallPrompt = null;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;

  if (installButton) {
    installButton.hidden = false;
  }
});

installButton?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;

  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;

  if (installButton) {
    installButton.hidden = true;
  }

  console.log(`PWA install prompt outcome: ${outcome}`);
});
