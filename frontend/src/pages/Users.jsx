// src/pages/Users.jsx
import { useEffect, useMemo, useState } from 'react'
import URL from '../utils/apiUrl'
import { useAuth } from '../context/AuthContext'
import '../estilos/users.css'

const emptyForm = {
  username: '',
  email: '',
  password: '',
  role: 'user',
  isActive: true,
}

const roleLabels = {
  superadmin: 'Superadmin',
  admin: 'Administrador',
  user: 'Usuario',
}

function Users() {
  const { token, user, assignableRoles } = useAuth()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingUserId, setEditingUserId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const roleOptions = useMemo(() => {
    if (assignableRoles?.length) return assignableRoles
    return user?.role === 'superadmin'
      ? [{ value: 'admin', label: 'Administrador' }, { value: 'user', label: 'Usuario' }]
      : [{ value: 'user', label: 'Usuario' }]
  }, [assignableRoles, user])

  const defaultRole = roleOptions.find((role) => role.value === 'user')?.value || roleOptions[0]?.value || 'user'
  const canEditRole = (role) => roleOptions.some((option) => option.value === role)

  const loadUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${URL}users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No se pudieron cargar los usuarios')
      }

      setUsers(data)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadUsers()
    }
  }, [token])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const resetForm = () => {
    setForm({ ...emptyForm, role: defaultRole })
    setEditingUserId(null)
    setError('')
    setMessage('')
  }

  const startEdit = (selectedUser) => {
    setEditingUserId(selectedUser._id)
    setForm({
      username: selectedUser.username || '',
      email: selectedUser.email || '',
      password: '',
      role: selectedUser.role || 'user',
      isActive: selectedUser.isActive,
    })
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const payload = {
      username: form.username,
      email: form.email,
      role: form.role,
      isActive: form.isActive,
    }

    if (form.password) {
      payload.password = form.password
    }

    try {
      const response = await fetch(`${URL}users${editingUserId ? `/${editingUserId}` : ''}`, {
        method: editingUserId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar el usuario')
      }

      setMessage(editingUserId ? 'Usuario actualizado' : 'Usuario creado')
      resetForm()
      await loadUsers()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const deactivateUser = async (selectedUser) => {
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${URL}users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo desactivar el usuario')
      }

      setMessage('Usuario desactivado')
      await loadUsers()
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page users-page">
      <div className="page-header users-header">
        <div>
          <h1>Gestion de Usuarios</h1>
          <p>Alta y edicion de privilegios</p>
        </div>
      </div>

      <section className="users-grid">
        <form className="user-form" onSubmit={handleSubmit}>
          <h2>{editingUserId ? 'Editar usuario' : 'Nuevo usuario'}</h2>

          <label htmlFor="username">Nombre</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">{editingUserId ? 'Nueva contraseña' : 'Contraseña'}</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required={!editingUserId}
            minLength={8}
          />

          <label htmlFor="role">Privilegio</label>
          <select id="role" name="role" value={form.role} onChange={handleChange}>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>

          {editingUserId && (
            <label className="checkbox-row">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
              />
              Usuario activo
            </label>
          )}

          {error && <p className="users-error">{error}</p>}
          {message && <p className="users-message">{message}</p>}

          <div className="user-form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : editingUserId ? 'Guardar cambios' : 'Crear usuario'}
            </button>
            {editingUserId && (
              <button className="btn btn-secondary" type="button" onClick={resetForm} disabled={saving}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="users-table-panel">
          {loading ? (
            <p className="loading">Cargando usuarios...</p>
          ) : (
            <table className="orders-table users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Privilegio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((listedUser) => (
                  <tr key={listedUser._id}>
                    <td>{listedUser.username}</td>
                    <td>{listedUser.email}</td>
                    <td>{roleLabels[listedUser.role] || listedUser.role}</td>
                    <td>{listedUser.isActive ? 'Activo' : 'Inactivo'}</td>
                    <td>
                      {canEditRole(listedUser.role) ? (
                        <>
                          <button className="btn-action edit" type="button" onClick={() => startEdit(listedUser)}>
                            Editar
                          </button>
                          <button
                            className="btn-action delete"
                            type="button"
                            disabled={saving || !listedUser.isActive}
                            onClick={() => deactivateUser(listedUser)}
                          >
                            Desactivar
                          </button>
                        </>
                      ) : (
                        <span className="protected-user">Protegido</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}

export default Users
