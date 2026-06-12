import Button from "@/Pages/Admin/Components/Button";

const DosenTable = ({ data = [], onEdit, onDelete, onDetail }) => {
    return (
        <table className="w-full text-sm text-gray-700">
            <thead className="bg-blue-600 text-white">
                <tr>
                    <th className="py-2 px-4 text-left">NIDN</th>
                    <th className="py-2 px-4 text-left">Nama</th>
                    <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {data.map((dsn, index) => (
                    <tr key={dsn.nidn} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        <td className="py-2 px-4">{dsn.nidn}</td>
                        <td className="py-2 px-4">{dsn.nama}</td>
                        <td className="py-2 px-4 text-center space-x-2">
                            <Button onClick={() => onDetail(dsn.id || dsn.nidn)}>
                                Detail
                            </Button>
                            <Button size="sm" variant="warning" onClick={() => onEdit(dsn)}>
                                Edit
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => onDelete(dsn.id || dsn.nidn)}>
                                Hapus
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DosenTable;
