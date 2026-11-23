# PantryVerdict — Security, Privacy & Compliance Specification

---

## 1. Threat Model & Client-Side Risk Vector Analysis

PantryVerdict runs as a zero-barrier, client-side web application. Its threat landscape centers around user-supplied inputs, untrusted external API data (from Open Food Facts / USDA), and local persistent storage:

| Threat Vector | Severity | Vulnerability Mechanism | Mitigation Strategy |
|:---|:---|:---|:---|
| **Cross-Site Scripting (XSS)** | High | Untrusted product titles, brand names, or ingredient lists injected into the DOM. | Zero use of `dangerouslySetInnerHTML`. External strings strictly rendered via React text nodes. |
| **Plaintext Credential Exposure** | High | Storing user passwords or auth secrets directly in `localStorage`. | Browser-native Web Crypto API (`SHA-256` hashing with per-user salt). Plaintext passwords are never saved. |
| **Input Manipulation / Integer Overflow** | Medium | Negative prices, `NaN`, astronomical values disrupting price-per-unit calculations. | Strict clamping and numeric type validation (`0 < price <= 100,000`). |
| **Third-Party API Tracking / Leakage** | Low | Leaking user identity or session data to external public APIs. | Anonymous GET queries only; zero auth cookies or user tokens attached to outbound API calls. |
| **Denial of Service via Typing Floods** | Medium | Rapid keypresses triggering hundreds of concurrent API requests. | Mandatory 450ms debounce and active request cancellation with `AbortController`. |

---

## 2. XSS & Injection Prevention Implementation

1. **Strict DOM Text Binding**:
   - Never use `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, or `document.write`.
   - All product names, brands, additive descriptions, and notes must be rendered using standard React JSX curly braces:
     ```tsx
     {/* Safe Text Node Rendering */}
     <h3 className="font-serif font-medium text-stone-900">{ingredient.name}</h3>
     <p className="text-xs text-stone-500">{ingredient.ingredientsText}</p>
     ```
2. **URL Sanitization**:
   - Product images from Open Food Facts are validated against HTTPS protocol whitelist (`https://images.openfoodfacts.org/*`, `https://*.ssl.cf1.rackcdn.com/*`) before rendering in `<img>` tags.
   - Fallback SVG placeholders are used if the image URL is malformed or invalid.

---

## 3. Web Crypto API Credential Hashing Specification

To provide frictionless account creation without requiring external authentication servers or risking password exposure:

### 3.1 Algorithm
- **Hash Function**: SHA-256 (`crypto.subtle.digest('SHA-256', data)`)
- **Salt Generation**: Cryptographically secure 16-byte random salt using `crypto.getRandomValues(new Uint8Array(16))`.
- **Key Derivation Flow**:
  ```typescript
  // 1. Convert salt to hex string
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // 2. Combine password + salt
  const encoder = new TextEncoder();
  const data = encoder.encode(password + saltHex);
  
  // 3. Digest via Web Crypto
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  ```
- **Storage**: Only `email`, `salt`, `passwordHash`, and `kitchenGoals` are stored in `localStorage`. Plaintext passwords are discarded immediately upon hash generation.

---

## 4. Input Validation & Numeric Clamping

Every user input is clamped and validated prior to state persistence:

```typescript
export function clampPriceInput(val: string): number {
  const numeric = parseFloat(val);
  if (isNaN(numeric) || numeric <= 0) return 0;
  return Math.min(Math.max(numeric, 0.01), 100000);
}

export function clampVolumeInput(val: string): number {
  const numeric = parseFloat(val);
  if (isNaN(numeric) || numeric <= 0) return 500;
  return Math.min(Math.max(numeric, 1), 50000);
}
```

---

## 5. Accessibility (WCAG 2.1 Level AA) Compliance Checklist

- [x] **Color Contrast**: All primary text (`#18181B`) on warm alabaster (`#FAF8F5`) exceeds 11:1 ratio. Muted labels meet >= 4.5:1.
- [x] **Keyboard Navigation**:
  - Global `/` shortcut focuses the search input.
  - Global `C` shortcut toggles the comparison drawer.
  - `Escape` key dismisses any open modal or drawer.
- [x] **Focus Indicators**: High-contrast, 2px ring indicators visible on all focusable inputs, buttons, and links (`focus-visible:ring-2 focus-visible:ring-[#2D5A27]`).
- [x] **Screen Reader Support**: Semantic HTML (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`, `<dialog>`, `<table>` with `<th scope="col">`).
- [x] **Reduced Motion**: Respects `@media (prefers-reduced-motion: reduce)` by disabling all spring physics and card tilt interactions.
