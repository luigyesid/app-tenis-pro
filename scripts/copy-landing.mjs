// Copia la landing de ventas (carpeta landing/) a dist/landing para que Netlify la sirva en /landing/.
import { cpSync } from 'node:fs'

cpSync('landing', 'dist/landing', {
  recursive: true,
  filter: (src) => !src.includes('/scripts'),
})
console.log('landing copiada a dist/landing')
