export default function Profile() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> johndoe@example.com</p>
        <p><strong>Joined:</strong> January 2025</p>
      </div>
    </div>
  );
}