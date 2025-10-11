export default function ContestsCreated() {
  const created = [
    { id: 1, name: "Frontend Quiz", participants: 120 },
    { id: 2, name: "ReactJS Challenge", participants: 85 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Contests Created</h2>
      <ul className="bg-white p-4 rounded shadow">
        {created.map(c => (
          <li key={c.id} className="border-b p-2">
            {c.name} — Participants: <strong>{c.participants}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}