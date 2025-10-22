// app/layout.tsx
import './globals.css';
export const metadata = {
  title: 'Prioridades por Dia',
  description: 'Alocação por prioridade com desempate determinístico'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
