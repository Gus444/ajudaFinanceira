import { UserProvider } from './context/userContext'

export const metadata = {
  title: 'Flux',
  description: 'Sistema de gestão financeira',
  icons: {
    icon: 'favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="pt-BR">
        <head>
          {/* CSS do Bootstrap - Carregar primeiro */}
          <link 
            rel="stylesheet" 
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
            crossOrigin="anonymous"
          />
          
          {/* Font Awesome */}
          <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
          />
          
          {/* Fonts do Google */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;600;700&display=swap" 
            rel="stylesheet" 
          />
          
          {/* Seus CSS personalizados - Carregar depois do Bootstrap para sobrescrever quando necessário */}
          <link rel="stylesheet" href="/template/css/login.css" />
          <link rel="stylesheet" href="/template/css/layoutAdmin.css" />
        </head>
        <body>
          {children}
          
          {/* JavaScript do Bootstrap (necessário para componentes interativos) */}
          <script 
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossOrigin="anonymous"
          />
        </body>
      </html>
    </UserProvider>
  )
}