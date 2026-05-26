import { useEffect, useMemo, useState } from "react";
import getMovimientos from "../../controller/movimientos/getMovements.js";
import redondeo from "../../utils/redondeo.js";

const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const baseMovementTypes = [
  "ENTRADA",
  "SALIDA",
  "AJUSTE",
  "PRODUCCION",
  "CONSUMO",
  "VENTA",
  "DEVOLUCIÓN",
  "MERMA",
  "DONACIÓN",
  "PÉRDIDA",
  "CONSUMO INTERNO",
  "AJUSTE_POSITIVO",
  "AJUSTE NEGATIVO"
];

function movimientos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [dateFrom, setDateFrom] = useState(getToday);
  const [dateTo, setDateTo] = useState(getToday);

  useEffect(() => {
    const fetchData = async () => {
      const movimientos = await getMovimientos();
      setData(movimientos);
    };

    fetchData();
  }, []);

  const movementTypes = useMemo(() => {
    const types = data.map((item) => item.type).filter(Boolean);
    return [...new Set([...baseMovementTypes, ...types])];
  }, [data]);

  const filteredProducts = data.filter((item) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const productName = item.product?.name?.toLowerCase() || "";
    const movementType = item.type?.toLowerCase() || "";
    const notes = item.notes?.toLowerCase() || "";
    const movementDate = new Date(item.createdAt).toLocaleDateString("en-CA");

    const matchesSearch =
      normalizedSearch === "" ||
      productName.includes(normalizedSearch) ||
      movementType.includes(normalizedSearch) ||
      notes.includes(normalizedSearch);
    const matchesType = filterType === "" || item.type === filterType;
    const matchesDateFrom = dateFrom === "" || movementDate >= dateFrom;
    const matchesDateTo = dateTo === "" || movementDate <= dateTo;

    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="filter-group no-print">
        <div className="filter-objets">
          <label>Buscar</label>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-objets">
          <label htmlFor="movement-type-filter">Filtrar por tipo:</label>
          <select
            id="movement-type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Todos los movimientos</option>
            {movementTypes.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-objets">
          <label htmlFor="start-date">Desde:</label>
          <input
            type="date"
            id="start-date"
            name="start-date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="filter-objets">
          <label htmlFor="end-date">Hasta:</label>
          <input
            type="date"
            id="end-date"
            name="end-date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <div className="filter-objets filter-actions">
          <button type="button" className="btn-action view" onClick={handlePrint}>
            Imprimir listado
          </button>
        </div>
      </div>

      <div className="print-area">
        <div className="print-header">
          <h1>Listado de movimientos</h1>
          <p>
            Tipo: {filterType || "Todos"} | Desde: {dateFrom || "Sin limite"} |
            Hasta: {dateTo || "Sin limite"} | Total: {filteredProducts.length}
          </p>
        </div>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Movimiento</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Descripcion</th>
                <th>Stock previo</th>
                <th>Consumo</th>
                <th>Stock actual</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((producto, index) => (
                <tr key={producto._id}>
                  <td className="text">{index + 1}</td>
                  <td className="text">{producto.type}</td>
                  <td className="text">
                    {producto.product ? producto.product.name : "Sin producto asociado"}
                  </td>
                  <td className="text">
                    {producto.product ? producto.product.type : "Sin unidad"}
                  </td>
                  <td className="text">{producto.notes}</td>
                  <td>{redondeo(producto.previousStock)}</td>
                  <td>{redondeo(producto.quantity)}</td>
                  <td>{redondeo(producto.newStock)}</td>
                  <td className="text">
                    {new Date(producto.createdAt).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default movimientos;
