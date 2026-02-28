# WiFi QR Code Generator - Implementation Plan

## Project Overview
A single-page, static web application that generates WiFi QR codes from user input (SSID, Password, Security Type). The app will be styled after the **AWS Management Console** to provide a professional, clean, and recognizable aesthetic.

## Goals
- **Static Hosting**: Ready to be hosted on GitHub Pages from the `docs/` folder.
- **Privacy & Security**: Prevent browsers from saving sensitive WiFi credentials using appropriate HTML attributes.
- **Real-time Interaction**: Generate the QR code instantly as the user types.
- **Shareability**: Sync form data to the URL (hash or query params) so users can share links that automatically regenerate the QR code.
- **Convenience**: One-click button to copy the encoded URL.

## Tech Stack
- **Library**: [QRCode.js](https://github.com/davidshimjs/qrcodejs) (Lightweight, cross-browser compatible).
- **Frontend**: Vanilla HTML5, Vanilla JavaScript (ES6+), Vanilla CSS.
- **Style Inspiration**: AWS Management Console (Amazon Orange, slate/gray tones, modern typography).

## Folder Structure
We will use the `docs/` folder to host the application. GitHub Pages allows serving content specifically from this folder, keeping the repository root clean.

```
/
├── docs/ (Distribution/Hosting folder)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── lib/
│       └── qrcode.min.js
└── PLAN.md
```

## UI/UX Design (AWS Dashboard Style)
- **Top Navigation**: A dark, sticky bar at the top, mimicking the AWS console's navigation (logo on left, account/icons on right).
- **Layout**: A responsive dashboard layout.
    - **Sidebar**: A navigation/control sidebar (e.g., list of WiFi configurations or simple logo/links).
    - **Main Content**: A gray-toned workspace with white cards for inputs and the QR display.
- **Typography**: Amazon Ember (if possible) or modern sans-serif fonts (Inter, Roboto).
- **Components**:
    - **Form Inputs**: Standard AWS Cloudscape-style inputs with clear labels and validation states.
    - **Radio Buttons**: AWS-style button groups or radio selectors.
    - **Cards**: The QR code and form will be housed in professional, shadow-boxed dashboard cards.
    - **Status Indicators**: AWS-style "Success" or "Info" alerts for feedback.

## Functional Requirements
1. **Form Fields**:
    - **Network Name (SSID)**: Text input.
    - **Password**: Password input (using `autocomplete="new-password"` to avoid vault prompts).
    - **Security Type**: Radio buttons (WPA/WPA2, WEP, None).
    - **Custom Label**: Optional text input to display a name or location below the QR code (e.g., "Guest WiFi - Kitchen").
2. **Real-time Generation**:
    - Listen for `input` and `change` events.
    - Map the WiFi fields to the specific WiFi QR format: `WIFI:T:<security>;S:<ssid>;P:<password>;;`.
    - Clear or hide the QR code if details are incomplete.
    - Render the custom label dynamically below the QR code.
3. **URL Synchronization**:
    - Update the **URL Query Parameters** (using `history.replaceState`) on every input change.
    - On page load, read `URLSearchParams` to pre-fill the form and generate the code immediately.
4. **Action Buttons**:
    - **Copy Link**: Copies the current URL (with embedded data) to the clipboard.
    - **Download PNG**: Generates a high-quality snapshot of the QR code *and* the custom label as a single PNG file for printing or sharing.
    - Provide visual feedback (e.g., "Copied!" or "Downloading...") for all actions.

## Implementation Steps
1. **Setup Development Environment**: Initialize the `docs/` folder.
2. **Design the Core HTML/CSS**: Implement the AWS Dashboard-themed layout (Top Nav, Sidebar, Main Area) and responsive form cards.
3. **Integrate QRCode.js**: Download the library from a CDN or repository and store it locally in `docs/lib/` to ensure the app works offline and remains self-contained.
4. **JavaScript Logic**:
    - Create a `state` object to handle input values.
    - Implement a `generate()` function triggered on input.
    - Add URL persistence logic.
    - Implement the "Snapshot" logic: Use a hidden secondary canvas or library to combine the QR code and the text label into a single downloadable PNG.
5. **Testing**:
    - Verify QR code readability on mobile scanners.
    - Ensure URL sharing works across different browser sessions.
    - Confirm "Copy to Clipboard" and "Download PNG" functionality in various browsers.
