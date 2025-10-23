export default function ContestsParticipated() {
  const contests = [
    { id: 1, name: "Algorithm Challenge", rank: 5 },
    { id: 2, name: "Coding Marathon", rank: 2 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Contests Participated</h2>
      <ul className="bg-gray-50 p-4 rounded-lg shadow-md">
        {contests.map((c, index) => (
          <li key={c.id} className={`p-3 rounded-md mb-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-blue-50 transition-colors duration-200`}>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">{c.name}</span>
              <span className="text-blue-600 font-bold">Rank: {c.rank}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
