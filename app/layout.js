export const metadata = {
  title: 'Social Media Agent',
  description: 'Multi-platform inbox with AI-powered reply drafting',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons@latest/tabler-icons.min.css" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html {
            --color-background-primary: #ffffff;
            --color-background-secondary: #f8f7f6;
            --color-background-tertiary: #f0eeeb;
            --color-background-info: #e6f1fb;
            --color-background-success: #eaf3de;
            --color-background-warning: #faeeda;
            --color-background-danger: #fcebeb;
            
            --color-text-primary: #2c2c2a;
            --color-text-secondary: #888780;
            --color-text-tertiary: #b4b2a9;
            --color-text-info: #185fa5;
            --color-text-success: #3b6d11;
            --color-text-warning: #854f0b;
            --color-text-danger: #a32d2d;
            
            --color-border-tertiary: rgba(0,0,0,0.15);
            --color-border-secondary: rgba(0,0,0,0.3);
            --color-border-primary: rgba(0,0,0,0.4);
            
            --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            --font-serif: 'Georgia', 'Garamond', serif;
            --font-mono: 'Courier New', monospace;
            
            --border-radius-md: 8px;
            --border-radius-lg: 12px;
            --border-radius-xl: 16px;
          }
          
          @media (prefers-color-scheme: dark) {
            html {
              --color-background-primary: #1a1a18;
              --color-background-secondary: #25241f;
              --color-background-tertiary: #2e2d28;
              --color-background-info: #0c447c;
              --color-background-success: #27500a;
              --color-background-warning: #633806;
              --color-background-danger: #791f1f;
              
              --color-text-primary: #e8e7e2;
              --color-text-secondary: #a39f98;
              --color-text-tertiary: #6b6a66;
              --color-text-info: #b5d4f4;
              --color-text-success: #c0dd97;
              --color-text-warning: #fac775;
              --color-text-danger: #f7c1c1;
              
              --color-border-tertiary: rgba(255,255,255,0.1);
              --color-border-secondary: rgba(255,255,255,0.2);
              --color-border-primary: rgba(255,255,255,0.3);
            }
          }
          
          body {
            font-family: var(--font-sans);
            background-color: var(--color-background-tertiary);
            color: var(--color-text-primary);
            line-height: 1.5;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
