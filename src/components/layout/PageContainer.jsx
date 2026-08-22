export default function PageContainer({ size = 'md', className = '', children }) {
  const widths = {
    sm: 'max-w-3xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-none',
  }

  return (
    <main className={`mx-auto w-full ${widths[size]} px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${className}`}>
      {children}
    </main>
  )
}
