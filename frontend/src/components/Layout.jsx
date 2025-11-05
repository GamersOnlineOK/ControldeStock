// src/components/Layout.jsx
import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout