import React from "react";

interface TableProps {
  data: any[];
  columns: { key: string; label: string }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function Table({ data, columns, onEdit, onDelete }: TableProps) {


  return (
    <table className="basic">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          {onEdit || onDelete ? <th></th> : null}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((col) => (
              <td key={col.key}>{item[col.key]}</td>
            ))}
            {onEdit || onDelete ? (
              <td className="flex gap-4">
                {onEdit && (
                  <button onClick={() => onEdit?.(item._id)} className="btn-warning-outline">
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete?.(item._id)} className="btn-danger-outline">
                    Eliminar
                  </button>
                )}
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
