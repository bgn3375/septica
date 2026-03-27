import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import AppMobile from './AppMobile.jsx'
import AppDesktop from './AppDesktop.jsx'

function Root() {
  const [mobile, setMobile] = useState(
    () => window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  )

  useEffect(() => {
    const onResize = () => setMobile(
      window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    )
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return mobile ? <AppMobile /> : <AppDesktop />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
