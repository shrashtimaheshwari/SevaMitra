module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // soft neutrals for light theme
        'surface': '#f6f7f9',        // page surface
        'panel': '#ffffff',          // cards / panels (slightly brighter)
        'muted': '#6b7280',          // secondary text
        'accent': {
          50:  '#eff6ff',
          100: '#dbeafe',
          300: '#93c5fd',
          500: '#3b82f6',  // primary
          700: '#1e40af'
        },
        'warm-gray-100': '#f3f4f6'
      },
      boxShadow: {
        'soft-lg': '0 8px 24px rgba(16,24,40,0.06)',
        'soft-sm': '0 4px 12px rgba(16,24,40,0.04)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
