// src/pages/Users.jsx
import { useState } from 'react'

function Users() {
  const [users] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com' },
    { id: 2, name: 'María García', email: 'maria@email.com' },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com' }
  ])

  return (
    <div className="page">
      <h1>Gestión de Usuarios</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users