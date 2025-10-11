export default function ContestsParticipated() {
  const contests = [
    { id: 1, name: "Algorithm Challenge", rank: 5 },
    { id: 2, name: "Coding Marathon", rank: 2 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Contests Participated</h2>
      <ul className="bg-white p-4 rounded shadow">
        {contests.map(c => (
          <li key={c.id} className="border-b p-2">
            {c.name} — Rank: <strong>{c.rank}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}