let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = event;
  // Update UI notify the user they can install the PWA
});


const installButton = document.getElementById('installButton');

installButton.addEventListener('click', async () => {
  // Hide the install button
  installButton.style.display = 'none';
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }
  // Clear the deferred prompt variable, it can only be used once.
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  // Optionally, hide the install button or provide other feedback to the user
});