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

  // Filtra las filas de la tabla según las columnas
  const tableRows = (rowData: any) => {
    return (
      <tr key={rowData._id}>
        {columns.map((col, i) => (
          <td key={i}>{rowData[col.key]}</td>
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
      {/*<Pagination
        className="flex justify-center mt-4 space-x-2"
        itemRender={(page, type, element) => (
          <button
            className={`px-4 py-2 rounded-md ${
              type === "page" ? "bg-white border border-gray-300" : ""
            } ${page === currentPage ? "bg-blue-500 text-white" : ""}`}
          >
            {element}
          </button>
        )}
        pageSize={countPerPage}
        onChange={updatePage}
        current={currentPage}
        total={data.length}
      />*/}
      <Pagination
        className="custom-pagination"
        pageSize={countPerPage}
        onChange={updatePage}
        current={currentPage}
        total={data.length}
        showPrevNextJumpers={false} // Oculta los botones de salto rápido (primero/último)
        itemRender={(page, type, element) => {
          if (type === "prev") {
            return <button className="px-4 py-2 rounded-md bg-gray-200">Anterior</button>;
          }
          if (type === "next") {
            return <button className="px-4 py-2 rounded-md bg-gray-200">Siguiente</button>;
          }
          return element; // Muestra los números de página normalmente
        }}
      />


    </div>
  );
}
