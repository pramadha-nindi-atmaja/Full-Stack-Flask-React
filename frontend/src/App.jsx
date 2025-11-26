import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import ContactForm from "./ContactForm";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch contacts when search term changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContacts(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Fetch data from API
  const fetchContacts = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const url = search 
        ? `http://127.0.0.1:5000/contacts?search=${encodeURIComponent(search)}`
        : "http://127.0.0.1:5000/contacts";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setError("Failed to load contacts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact(null);
  };

  const openCreateModal = () => {
    if (!isModalOpen) {
      setCurrentContact(null);
      setIsModalOpen(true);
    }
  };

  const openEditModal = (contact) => {
    if (!isModalOpen) {
      setCurrentContact(contact);
      setIsModalOpen(true);
    }
  };

  const handleUpdate = () => {
    closeModal();
    fetchContacts();
  };

  return (
    <div className="App">
      <h1>Contact Manager</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p>Loading contacts...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <ContactList
          contacts={contacts}
          updateContact={openEditModal}
          updateCallback={handleUpdate}
        />
      )}

      <button className="create-btn" onClick={openCreateModal}>
        + Create New Contact
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <ContactForm
              existingContact={currentContact}
              updateCallback={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
