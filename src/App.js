import React, { useState, useEffect } from 'react';
import "./index.css";

const city = ['Valsad','surat'];

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, username: '',phone:'',email:'', gender: '', city: city[0], });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
       
      fetch('/data/data-store.json')

        .then(res => res.json())
        .then(data => {
          setUsers(data);
          localStorage.setItem('users', JSON.stringify(data));
        });
    }
  }, []);

  
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  


  const handleSubmit = e => {
    e.preventDefault();
    if (!form.username.trim() ||  !form.phone ||!form.email  || !form.gender || !form.city) {
      alert('Please fill all fields');
      return;
    }

    if (editMode) {
      setUsers(users.map(u => (u.id === form.id ? form : u)));
      setEditMode(false);
    } else {
      const newUser = { ...form, id: Date.now() };
      setUsers([...users, newUser]);
    }
    setForm({ id: null, username: '',phone:'',email:'', gender: '', city: city[0] });
  };

  const handleEdit = id => {
    const user = users.find(u => u.id === id);
    setForm(user);
    setEditMode(true);
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  
  const handleSave = () => {
    localStorage.setItem('users', JSON.stringify(users));
  
    setMessage('Data saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

 
  const resetData = () => {
    localStorage.removeItem('users');
    window.location.reload();
  };

  return (
    <div className="container">
      <center><h1>Patient Regsition
        </h1></center>
     <center> <form onSubmit={handleSubmit} className="form">
        <label>Name : </label>
        <input 
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="input-text"
        />
        <br>
        </br>
        <label>
          Phone no : 
</label>
           <input
          type="text"
          name="phone"
          placeholder="phone"
          value={form.phone}
          onChange={handleChange}
          className="input-text"
        />
        <br>
        </br>
         <label>
          Email : 
</label>
         <input
          type="email"
          name="email"
          placeholder="eamil"
          value={form.email}
          onChange={handleChange}
          className="input-text"
        />

        <div className="gender-group">
          Gender:
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === 'male'} onChange={handleChange} />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === 'female'}
              onChange={handleChange}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={form.gender === 'other'}
              onChange={handleChange}
            />
            Other
          </label>
        </div>
        <select name="city" value={form.city} onChange={handleChange} className="select ">
       
          {city.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit" className="btn submit-btn">{editMode ? 'Update' : 'Add'}</button>
      </form></center>
          
      <div className="buttons-row">
        <button onClick={handleSave} className="btn save-btn">Save Data</button>
        <button onClick={resetData} className="btn reset-btn">Reset Data</button>
      </div>

      {message && <div className="message">{message}</div>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Gender</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No users found</td>
            </tr>
          )}
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
                  <td>{u.phone}</td>
               <td>{u.email}</td>
            
              <td>{u.gender}</td>
              <td>{u.city}</td>
              <td>
                <button onClick={() => handleEdit(u.id)} className="btn edit-btn">Edit</button>
                <button onClick={() => handleDelete(u.id)} className="btn delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;



