export const injectStyles = (): void => {
  const styleId = "fitbit-custom-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
        opacity: 0;
      }
      .animate-slide-in-left {
        animation: slideInLeft 0.6s ease-out forwards;
        opacity: 0;
        transform: translateX(-50px);
      }
      .animate-slide-in-right {
        animation: slideInRight 0.6s ease-out forwards;
        opacity: 0;
        transform: translateX(50px);
      }
      .animate-scale-in {
        animation: scaleIn 0.5s ease-out forwards;
        transform: scale(0.9);
        opacity: 0;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #374151;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #6b7280;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }
      .meals-list-container {
        position: sticky;
        top: 6rem;
        height: calc(100vh - 8rem);
      }
      .meals-list-scrollable {
        height: 300px;
        overflow-y: auto;
      }
      .meals-list-scrollable-desktop {
        height: calc(100vh - 22rem);
        overflow-y: auto;
      }
      .app-header {
        position: sticky;
        top: 0;
        z-index: 40;
        background: rgba(17, 24, 39, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(75, 85, 99, 0.3);
      }
      .main-content {
        padding-top: 1rem;
      }
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      @keyframes slideInLeft {
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideInRight {
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes scaleIn {
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      .animate-slide-up {
        animation: slideUp 0.3s ease-out forwards;
      }
      @media (max-width: 1024px) {
        .meals-list-container {
          position: relative;
          height: auto;
          top: 0;
        }
        .meals-list-scrollable-desktop {
          height: 300px;
        }
      }
    `;
    document.head.appendChild(style);
  }
};
