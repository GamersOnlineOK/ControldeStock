import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import getIncomingOrders from '../controller/pedidos/getIncomingOrders'
import getOrdersSummary from '../controller/pedidos/getOrdersSummary'

const emptySummary = {
  totalPedidos: 0,
  pendientes: 0,
  completados: 0,
  totalVentas: 0,
  ultimaActualizacion: null,
}

function Home() {
  const location = useLocation()
  const [summary, setSummary] = useState(emptySummary)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState('')

  const fetchSummary = useCallback(async ({ showLoading = false } = {}) => {
    if (showLoading) setLoading(true)

    try {
      const data = await getOrdersSummary()
      setSummary({
        ...emptySummary,
        ...data,
        totalVentas: Number(data.totalVentas || 0),
      })
    } catch (error) {
      setSyncError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const syncOrders = useCallback(async () => {
    setSyncing(true)
    setSyncError('')

    try {
      await getIncomingOrders()
      await fetchSummary()
    } catch (error) {
      setSyncError('No se pudieron sincronizar pedidos de WooCommerce')
    } finally {
      setSyncing(false)
    }
  }, [fetchSummary])

  useEffect(() => {
    fetchSummary({ showLoading: true })
    syncOrders()
  }, [fetchSummary, syncOrders])

  const lastUpdate = summary.ultimaActualizacion
    ? new Date(summary.ultimaActualizacion).toLocaleString('es-AR')
    : 'Sin datos'

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Cargando resumen...</div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard - Control de Stock</h1>
          <p>Ultimo pedido registrado: {lastUpdate}</p>
        </div>
        <button className="btn-primary" type="button" onClick={syncOrders} disabled={syncing}>
          {syncing ? 'Actualizando...' : 'Actualizar pedidos'}
        </button>
      </div>

      {syncError && (
        <p className="dashboard-warning">{syncError}</p>
      )}

      {syncing && (
        <p className="dashboard-sync">Sincronizando WooCommerce en segundo plano...</p>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Pedidos</h3>
          <p className="stat-number">{summary.totalPedidos}</p>
        </div>

        <Link
          to="/pedidos/pedidos-pendientes"
          className={location.pathname === '/pedidos/pedidos-pendientes' ? 'active' : ''}
        >
          <div className="stat-card">
            <h3>Pendientes</h3>
            <p className="stat-number pending">{summary.pendientes}</p>
          </div>
        </Link>
        <Link
          to="/pedidos/pedidos-completados"
          className={location.pathname === '/pedidos/pedidos-completados' ? 'active' : ''}
        >
          <div className="stat-card">
            <h3>Completados</h3>
            <p className="stat-number completed">{summary.completados}</p>
          </div>
        </Link>
        <div className="stat-card">
          <h3>Total Ventas</h3>
          <p className="stat-number sales">${summary.totalVentas.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export default Home
