import { useState, useRef, useEffect } from "react";
import Pagination from "rc-pagination";
import { cloneDeep } from "lodash";
import { throttle } from "lodash";

interface TableProps {
  data: any[];
  columns: { key: string; label: string }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function Table({ data, columns, onEdit, onDelete }: TableProps) {
  const countPerPage = 5; 
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /*Primeramente con 'cloneDeep' obtenemos los primeros 5 resultados que mostrara en el tbody*/
  const [collection, setCollection] = useState(cloneDeep(data.slice(0, countPerPage)));
  
  /* UseEffect para cuando se actualice los datos */
  useEffect(() => {
    const to = countPerPage * currentPage;
    const from = to - countPerPage;
    setCollection(cloneDeep(data.slice(from, to)));
  }, [data])

  // Función de búsqueda donde utilizamos 'cloneDeep' y 'throttle'
  const searchData = useRef(
    throttle((val: string) => {
      const query = val.toLowerCase();
      setCurrentPage(1);
      const filteredData = cloneDeep(
        data.filter(item => item.name.toLowerCase().indexOf(query) > -1).slice(0, countPerPage)
      );
      setCollection(filteredData);
    }, 400)
  );

  // Controlamos que se esta buscando
  useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      searchData.current(value);
    }
  }, [value]);

  // Función para cambiar de página
  const updatePage = (page: number) => {
    setCurrentPage(page);
    const to = countPerPage * page;
    const from = to - countPerPage;
    setCollection(cloneDeep(data.slice(from, to)));
  };

  // Funcion para obtener datos anidados
  // Le pasamos la ruta y la separamos en arrays con el split, y lo va recoriendo con reduce
  // Ejemplo le indicamos brand.name, en la primera interaccion obtiene brand y luego el name
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  // Filtra las filas de la tabla según las columnas
  const tableRows = (rowData: any) => {
    return (
      <tr key={rowData._id}>
        {columns.map((col, i) => (
          <td key={i}>{getNestedValue(rowData, col.key)}</td>
        ))}
        {onEdit || onDelete ? (
          <td className="flex gap-4">
            {onEdit && (
              <button onClick={() => onEdit?.(rowData._id)} className="btn-warning-outline">
                Editar
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete?.(rowData._id)} className="btn-danger-outline">
                Eliminar
              </button>
            )}
          </td>
        ) : null}
      </tr>
    );
  };

  return (
    <div>
      {/* Buscador */}
      <div>
        <input
          className="input-search"
          type="text"
          placeholder="Buscar"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <table className="basic">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th></th>}
          </tr>
        </thead>
        <tbody>
          {collection.map((item) => tableRows(item))}
        </tbody>
      </table>

      {/* Paginación */}

      <Pagination
        className="custom-pagination flex gap-5 items-center mt-3 curs"
        pageSize={countPerPage}
        onChange={updatePage}
        current={currentPage}
        total={data.length}
        showPrevNextJumpers={false} // Oculta los botones de salto rápido (primero/último)
        itemRender={(page, type, element) => {
          /* Boton anterior */
          if (type === "prev") {
            return currentPage === 1 ? null : ( 
            <button className="px-4 py-2 rounded-md bg-gray-200">Anterior</button>
            )
          }

          /* Boton siguiente */
          if (type === "next") {
            const totalPages = Math.ceil(data.length / countPerPage );
            return currentPage === totalPages ? null : (
              <button className="px-4 py-2 rounded-md bg-gray-200">Siguiente</button>
            )
          }

          /* Numeros */
          return <button
            className={`px-4 py-2 rounded-md ${page === currentPage ? "bg-blue-500 text-white" : "bg-white border border-gray-300"}`}
          >
            {element}
          </button>
        }}
      />


    </div>
  );
}
