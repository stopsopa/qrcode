/**
 * WiFi QR Generator - Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const ssidInput = document.getElementById('ssid');
    const passwordInput = document.getElementById('password');
    const labelInput = document.getElementById('label');
    const encryptionRadios = document.getElementsByName('encryption');
    const qrDiv = document.getElementById('qrcode');
    const qrWrapper = document.getElementById('qr-wrapper');
    const placeholderText = document.getElementById('placeholder-text');
    const actionButtons = document.querySelector('.action-buttons');
    const labelPreview = document.getElementById('label-preview');
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-btn');
    const passwordGroup = document.getElementById('password-group');

    let qrcode = null;

    // --- State Management ---

    function updateUrl() {
        const params = new URLSearchParams();
        const ssid = ssidInput.value.trim();
        const password = passwordInput.value;
        const security = getEncryptionValue();
        const label = labelInput.value.trim();

        if (ssid) params.set('s', ssid);
        if (password) params.set('p', password);
        if (security !== 'WPA') params.set('t', security); // Only set if not default
        if (label) params.set('l', label);

        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({ path: newUrl }, '', newUrl);
    }

    function loadStateFromUrl() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('s')) ssidInput.value = params.get('s');
        if (params.has('p')) passwordInput.value = params.get('p');
        if (params.has('l')) labelInput.value = params.get('l');
        
        if (params.has('t')) {
            const security = params.get('t');
            encryptionRadios.forEach(radio => {
                if (radio.value === security) radio.checked = true;
            });
        }

        handleSecurityChange();
        generateQR();
    }

    function getEncryptionValue() {
        let value = 'WPA';
        encryptionRadios.forEach(radio => {
            if (radio.checked) value = radio.value;
        });
        return value;
    }

    // --- QR Generation ---

    function generateQR() {
        const ssid = ssidInput.value.trim();
        const password = passwordInput.value;
        const security = getEncryptionValue();
        const label = labelInput.value.trim();

        if (!ssid) {
            qrWrapper.style.display = 'none';
            placeholderText.style.display = 'block';
            actionButtons.style.visibility = 'hidden';
            return;
        }

        // Format: WIFI:T:WPA;S:SSID;P:PASSWORD;;
        // Note: Special characters like ; , : \ should be escaped with \
        const escape = (str) => str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/,/g, '\\,');
        
        const wifiString = `WIFI:T:${security};S:${escape(ssid)};P:${security === 'nopass' ? '' : escape(password)};;`;

        qrDiv.innerHTML = '';
        qrWrapper.style.display = 'flex';
        placeholderText.style.display = 'none';
        actionButtons.style.visibility = 'visible';
        labelPreview.textContent = label;

        qrcode = new QRCode(qrDiv, {
            text: wifiString,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        updateUrl();
    }

    // --- Actions ---

    async function downloadSnapshot() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const qrCanvas = qrDiv.querySelector('canvas');
        const labelText = labelInput.value.trim();

        // Canvas dimensions
        const padding = 40;
        const qrSize = 256;
        const fontSize = 24;
        const textMargin = labelText ? 40 : 0;
        
        canvas.width = qrSize + (padding * 2);
        canvas.height = qrSize + (padding * 2) + textMargin;

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR
        ctx.drawImage(qrCanvas, padding, padding);

        // Draw Label
        if (labelText) {
            ctx.fillStyle = '#232f3e';
            ctx.font = `bold ${fontSize}px Helvetica, Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(labelText, canvas.width / 2, padding + qrSize + textMargin - 5);
        }

        // Trigger Download
        const link = document.createElement('a');
        link.download = `wifi-qr-${ssidInput.value.trim() || 'network'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast('Downloading PNG snapshot...');
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('URL copied to clipboard!');
        });
    }

    function showToast(message) {
        const container = document.getElementById('notification-container');
        const toast = document.createElement('div');
        toast.className = 'aws-toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function handleSecurityChange() {
        const security = getEncryptionValue();
        passwordGroup.style.display = (security === 'nopass') ? 'none' : 'block';
        generateQR();
    }

    // --- Event Listeners ---

    ssidInput.addEventListener('input', generateQR);
    passwordInput.addEventListener('input', generateQR);
    labelInput.addEventListener('input', generateQR);
    
    encryptionRadios.forEach(radio => {
        radio.addEventListener('change', handleSecurityChange);
    });

    downloadBtn.addEventListener('click', downloadSnapshot);
    copyBtn.addEventListener('click', copyToClipboard);

    // Initial Load
    loadStateFromUrl();
});
