import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add FontAwesome CSS
const fontAwesomeCSS = document.createElement('link');
fontAwesomeCSS.rel = 'stylesheet';
fontAwesomeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css';
document.head.appendChild(fontAwesomeCSS);

// Add title
const titleElement = document.createElement('title');
titleElement.textContent = 'قدراتك - نظام اختبارات القدرات';
document.head.appendChild(titleElement);

createRoot(document.getElementById("root")!).render(<App />);
