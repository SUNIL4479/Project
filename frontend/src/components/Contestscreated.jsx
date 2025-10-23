import { Link } from "react-router-dom";

export default function ContestsCreated() {
  const created = [
    { id: 1, name: "Frontend Quiz", participants: 120 },
    { id: 2, name: "ReactJS Challenge", participants: 85 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl flex-1 font-semibold text-gray-800">Contests Created</h2>
        <Link to="/dashboard/create-contest" className="border border-gray-600 px-4 py-1 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded shadow-md no-underline">+ Create</Link>
      </div>
      <ul className="bg-gray-50 p-4 rounded-lg shadow-md">
        {created.map((c, index) => (
          <li key={c.id} className={`p-3 rounded-md mb-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-green-50 transition-colors duration-200`}>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">{c.name}</span>
              <span className="text-green-600 font-bold">Participants: {c.participants}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
