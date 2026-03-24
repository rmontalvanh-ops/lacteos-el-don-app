type Props = {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  cantidad: number;
  onAdd: () => void;
  onRemove: () => void;
  onChange: (cantidad:number) => void;
};

export default function ProductCard({
  nombre,
  descripcion,
  precio,
  imagen,
  cantidad,
  onAdd,
  onRemove,
  onChange
}: Props) {

  return (
    <div className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">

      <img
        src={imagen}
        className="w-24 h-24 object-cover rounded-lg"
      />

      <div className="flex-1">

        <h2 className="text-lg font-bold text-bosque">
          {nombre}
        </h2>

        <p className="text-sm text-gray-500">
          {descripcion}
        </p>

        <p className="text-campo font-bold mt-1">
          L {precio}
        </p>

      </div>

      {/* control cantidad */}

      <div className="flex items-center gap-2">

        <button
          onClick={onRemove}
          className="bg-pink-200 w-8 h-8 rounded"
        >
          -
        </button>

        <input
          type="number"
          value={cantidad}
          min="0"
          onChange={(e)=>onChange(Number(e.target.value))}
          className="w-14 border rounded text-center"
        />

        <button
          onClick={onAdd}
          className="bg-blue-200 w-8 h-8 rounded"
        >
          +
        </button>

      </div>

    </div>
  );

}