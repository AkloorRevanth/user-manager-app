import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/users", { name, email })
      .then((res) => {
        setUsers((prev) => [...prev, res.data]);
        setName("");
        setEmail("");
      })
      .catch((err) => {
        console.error("Error adding user", err);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:5000/users/${id}`)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting user", err);
      });
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://127.0.0.1:5000/users/${editingUserId}`, {
        name: editName,
        email: editEmail,
      })
      .then((res) => {
        setUsers((prev) =>
          prev.map((user) => (user.id === editingUserId ? res.data : user))
        );
        setEditingUserId(null);
        setEditName("");
        setEditEmail("");
      })
      .catch((err) => {
        console.error("Error updating user", err);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>User Manager</h1>

      {/* Add User Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "8px", flex: "1" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", flex: "1" }}
        />
        <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#1976d2", color: "#fff", border: "none", borderRadius: "4px" }}>
          Add
        </button>
      </form>

      {/* Users List */}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
            {editingUserId === user.id ? (
              <form onSubmit={handleUpdate} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  style={{ padding: "6px", flex: "1" }}
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  style={{ padding: "6px", flex: "1" }}
                />
                <button type="submit" style={{ backgroundColor: "#4caf50", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px" }}>
                  Save
                </button>
                <button
                  onClick={() => setEditingUserId(null)}
                  type="button"
                  style={{ padding: "6px 10px", border: "1px solid #ccc", borderRadius: "4px" }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3 style={{ margin: 0 }}>{user.name}</h3>
                <p style={{ margin: "4px 0" }}>{user.email}</p>
                <button onClick={() => handleEdit(user)} style={{ padding: "5px 10px", marginRight: "5px", backgroundColor: "#ff9800", color: "#fff", border: "none", borderRadius: "4px" }}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
