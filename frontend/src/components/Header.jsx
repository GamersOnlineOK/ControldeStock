// src/components/Header.jsx
import '../estilos/Header.css'

function Header() {
  return (
    <header className="header">
      <h2>Mi Sistema Personalizado</h2>
      <nav>
        <a href="#home">Inicio</a>
        <a href="#about">Acerca de</a>
        <a href="#contact">Contacto</a>
      </nav>
    </header>
  )
}

export default Header